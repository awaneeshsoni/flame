import { useState } from "react";
const API = import.meta.env.VITE_API_URL;

function CreateWorkspaceModal({ setShowModal, setWorkspaces }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-4">Create Workspace</h2>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded mb-4 bg-[#0f172a] text-white placeholder-gray-400"
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setShowModal(false)}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300 flex items-center"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? <span className="loader mr-2"></span> : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspaceModal;
