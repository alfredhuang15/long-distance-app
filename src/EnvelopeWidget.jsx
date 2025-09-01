import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function EnvelopeWidget({ editable = false }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const docRef = doc(db, "messages", "dailyNote");
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setMessage(snap.data().text || "");
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "messages", "dailyNote");
      await setDoc(docRef, {
        text: message,
        updatedAt: serverTimestamp(),
      });
      setOpen(false);
    } catch (err) {
      console.error("Error saving message", err);
    }
  };

  return (
    <>
      {/* Floating envelope button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition z-50"
      >
        <Mail className="w-6 h-6" />
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          >
            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-4">💌 Mail</h2>

             {editable ? (
  <>
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Write something sweet..."
      className="w-full border rounded-lg p-3 text-sm h-32 resize-none"
    />
    <button
      onClick={handleSave}
      className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
    >
      Save Message
    </button>
  </>
) : (
  <div className="bg-pink-100 text-pink-800 p-4 rounded-xl shadow-inner whitespace-pre-wrap">
    {message ? (
      <p className="text-left">{message}</p>
    ) : (
      <p className="text-gray-400 text-center">No message yet 💌</p>
    )}
  </div>
)}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
