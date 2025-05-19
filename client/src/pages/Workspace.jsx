import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UploadVideoModal from "../components/UploadVideoModel";
import CreateWorkspaceModal from "../components/createWorkspaceModel";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL;

function Workspace() {
    const { wsid } = useParams();
    const [workspaces, setWorkspaces] = useState([]);
    const [currentWorkspace, setCurrentWorkspace] = useState(null);
    const [videos, setVideos] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const res = await fetch(`${API}/api/workspace`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                setWorkspaces(data);
                const activeWorkspace = data.find((ws) => ws._id === wsid);
                setCurrentWorkspace(activeWorkspace || null);
            } catch (err) {
                console.error("Error fetching workspaces:", err);
            }
        };

        const fetchVideos = async () => {
            if (!wsid) return;
            try {
                const res = await fetch(`${API}/api/video?workspaceId=${wsid}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                setVideos(data.videos || []);
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchWorkspaces();
        fetchVideos();
    }, [wsid]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && showLeftSidebar) {
                setShowLeftSidebar(false);
            }
        };


        if (showLeftSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        }


        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLeftSidebar]);



    return (
        <div className="bg-[#0f172a] max-h-screen">
            <div className="hidden md:block">
                <Navbar />
            </div>
            <div className="flex min-h-screen flex-col bg-[#0f172a] text-white">

                <nav className="md:hidden flex justify-between items-center p-4 bg-[#1e293b] sticky top-0 z-50">
                    <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="text-white">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                    <div className="flex items-center space-x-2 text-xl font-bold">
                        <span>🔥</span>
                        <h2>Flame</h2>
                    </div>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={() => setShowUploadModal(true)}
                    >
                        + Upload
                    </button>
                </nav>


                {showLeftSidebar && (
                    <div ref={sidebarRef} className="md:hidden absolute left-0 top-[60px] bg-[#1e293b] w-full z-40">
                        <h3 className="text-lg font-semibold p-4">Workspaces</h3>
                        <div className="p-4 space-y-2">
                            {workspaces.map((ws) => (
                                <button
                                    key={ws._id}
                                    className={`w-full text-left px-4 py-2 rounded-md ${ws._id === wsid ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                    onClick={() => { navigate(`/workspace/${ws._id}`); setShowLeftSidebar(false); }}
                                >
                                    {ws.name}
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            <button
                                className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                                onClick={() => { setShowModal(true); setShowLeftSidebar(false) }}
                            >
                                Create New Workspace
                            </button>
                        </div>
                    </div>
                )}


                <div className="min-h-screen hidden md:flex flex-row">
                    <div className="w-64 bg-[#1e293b] px-6 flex flex-col">
                        <h3 className="text-lg font-semibold mt-6">Workspaces</h3>
                        <div className="mt-4 space-y-2">
                            {workspaces.map((ws) => (
                                <button
                                    key={ws._id}
                                    className={`w-full text-left px-4 py-2 rounded-md ${ws._id === wsid ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                    onClick={() => navigate(`/workspace/${ws._id}`)}
                                >
                                    {ws.name}
                                </button>
                            ))}
                        </div>
                        <div className="mt-10">
                            <button
                                className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                                onClick={() => setShowModal(true)}
                            >
                                Create New Workspace
                            </button>
                        </div>
                    </div>


                    <div className="flex-1 p-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold mb-6">
                                {currentWorkspace ? `Videos in "${currentWorkspace.name}"` : "Loading..."}
                            </h2>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                onClick={() => setShowUploadModal(true)}
                            >
                                + Upload
                            </button>
                        </div>

                        {videos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {videos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="bg-gray-100 text-black rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition flex flex-col justify-between p-2 aspect-square"
                                        onClick={() => navigate(`video/${video._id}`)}
                                    >
                                        <div className="flex-1 flex items-center justify-center">📺</div>
                                        <h3 className="text-xs font-medium text-center text-gray-800 mt-2 truncate">
                                            🎬 {video.title}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No videos found.</p>
                        )}
                    </div>


                    <div className="w-64 bg-[#1e293b] p-6 flex flex-col">
                        <h3 className="text-lg font-semibold">Creator</h3>
                        {currentWorkspace?.creator && (
                            <div className="w-full text-left px-4 py-2 rounded-lg bg-gray-700 font-bold">
                                {currentWorkspace.creator.name} (Creator)
                            </div>
                        )}
                        <h3 className="text-lg font-semibold mt-4">Members</h3>
                        <div>

                            <div className="mt-4 space-y-2 flex-1">
                                {currentWorkspace?.members.length > 0 ? (
                                    currentWorkspace.members.map((member) => (
                                        <button
                                            key={member._id}
                                            className="w-full text-left px-4 py-2 rounded-lg bg-gray-600"
                                        >
                                            {member.name}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No members found.</p>
                                )}
                            </div>
                            <button className="w-full bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 mt-3">
                                Add Member (Soon...)
                            </button>
                        </div>
                        {/* <div className="mt-4 text-sm text-gray-400">Storage Used: 5GB / 20GB</div> */}
                    </div>
                </div>


                <div className="md:hidden flex-1 p-4">
                    <h2 className="text-3xl font-bold mb-6">
                        {currentWorkspace ? `Videos in "${currentWorkspace.name}"` : "Loading..."}
                    </h2>
                    {videos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="bg-gray-100 text-black rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition flex flex-col justify-between p-2 aspect-square"
                                    onClick={() => navigate(`video/${video._id}`)}
                                >
                                    <div className="flex-1 flex items-center justify-center">📺</div>
                                    <h3 className="text-xs font-medium text-center text-gray-800 mt-2 truncate">
                                        🎬 {video.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No videos found.</p>
                    )}
                </div>


                {showModal && (
                    <CreateWorkspaceModal setShowModal={setShowModal} setWorkspaces={setWorkspaces} />
                )}
                {showUploadModal && (
                    <UploadVideoModal wsid={wsid} onClose={() => setShowUploadModal(false)} setVideos={setVideos} />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Workspace;