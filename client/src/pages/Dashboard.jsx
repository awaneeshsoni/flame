import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "../components/createWorkspaceModel";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const API = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await fetch(`${API}/api/workspace`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setWorkspaces(data);
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      }
    };

    fetchWorkspaces();
  }, []);

  const placeholderWorkspaces = [
    { _id: "1", name: "Example Workspace 1", icon: "📂" },
    { _id: "2", name: "Example Workspace 2", icon: "🚀" },
  ];

  return (
    <div className="bg-blue-700">
      <Navbar />
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Create Workspace
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-3 px- py-3">Your Workspaces</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[...workspaces].map((ws) => (
          <div
            key={ws._id}
            className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer transition transform hover:scale-105 hover:bg-gray-700 aspect-square w-60"
            onClick={() => navigate(`/workspace/${ws._id}`)}
          >
            <div className="text-5xl mb-1">{ws.icon || "📁"}</div>
            <h3 className="text-1xl font-medium text-white text-center">{ws.name}</h3>
          </div>
        ))}
      </div>

      {showModal && <CreateWorkspaceModal setShowModal={setShowModal} setWorkspaces={setWorkspaces} />}
    </div>
    <Footer />
    </div>
  );
}

export default Dashboard;
