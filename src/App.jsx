import { useState, useEffect } from "react";
import Login from "./Login";
import MyDashboard from "./MyDashboard";
import HerDashboard from "./HerDashboard";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [authReady, setAuthReady] = useState(false); // track if Firebase Auth is ready
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  useEffect(() => {
    // Sign in anonymously once
    signInAnonymously(auth).catch(console.error);

    // Wait until Firebase confirms authentication
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase signed in:", firebaseUser.uid);
        setAuthReady(true); // ✅ Now Firestore can be accessed
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (selectedUser) => {
    setUser(selectedUser);
    localStorage.setItem("user", selectedUser);
  };

  if (!authReady) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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
