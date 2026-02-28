"use client";

import { useState } from "react";
import FileUploader from "@/app/components/FileUploade";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customThumbnail, setCustomThumbnail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSuccess = async (res) => {
    try {
      const videoData = {
        title: title || res.name,
        description: description || "No description provided.",
        videoUrl: res.url,
        thumbnailUrl: customThumbnail || res.thumbnailUrl || res.url,
      };

      console.log("Imagekit payload:", res);
      const savedVideo = await apiClient.createVideo(videoData);
      console.log("Video saved:", savedVideo);
      router.push("/");
    } catch (err) {
      console.error("Failed to save video:", err);
      alert("Failed to save video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProgress = (prog) => {
    setProgress(prog);
    setIsUploading(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      {/* Background Gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
          <p className="text-zinc-400">Share your moments with the world. High quality MP4 formats work best.</p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Video Title</label>
              <input
                type="text"
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Custom Thumbnail URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={customThumbnail}
                onChange={(e) => setCustomThumbnail(e.target.value)}
                disabled={isUploading}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Description</label>
              <textarea
                placeholder="Tell viewers about your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                rows={4}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-300 ml-1">Video File</label>

            <div className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center
              ${isUploading ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'}
            `}>

              {!isUploading ? (
                <>
                  <div className="w-16 h-16 mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Select a video to upload</h3>
                  <p className="text-sm text-zinc-500 mb-6">MP4, WebM or OGG up to 100MB</p>

                  <div className="absolute inset-0 z-20 w-full h-full">
                    <FileUploader
                      fileType="video"
                      onSuccess={handleSuccess}
                      onProgress={handleProgress}
                    />
                  </div>
                </>
              ) : (
                <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                  <div className="w-16 h-16 mb-6 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <h3 className="text-lg font-semibold text-white mb-2">Uploading your video...</h3>
                  <div className="w-full bg-zinc-950 rounded-full h-3 max-w-xs overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-indigo-400 mt-4 font-medium">{progress}% Complete</p>
                  <p className="text-xs text-zinc-500 mt-2">Please don't close this page</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}