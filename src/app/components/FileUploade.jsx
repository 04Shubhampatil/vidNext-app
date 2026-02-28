"use client";

import { useState } from "react";
import { upload } from "@imagekit/next";

const FileUploader = ({ fileType = "image", onSuccess, onProgress }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!file) return false;

    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("File type not supported");
        return false;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("File too large");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_KEY,
        signature: auth.authenticationParams.signature,
        expire: auth.authenticationParams.expire,
        token: auth.authenticationParams.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log(err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {error && <span className="absolute bottom-4 left-0 right-0 text-center text-red-400 text-sm font-medium bg-zinc-950/80 p-2 rounded-lg">{error}</span>}
    </>
  );
};

export default FileUploader;