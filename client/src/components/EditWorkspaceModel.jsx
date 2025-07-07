import { useState } from "react";
import { FaTimes, FaTrash, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function EditWorkspaceModal({ workspace, setShowModal, setWorkspaces }) {
  const [name, setName] = useState(workspace.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/workspace/${workspace._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok) {
        setWorkspaces((prev) =>
          prev.map((w) => (w._id === workspace._id ? { ...w, name } : w))
        );
        setShowModal(false);
      }
      if (!res.ok) throw new Error(data.message || "Failed to update workspace.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this workspace?");
    if (!confirmed) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/workspace/${workspace._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete workspace");

      setWorkspaces((prev) => prev.filter((w) => w._id !== workspace._id));
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleUpdate();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-lg font-bold">Edit Workspace</h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-1 text-zinc-400 hover:text-white"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Workspace Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-md placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-b-lg">
          <button
            onClick={handleDelete}
            className="flex items-center ml-2 opacity-50 text-red-500 hover:text-red-400 text-sm font-semibold"
            disabled={loading}
          >
            <FaTrash className="mr-2" />
            Delete
          </button>

          <div className="space-x-3 flex">
            <button
              className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 font-semibold"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 w-32 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
              onClick={handleUpdate}
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditWorkspaceModal;
