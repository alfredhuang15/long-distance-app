import { useState, useEffect } from "react";
import Login from "./Login";
import MyDashboard from "./MyDashboard";
import HerDashboard from "./HerDashboard";


export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  const handleLogin = (selectedUser) => {
    setUser(selectedUser);
    localStorage.setItem("user", selectedUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-pink-300 to-blue-300">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-pink-400 via-pink-300 to-blue-300 relative">
      {user === "Alfred" && <MyDashboard />}
      {user === "Eden" && <HerDashboard />}
    </div>
  );
}
