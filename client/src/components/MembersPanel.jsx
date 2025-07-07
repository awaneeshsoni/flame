import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import PlanConfig from '../config/planConfig';

function MembersPanel({ workspace }) {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCode, setInviteCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(workspace?.members || []);
  const { wsid } = useParams();
  const API = import.meta.env.VITE_API_URL;

  const currentUserId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("plan");

  useEffect(() => {
    setMembers(workspace?.members || []);
  }, [workspace]);

  const handleGenerateInvite = async () => {
    const maxAllowed = PlanConfig[userPlan].maxMembersPerWorkspace;
    if (members.length >= maxAllowed) {
      setError(`Your ${userPlan} plan allows only ${maxAllowed} members.`);
      return;
    }

    if (!inviteEmail.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/workspace/${workspace._id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: inviteEmail, wsid })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setInviteCode(data.code);
    } catch (err) {
      setError(err.message || err.error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await fetch(`${API}/api/workspace/${workspace._id}/remove-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ memberId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      alert(err.message);
    }
  };

  const isCreator = workspace?.creator?._id === currentUserId;

  return (
    <aside className="hidden md:block w-64 bg-zinc-900 p-6 border-l border-white/10 relative">
      <h3 className="text-base font-semibold mb-2">Members</h3>

      {members.length > 0 ? (
        members.map((m) => (
          <div key={m._id} className="bg-zinc-700 flex items-center justify-between px-4 py-2 rounded mb-2 text-sm">
            <span className="flex items-center gap-1">
              {m.name}
              {m._id === workspace?.creator?._id && (
                <span className="text-orange-400 text-xs">(creator)</span>
              )}
            </span>

            {isCreator && m._id !== workspace.creator._id && (
              <button
                className="text-red-400 hover:text-red-500"
                onClick={() => handleRemoveMember(m._id)}
              >
                <FaTrash size={13} />
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-white/70 text-sm">No members yet</p>
      )}

      {/* Only creator can add members */}
      {isCreator && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowInvitePopup(true)}
            className="flex w-full items-center gap-2 bg-zinc-300 text-black mt-2 py-2 px-4 rounded hover:bg-white text-sm font-medium"
          >
            <FaUserPlus /> Add Member
          </button>
        </div>
      )}

      {showInvitePopup && (
        <div className="absolute w-52 mt-2 z-50 p-3 border border-zinc-600 rounded bg-zinc-800 text-sm shadow-lg">
          <button
            onClick={() => setShowInvitePopup(false)}
            className="absolute top-2 right-2 text-zinc-400 hover:text-red-400"
          >
            <FaTimes />
          </button>

          <label className="block mb-2 text-white/80">Enter Email</label>
          <input
            type="email"
            className="w-full p-2 mb-2 rounded bg-zinc-700 text-white border border-zinc-600"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="example@email.com"
          />

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

          <button
            onClick={handleGenerateInvite}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Generate Invite Code"
            )}
          </button>

          {inviteCode && (
            <div className="mt-3 break-all text-green-400">
              Code: <span className="font-mono">{inviteCode}</span>
              <button
                className="text-orange-500 cursor-pointer ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  alert("Code copied");
                }}
              >
                copy
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default MembersPanel;
