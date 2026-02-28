"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  let hoverTimeout;
  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (videoId) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await fetch(`/api/videos?id=${videoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setVideos(videos.filter((v) => v._id !== videoId));
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete video");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight">
            Latest Videos
          </h1>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-indigo-500/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No videos yet</h2>
            <p className="text-zinc-400 max-w-sm text-center">
              Be the first to share your moments. Upload a video to see it appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video) => (
              <div
                key={video._id}
                className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="aspect-video relative overflow-hidden bg-zinc-950">
                  <video
                    src={video.videoUrl}
                    poster={video.thumbnailUrl}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget;
                      hoverTimeout = setTimeout(() => {
                        video.play().catch(() => { });
                      }, 150);
                    }}
                    onMouseLeave={(e) => {
                      clearTimeout(hoverTimeout);
                      const video = e.currentTarget;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <button
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl pointer-events-auto"
                    >
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                      {video.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white">
                        {video.userId?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs text-zinc-500 truncate max-w-[100px]">
                        {video.userId?.email || 'Unknown'}
                      </span>
                    </div>

                    {session?.user?.id === video.userId?._id && (
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group/btn"
                        title="Delete video"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
