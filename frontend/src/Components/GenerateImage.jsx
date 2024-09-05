import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../Utils/firebase";

const GenerateImage = () => {
  const [prompt, setprompt] = useState('');
  const [generating, setgenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const navigate = useNavigate();
  
  const user = auth?.currentUser;
  const name = auth?.currentUser?.displayName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setgenerating(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-image",
        { prompt }
      );
      setGeneratedImage(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    }
    setgenerating(false);
  };

  const handlePost = async () => {
    const userId = user?.uid; 
    try {
      await axios.post("http://localhost:5000/api/share", {
        name,
        prompt,
        imageUrl: generatedImage,
        userId,
      });
      alert("Image posted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error posting image:", error);
      alert("Failed to post image. Please try again.");
    }
  };

  const shareViaLink = () => {
    navigator.clipboard.writeText(generatedImage).then(() => {
      alert("Image link copied to clipboard!");
    });
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const shareViaWhatsApp = () => {
    const text = `Check out this AI-generated image: ${prompt}`;
    const url = `https://wa.me/?text=${encodeURIComponent(
      text + " " + generatedImage
    )}`;
    window.open(url, "_blank");
  };

  const shareViaEmail = () => {
    const subject = "Check out this AI-generated image";
    const body = `I created this amazing AI-generated image: ${prompt}\n\n${generatedImage}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };
  

  return (
    <div className="mx-32 mb-56 min-h-[54vh]">
      <h1 className="my-10 font-bold text-4xl text-center">
        Create Your AI Art
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => {setprompt(e.target.value);}}
          className=" h-14 w-3/5 py-3 px-5 font-medium text-xl rounded-l-full border-neutral-500 border-2"
          placeholder="Enter Prompt"
        />
        <button className="h-14 px-10 rounded-r-full text-xl bg-neutral-500 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500">
          {generating ? "Generating..." : "Generate"}
        </button>
      </form>

      {generatedImage ? (
        <div className="w-full mt-8 flex flex-col items-center">
          <div className="rounded-xl overflow-hidden my-6">
            <img src={generatedImage} alt="Oooops... Bad Luck" />
          </div>
          <div className="flex flex-wrap justify-center w-3/6">
            <button className="mx-4 mb-4 px-12 py-3 text-lg font-semibold bg-green-300 rounded-xl hover:shadow-lg hover:shadow-black transition-all duration-300" onClick={handlePost}>Post to Community</button>
            <button className="mx-4 mb-4 px-12 py-3 text-lg font-semibold bg-orange-300 rounded-xl hover:shadow-lg hover:shadow-black transition-all duration-300" onClick={downloadImage}>Download to Device</button>
            <button className="mx-4 mb-4 px-8 py-3 text-lg font-semibold bg-red-300 rounded-xl hover:shadow-lg hover:shadow-black transition-all duration-300" onClick={shareViaLink}>Share Link</button>
            <button className="mx-4 mb-4 px-8 py-3 text-lg font-semibold bg-cyan-300 rounded-xl hover:shadow-lg hover:shadow-black transition-all duration-300" onClick={shareViaWhatsApp}>Share via WhatsApp</button>
            <button className="mx-4 mb-4 px-8 py-3 text-lg font-semibold bg-violet-300 rounded-xl hover:shadow-lg hover:shadow-black transition-all duration-300" onClick={shareViaEmail}>Share via Email</button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default GenerateImage;
