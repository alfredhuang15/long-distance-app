// SleepWidget.jsx
import React from "react";
import SleepTimeInput from "./SleepTimeInput";
import SleepChart from "./SleepChart";

export default function SleepWidget({ user }) {
  return (
    <div className="w-full p-3 rounded-xl border-4 border-pink-300 shadow-2xl bg-[rgb(253,228,242)] flex flex-col gap-1">
      <SleepTimeInput user={user} />
      <div className="flex items-center justify-center">
        <SleepChart viewer={user} />
      </div>
    </div>
  );
}
