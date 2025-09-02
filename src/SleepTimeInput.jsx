// SleepTimeInput.jsx
import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "AM" : "PM";
    times.push(`${hour12}:00 ${ampm}`);
    times.push(`${hour12}:30 ${ampm}`);
  }
  return times;
};

// Convert 12-hour string to 24-hour format for saving
const convertTo24Hour = (time12) => {
  if (!time12) return "";
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export default function SleepTimeInput({ user }) {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [status, setStatus] = useState("");

  const userTimezone =
    user.toLowerCase() === "eden" ? "Asia/Seoul" : "America/Toronto";

  useEffect(() => {
    const docRef = doc(db, "schedules", user);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
   if (docSnap.exists()) {
  const data = docSnap.data();
  // Convert 24-hour stored time to 12-hour format for display
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":").map(Number);
    const ampm = h < 12 ? "AM" : "PM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  setSleepTime(convertTo12Hour(data.sleepTime));
  setWakeTime(convertTo12Hour(data.wakeTime));
} else {
  setSleepTime("");
  setWakeTime("");
}
    });
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sleepTime || !wakeTime) {
      setStatus("Please select both sleep and wake times.");
      return;
    }

    try {
      await setDoc(doc(db, "schedules", user), {
        sleepTime: convertTo24Hour(sleepTime),
        wakeTime: convertTo24Hour(wakeTime),
        timezone: userTimezone,
      });
      setStatus("Saved successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error saving to Firestore.");
    }
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md"
      >
        {/* Sleep Time */}
        <div className="flex flex-col gap-1 relative w-full">
          <label className="font-semibold text-gray-700">Sleep Time</label>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🌙</span>
            <select
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="w-full pl-10 p-3 rounded-2xl bg-pink-50 border-2 border-pink-200 shadow-inner text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none"
            >
              <option value="">Select a time</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wake Time */}
        <div className="flex flex-col gap-1 relative w-full">
          <label className="font-semibold text-gray-700">Wake Time</label>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🌞</span>
            <select
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full pl-10 p-3 rounded-2xl bg-pink-50 border-2 border-pink-200 shadow-inner text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none"
            >
              <option value="">Select a time</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full mt-2 p-3 rounded-2xl bg-pink-400 text-white font-semibold shadow-lg hover:bg-pink-300 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
}