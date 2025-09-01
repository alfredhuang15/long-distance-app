import { useState, useEffect } from "react";
import { db, storage } from "./firebase";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DuckyPhotoWidget({ user }) {
  const [file, setFile] = useState(null);
  const [latestAlfred, setLatestAlfred] = useState(null);
  const [latestEden, setLatestEden] = useState(null);

  // Subscribe to Alfred's latest photo
  useEffect(() => {
    const q = query(
      collection(db, "photos"),
      where("user", "==", "Alfred"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setLatestAlfred(snap.docs[0].data());
      } else {
        setLatestAlfred(null);
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to Eden's latest photo
  useEffect(() => {
    const q = query(
      collection(db, "photos"),
      where("user", "==", "Eden"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setLatestEden(snap.docs[0].data());
      } else {
        setLatestEden(null);
      }
    });
    return () => unsub();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const filename = `${user}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `ducky_photos/${filename}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        url,
        user,
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
      });

      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed, check console.");
    }
  };

  const renderFrame = (label, photo, isLeft) => (
    <div
      className={`w-full md:w-1/2 bg-gray-100 rounded-lg p-3 flex flex-col items-center ${
        isLeft ? "order-1" : "order-2"
      }`}
    >
      {photo ? (
        <img
          src={photo.url}
          alt={`${label} latest`}
          className="w-full h-64 object-cover rounded-md mb-2"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-500">
          No photo yet
        </div>
      )}
      {/* Caption with name + timestamp */}
      <div className="text-center mt-1">
        <div className="text-sm font-semibold">{label}</div>
        {photo && (
          <div className="text-xs text-gray-500">
            {new Date(photo.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );

return (
  <div className="p-5 rounded-xl border-4 border-pink-300 shadow-2xl bg-[rgb(253,228,242)] w-full max-w-4xl mx-auto">

    {/* Upload controls */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
        }}
        className="rounded w-full sm:w-auto"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 w-full sm:w-auto"
        disabled={!file}
      >
        Upload
      </button>
      {file && (
        <span className="text-sm text-gray-600 truncate w-full sm:w-auto">
          {file.name}
        </span>
      )}
    </div>

    {/* Side-by-side photos */}
    <div className="flex flex-col md:flex-row gap-6 items-start justify-center">
      {renderFrame("Alfred", latestAlfred, true)}
      {renderFrame("Eden", latestEden, false)}
    </div>

    {/* Shared caption */}
    <div className="mt-6 text-center">
      <span className="text-lg font-medium">Ducky photo of the day!</span>
    </div>
  </div>
);
}
