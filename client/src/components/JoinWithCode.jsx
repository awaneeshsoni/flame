import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function JoinWithCode() {
    const [showJoinPopup, setShowJoinPopup] = useState(false);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleJoin = async () => {
        if (!code.trim()) return;
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const res = await fetch(`${API}/api/workspace/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();
            setMessage("Joined workspace successfully!");
            setCode("");
            if (res.ok) {
                navigate(`/workspace/${data.wsid}`)
            }
            if (!res.ok) throw new Error(data.message);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowJoinPopup(true)}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-2 rounded text-sm font-medium"
            >
                Join with Code
            </button>

            {/* Floating Popup */}
            {showJoinPopup && (
                <div className="absolute top-14 right-0 w-60 z-50 p-4 border border-zinc-600 rounded bg-zinc-800 shadow-lg text-sm">

                    <button
                        onClick={() => setShowJoinPopup(false)}
                        className="absolute top-2 right-2 text-zinc-400 hover:text-red-400"
                    >
                        <FaTimes />
                    </button>

                    <label className="block mb-2 text-white/80">Enter Invite Code</label>
                    <input
                        type="text"
                        className="w-full p-2 mb-2 rounded bg-zinc-700 text-white border border-zinc-600"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter invite code"
                    />

                    {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                    {message && <p className="text-green-400 text-xs mb-2">{message}</p>}

                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded"
                    >
                        {loading ? "Joining..." : "Join"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default JoinWithCode;
