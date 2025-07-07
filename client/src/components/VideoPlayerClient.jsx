import React, { forwardRef } from 'react';
import { FaDownload } from 'react-icons/fa';

const VideoPlayer = forwardRef(({ video, isLoading, error }, ref) => {
    return (
        <div className="flex-1 w-full bg-zinc-900 p-4 rounded-lg">
                <h2 className="text-xl break-words mb-4">
                    {video ? video.title : 'Loading...'}
                </h2>
            {isLoading ? (
                <div className="w-full aspect-video flex items-center justify-center bg-zinc-900 rounded-lg">
                    <div className="animate-spin border-4 border-gray-400 border-t-white rounded-full w-12 h-12"></div>
                </div>
            ) : video ? (
                <div className="w-full max-w-full overflow-hidden rounded-lg bg-black">
                    <video ref={ref} controls className="w-full h-[70vh] aspect-video">
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-zinc-900 rounded-lg">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
        </div>
    );
});

export default VideoPlayer;