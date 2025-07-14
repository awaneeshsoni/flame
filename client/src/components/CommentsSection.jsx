import React from 'react';
import { FaTrashAlt, FaCheckCircle } from "react-icons/fa";

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
}

function CommentsSection({
    comments,
    isLoading,
    error,
    name,
    setName,
    commentText,
    setCommentText,
    onAddComment,
    onCommentClick,
    onCommentTextFocus,
    onToggleTick,
    onDeleteComment,
}) {
    const handleDelete = (commentId) => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (confirmed) onDeleteComment(commentId);
    };

    return (
        <aside className="w-full md:w-[380px] md:max-w-[380px] bg-zinc-900 p-4 rounded-lg flex flex-col flex-shrink-0 h-[80vh] ">
            <h3 className="text-xl font-bold mb-3">Comments</h3>
            {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

            <div className="w-full p-2 border border-zinc-700 rounded mb-2 bg-zinc-800 flex items-center">
                <span className="mr-2 opacity-50 text-sm">Name:</span>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-white text-sm"
                />
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center pt-8">
                        <div className="animate-spin border-4 border-gray-400 border-t-white rounded-full w-8 h-8"></div>
                    </div>
                ) : (
                    comments.map((c) => (
                        <div
                            key={c._id}
                            className="relative p-3 bg-zinc-800 rounded-md group hover:bg-zinc-700"
                        >
                            <button
                                onClick={() => onToggleTick(c._id, !c.ticked)}
                                title="Mark as done"
                                className="absolute top-2 right-2"
                            >
                                <FaCheckCircle
                                    className={`text-lg transition ${
                                        c.ticked ? "text-orange-500" : "text-gray-400"
                                    }`}
                                />
                            </button>

                            <p className="text-sm font-bold text-white">{c.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400 mb-1">
                                {formatDateTime(c.date)}
                            </p>

                            <p
                                className="text-white text-sm break-words cursor-pointer"
                                onClick={() => onCommentClick(c.timestamp)}
                            >
                                {c.text || "No comment text"}
                            </p>

                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-400">
                                    ⏳ {c.timestamp !== undefined ? `${parseFloat(c.timestamp).toFixed(2)}s` : "—"}
                                </p>
                                <button
                                    onClick={() => handleDelete(c._id)}
                                    className="text-red-500 opacity-60 hover:opacity-100 text-sm"
                                    title="Delete comment"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-2 border-t border-zinc-700">
                <textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onFocus={onCommentTextFocus}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-2 border border-zinc-700 rounded bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    rows="3"
                />
                <button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded mt-2 font-semibold"
                    onClick={onAddComment}
                >
                    Add Comment
                </button>
            </div>
        </aside>
    );
}

export default CommentsSection;
