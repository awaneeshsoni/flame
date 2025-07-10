import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlanConfig from '../config/planConfig';
import JoinWithCode from './JoinWithCode';

function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

const userId = localStorage.getItem("userId");

function WorkspaceSidebar({ workspaces, currentWorkspaceId, onCreateClick }) {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:block w-72 bg-zinc-900 p-6 border-r border-white/10 flex-shrink-0">
      <div className='flex justify-between items-center mb-4'>
        <h3 className="text-base font-semibold">Workspaces</h3>
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded-md text-sm font-medium"
          onClick={onCreateClick}
        >
          + Create
        </button>
      </div>

      <div className="space-y-2">
        {workspaces.map((ws) => {
          const isActive = ws._id === currentWorkspaceId;
          const plan = ws.creator?.plan || 'free';
          const used = ws.storageUsed || 0;
          const limit = PlanConfig[plan].storagePerWorkspace;

          return (
            <div key={ws._id} className="space-y-1">
              <div
                className={`w-full flex justify-between items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ${
                  isActive ? "bg-white text-black" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
                onClick={() => navigate(`/workspace/${ws._id}`)}
              >
                <span className="truncate">{ws.name}</span>
              </div>

              {isActive && (
                <div className="text-xs text-gray-300 flex justify-between py-1 rounded-md ml-1">
                  Storage Used: <div><strong>{formatBytes(used)}</strong> / {formatBytes(limit)} </div>
                </div>
              )}
            </div>
          );
        })}
        <JoinWithCode />
      </div>
    </aside>
  );
}

export default WorkspaceSidebar;
