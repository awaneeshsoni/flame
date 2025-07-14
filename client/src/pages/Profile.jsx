import { useState } from "react";
import { useAuth } from "../context/authContext";
import Footer from "../components/Footer";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, setUser, token } = useAuth(); 
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API}/api/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ persist
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message || "Update failed.");
    }
  };

  if (!user) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="max-w-xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        {message && <div className="mb-4 text-orange-400">{message}</div>}

        <div className="space-y-4 bg-zinc-800 p-6 rounded-md border border-zinc-700">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep unchanged"
              disabled={!editing}
              className="w-full px-4 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                if (editing) handleUpdate();
                else setEditing(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded font-semibold"
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setForm({
                    name: user.name,
                    email: user.email,
                    password: "",
                  });
                  setEditing(false);
                }}
                className="text-red-400 hover:underline text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-zinc-800 p-6 rounded-md border border-zinc-700">
          <h2 className="text-lg font-semibold mb-2">Plan Details</h2>
          <p>
            <span className="text-white/60">Current Plan:</span>{" "}
            <strong className="capitalize">{user.plan}</strong>
          </p>
          <p>
            <span className="text-white/60">Activated On:</span>{" "}
            {user.planActivatedAt
              ? new Date(user.planActivatedAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <span className="text-white/60">Expires On:</span>{" "}
            {user.planExpiresAt
              ? new Date(user.planExpiresAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
