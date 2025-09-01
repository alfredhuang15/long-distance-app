import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function QuoteWidget({ user, target }) {
  const [message, setMessage] = useState("");
  const [latestQuote, setLatestQuote] = useState(null);

  // Subscribe to latest quote written *for this user*
  useEffect(() => {
    const q = query(
      collection(db, "quotes"),
      where("to", "==", user),
      orderBy("createdAt", "desc"),
      orderBy("__name__", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setLatestQuote(snap.docs[0].data());
      } else {
        setLatestQuote(null);
      }
    });
    return () => unsub();
  }, [user]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "quotes"), {
        from: user,
        to: target,
        text: message.trim(),
        createdAt: serverTimestamp()||new Date(),
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send quote", err);
    }
  };

  return (
    <div className="bg-pink-50 p-5 rounded-xl border-4 border-pink-300 shadow-2xl w-full max-w-4xl mx-auto relative">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-center">Quote of the Day</h2>
      </div>

      {/* Show latest quote sent to this user */}
      {latestQuote ? (
        <div className="bg-pink-100 text-pink-800 p-4 rounded-xl shadow-inner mb-4">
          <p className="text-center italic">"{latestQuote.text}"</p>
          <div className="text-xs text-right text-gray-500 mt-2">
            — {latestQuote.from}
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center mb-4">
          No quote yet 💌
        </div>
      )}

      {/* Input for writing a new message */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Send a quote to ${target}...`}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
