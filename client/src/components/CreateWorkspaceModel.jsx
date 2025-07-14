import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useWorkspaceContext } from "../context/WorkspaceContext";
import PlanConfig from "../config/planConfig";
import { useAuth } from "../context/authContext";

const API = import.meta.env.VITE_API_URL;

function CreateWorkspaceModal({ setShowModal, currentPlan }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {user, token} = useAuth();

  const { workspaces, setWorkspaces } = useWorkspaceContext();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    const limit = PlanConfig[user.plan]?.maxWorkspaces;
    if (workspaces.length >= limit) {
      setError(`You've reached your limit of ${limit} workspaces. Please upgrade your plan.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create workspace.");
      setWorkspaces((prev) => [...prev, data]);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleCreate();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-lg font-bold">Create New Workspace</h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-1 text-zinc-400 hover:text-white"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <label htmlFor="workspace-name" className="block text-sm font-medium text-zinc-300 mb-3">
            Workspace Name
          </label>
          <input
            id="workspace-name"
            type="text"
            placeholder="e.g., Q4 Marketing Campaign"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-md placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            autoFocus
          />
        </div>

        <div className="flex justify-end p-4 bg-zinc-800/50 rounded-b-lg space-x-3">
          <button
            className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 font-semibold"
            onClick={() => setShowModal(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 w-32 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
            onClick={handleCreate}
            disabled={loading || !name.trim()}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspaceModal;
