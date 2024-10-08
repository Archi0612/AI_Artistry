import React, { useState, useEffect } from "react";
import ImageCard from "./ImageCard";
import axios from "axios";
import ShimmerImageCard from "./ShimmerImageCard";

const CommunityPage = () => {
  const [posts, setPosts] = useState(null);
  const [popup, setpopup] = useState(false);
  // const [loading, setLoading] = useState(true);

  const [show, setShow] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
      console.log(posts);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // setLoading(false);
      // If there's an error or no posts, use sample data
      setSamplePosts();
    }
  };

  const setSamplePosts = () => {
    const samplePosts = [
      {
        _id: "1",
        name: "Alice",
        prompt: "A serene lake at sunset",
        imageUrl: "https://picsum.photos/seed/1/400/300",
      },
      {
        _id: "2",
        name: "Bob",
        prompt: "A futuristic cityscape",
        imageUrl: "https://picsum.photos/seed/2/400/300",
      },
      {
        _id: "3",
        name: "Charlie",
        prompt: "A mystical forest",
        imageUrl: "https://picsum.photos/seed/3/400/300",
      },
      {
        _id: "1",
        name: "Alice",
        prompt: "A serene lake at sunset",
        imageUrl: "https://picsum.photos/seed/1/400/300",
      },
      {
        _id: "2",
        name: "Bob",
        prompt: "A futuristic cityscape",
        imageUrl: "https://picsum.photos/seed/2/400/300",
      },
      {
        _id: "3",
        name: "Charlie",
        prompt: "A mystical forest",
        imageUrl: "https://picsum.photos/seed/3/400/300",
      },
    ];
    setPosts(samplePosts);
  };

  const shareViaLink = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      alert("Image link copied to clipboard!");
    });
  };

  const downloadImage = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${prompt
        .replace(/\s+/g, "-")
        .toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const shareViaWhatsApp = (prompt, imageUrl) => {
    const text = `Check out this AI-generated image: ${prompt}`;
    const url = `https://wa.me/?text=${encodeURIComponent(
      text + " " + imageUrl
    )}`;
    window.open(url, "_blank");
  };

  const shareViaEmail = (prompt, imageUrl) => {
    const subject = "Check out this AI-generated image";
    const body = `I found this amazing AI-generated image: ${prompt}\n\n${imageUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return posts ? (
    <div className="mb-20 min-h-screen">
      {popup ? (
        <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 bg-black/85">
          <div
            onClick={() => {
              setpopup(false);
            }}
            className="w-14 h-14 fixed top-10 right-10 cursor-pointer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/10728/10728089.png"
              alt="close"
            />
          </div>

          <div className="flex w-[70%] bg-gray-300 rounded-xl overflow-hidden">
            <div className="w-[70%]">
              <img
                className="w-full"
                src={show.imageURL}
                alt="Currently not Available"
              />
            </div>
            <div className="w-[30%] p-7">
              <p className="text-2xl font-bold">{show.prompt}</p>
              <p className="mt-2 text-xl">
                Generated by{" "}
                <span className="text-xl font-semibold">{show.name}</span>
              </p>
              <div className="mt-10 flex flex-col items-start">
                <p className="font-semibold text-xl">Share Image :</p>
                <button
                  onClick={() => shareViaLink(show.imageURL)}
                  className="px-6 py-2 bg-zinc-500 rounded-lg my-2"
                >
                  Share Link
                </button>
                <button
                  onClick={() => downloadImage(show.imageURL, show.prompt)}
                  className="px-6 py-2 bg-zinc-500 rounded-lg my-2"
                >
                  Download to Device
                </button>
                <button
                  onClick={() => shareViaWhatsApp(show.prompt, show.imageURL)}
                  className="px-6 py-2 bg-zinc-500 rounded-lg my-2"
                >
                  Share via WhatsApp
                </button>
                <button
                  onClick={() => shareViaEmail(show.prompt, show.imageURL)}
                  className="px-6 py-2 bg-zinc-500 rounded-lg my-2"
                >
                  Share via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {/* Heading of Showcase */}
      <div className="h-72 mb-5 flex flex-col justify-center overflow-hidden">
        <div className="absolute h-72 -z-10 overflow-hidden">
          <img src="communityBG.jpg" />
        </div>
        <h1 className=" font-bold text-4xl text-center">Community ShowCase</h1>
        <p className="my-2 font-semibold text-center text-lg italic">
          Here are some shared images by user which is generated by Ai and
          prompts given by user
        </p>
      </div>

      {/* Content will show here */}
      <div className=" mx-30 flex flex-wrap justify-evenly">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => {
              setpopup(true);
              // setShowUrl(post.imageUrl);
              // setShowName(post.name);
              // setShowPrompt(post.prompt);
              setShow({
                imageURL: post.imageUrl,
                name: post.name,
                prompt: post.prompt,
                // ************************************************************* HAVE TO ADD USER-ID & POST-ID
                // createdById: uid,
              });
            }}
          >
            <ImageCard prompt={post} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <ShimmerImageCard />
  );
};

export default CommunityPage;
