import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "../components/CreateWorkspaceModel";
import EditWorkspaceModal from "../components/EditWorkspaceModel";
import Footer from "../components/Footer";
import { FaPen } from "react-icons/fa";
import JoinWithCode from "../components/JoinWithCode";
import { useWorkspaceContext } from "../context/WorkspaceContext";
import { useAuth } from "../context/authContext";

const API = import.meta.env.VITE_API_URL;

function Dashboard() {
  const {workspaces, setWorkspaces} = useWorkspaceContext();
  const [showModal, setShowModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth();
  const plan = user.plan;
  const userId = user._id;


  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-xl font-semibold">Your Workspaces</h1>

          <div className="flex flex-wrap gap-3 items-center">
              <JoinWithCode />
            <button
              onClick={() => setShowModal(true)}
              title="Create Workspace"
              className="h-9 bg-orange-600 hover:bg-orange-700 text-white px-4 rounded-md text-sm font-medium shadow transition-all flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              <p className="hidden sm:inline">Create Workspace</p>
            </button>
          </div>
        </div>

        {workspaces.length === 0 ? (
          <p className="text-sm text-white/70">
            No workspaces yet. Create one to get started.
          </p>
        ) : (
          <ul className="space-y-4">
            {workspaces.map((ws) => (
              <li
                key={ws._id}
                className="flex items-center justify-between bg-zinc-800 p-4 rounded hover:bg-zinc-700 border-b border-white/10 pb-2 text-sm sm:text-base"
              >
                <div

                  onClick={() => navigate(`/workspace/${ws._id}`)}
                  className="flex cursor-pointer items-center gap-2 hover:text-orange-600 transition"
                >
                  <span className="text-lg">{ws.icon || "📁"}</span>
                  <div className="flex flex-col">
                    <span>{ws.name}</span>
                    <span className="text-xs text-white/40">
                      Created by: {ws.creator?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                {ws.creator?._id === userId && (
                  <button
                    onClick={() => setEditingWorkspace(ws)}
                    className="cursor-pointer text-white/40 hover:text-orange-500 text-sm"
                    title="Edit"
                  >
                    <FaPen />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      {showModal && (
        <CreateWorkspaceModal
          setShowModal={setShowModal}
          currentPlan={plan}
        />
      )}

      {editingWorkspace && (
        <EditWorkspaceModal
          workspace={editingWorkspace}
          setWorkspaces={setWorkspaces}
          setShowModal={() => setEditingWorkspace(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;
