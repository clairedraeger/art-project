"use client";
import { useEffect, useState } from "react";

export default function FinalImagePage() {
  const [imageUrl, setImageUrl] = useState(null);

  // fetch the most recent image URL from the server
  const fetchImageUrl = async () => {
    try {
      const res = await fetch("https://art-backend-6mu2.onrender.com/imagehost/get");
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        console.log("No image URL found.");
      }
    } catch (err) {
      console.error("Failed to fetch image URL", err);
    }
  };

  useEffect(() => {
    fetchImageUrl();

    // refresh every 10 seconds to get the most recent image URL
    const intervalId = setInterval(() => {
      fetchImageUrl();
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,

        overflow: "hidden", // no overflow
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Final Image"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "fit", 
            // width: "100%", 
            // height: "auto",
            // objectFit: "cover"
          }}
        />
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
