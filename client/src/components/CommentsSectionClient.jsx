import React from 'react';

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
}


function ClientCommentsSection({
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
}) {
    return (
        <aside className="w-full md:w-[380px] md:max-w-[380px] bg-zinc-900 p-4 rounded-lg flex flex-col flex-shrink-0 h-[80vh] ">
            <h3 className="text-xl font-bold mb-1 flex-shrink-0">Comments</h3>
            <p className="text-sm text-zinc-400 mb-3 flex-shrink-0">Click a comment to jump to that moment.</p>

            {error && <p className="text-red-500 mb-2 text-sm flex-shrink-0">{error}</p>}

            <div className="w-full p-2 border border-zinc-700 rounded mb-2 bg-zinc-800 flex items-center flex-shrink-0">
                <span className="mr-2 opacity-50 text-sm">Name:</span>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-white text-sm"
                />
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {comments.length === 0 && !isLoading ? (
                    <p className="text-zinc-500 text-center pt-4">No comments yet.</p>
                ) : (
                    comments.map((c, index) => (
                        <div
                            key={index}
                            className="p-3 bg-zinc-800 rounded-md cursor-pointer hover:bg-zinc-700"
                            onClick={() => onCommentClick(c.timestamp)}
                        >
                            <p className="text-sm font-bold text-white">{c.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400 mb-1">
                                {formatDateTime(c.date)}
                            </p>
                            <p className="text-white text-sm break-words">{c.text || "No comment text"}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                ⏳ {c.timestamp !== undefined ? `${parseFloat(c.timestamp).toFixed(2)}s` : "No timestamp"}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-2 border-t border-zinc-700 flex-shrink-0">
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

export default ClientCommentsSection;