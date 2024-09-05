const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a schema for the posts
const postSchema = new mongoose.Schema({
  name: String,
  prompt: String,
  imageUrl: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    console.log("Sending request to Stability AI...");
    const response = await axios({
      method: "post",
      url: "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      data: {
        text_prompts: [
          {
            text: prompt,
          },
        ],
        cfg_scale: 7,
        height: 768,
        width: 1344,
        steps: 30,
        samples: 1,
      },
    });

    console.log("Received response from Stability AI");

    if (
      response.data &&
      response.data.artifacts &&
      response.data.artifacts.length > 0
    ) {
      const base64Image = response.data.artifacts[0].base64;

      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64Image}`
      );
      console.log("Image uploaded to Cloudinary");

      res.json({ imageUrl: cloudinaryResponse.secure_url });
    } else {
      console.error(
        "Unexpected response structure:",
        JSON.stringify(response.data, null, 2)
      );
      res
        .status(500)
        .json({ error: "Unexpected response from image generation API" });
    }
  } catch (error) {
    console.error(
      "Error in image generation:",
      error.response
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    res
      .status(500)
      .json({ error: "Failed to generate image", details: error.message });
  }
});

app.post("/api/share", async (req, res) => {
  try {
    const { name, prompt, imageUrl, userId } = req.body;
    // const userId = req.body.userId;
    const post = new Post({ name, prompt, imageUrl, userId });
    await post.save();
    res.status(201).json({ message: "Post shared successfully" });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({ error: "Failed to share post" });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
// Delete the post
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query; // Get the userId from the request query

  try {
    // Check if the post ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    // Delete the post
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
