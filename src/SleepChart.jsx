// SleepChart.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

export default function SleepChart({ viewer }) {
  const [usersTimes, setUsersTimes] = useState({});

  const viewerTimezone =
    viewer.toLowerCase() === "eden" ? "Asia/Seoul" : "America/Toronto";

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snapshot) => {
      const times = {};
      snapshot.docs.forEach((doc) => {
        times[doc.id] = doc.data();
      });
      setUsersTimes(times);
    });
    return () => unsubscribe();
  }, []);

  function convertToViewerMinutes(hhmm, user, viewer) {
    const [h, m] = hhmm.split(":").map(Number);
    let minutes = h * 60 + m;

    if (user.toLowerCase() === "eden" && viewer.toLowerCase() === "alfred") {
      minutes = (minutes - 13 * 60 + 1440) % 1440;
    } else if (user.toLowerCase() === "alfred" && viewer.toLowerCase() === "eden") {
      minutes = (minutes + 13 * 60) % 1440;
    }

    return minutes;
  }

  const slices = 48;
  const sliceMinutes = 30;
  const sliceStatus = Array(slices).fill("gray");

  const viewerUser = viewer;
  const otherUser = Object.keys(usersTimes).find(
    (u) => u.toLowerCase() !== viewer.toLowerCase()
  );
  const userAwake = {};

  [viewerUser, otherUser].forEach((user) => {
    if (!user) return;
    const data = usersTimes[user];
    if (!data || !data.sleepTime || !data.wakeTime) return;

    const sleepInViewer = convertToViewerMinutes(data.sleepTime, user, viewerUser);
    const wakeInViewer = convertToViewerMinutes(data.wakeTime, user, viewerUser);

    const awakeSlices = Array(slices).fill(true);

    if (sleepInViewer < wakeInViewer) {
      for (let i = sleepInViewer; i < wakeInViewer; i++) {
        awakeSlices[Math.floor(i / sliceMinutes)] = false;
      }
    } else {
      for (let i = sleepInViewer; i < 1440; i++) {
        awakeSlices[Math.floor(i / sliceMinutes)] = false;
      }
      for (let i = 0; i < wakeInViewer; i++) {
        awakeSlices[Math.floor(i / sliceMinutes)] = false;
      }
    }

    userAwake[user] = awakeSlices;
  });

  for (let s = 0; s < slices; s++) {
    const viewerAwake = userAwake[viewerUser]?.[s] || false;
    const otherAwake = userAwake[otherUser]?.[s] || false;

    if (viewerAwake && otherAwake) sliceStatus[s] = "#FF6384"; 
    else if (viewerAwake && !otherAwake) sliceStatus[s] = "#36A2EB"; 
    else if (!viewerAwake && otherAwake) sliceStatus[s] = "#00C49F"; 
    else sliceStatus[s] = "#E0E0E0"; 
  }

  const formatLabel = (i) => {
    const totalMinutes = i * sliceMinutes;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const chartData = {
    labels: Array.from({ length: slices }, (_, i) => formatLabel(i)),
    datasets: [
      {
        data: Array(slices).fill(1),
        backgroundColor: sliceStatus,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    layout: {
      padding: 20,
    },
    plugins: {
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "outside",
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label.endsWith(":00") ? label : "";
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const s = ctx.dataIndex;
            const vAwake = userAwake[viewerUser]?.[s];
            const oAwake = userAwake[otherUser]?.[s];
            if (vAwake && oAwake) return "Both awake";
            if (vAwake && !oAwake) return `${viewerUser} awake`;
            if (!vAwake && oAwake) return `${otherUser} awake`;
            return "Asleep";
          },
        },
      },
      legend: { display: false },
    },
  };

return (
  <div className="w-full max-w-2xl px-3 rounded mt-4 bg-transparent">
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] flex items-center justify-center">
      <Doughnut
        data={chartData}
         options={{
          ...chartOptions,
          responsive: true,
          maintainAspectRatio: false,
        }}
        plugins={[ChartDataLabels]}
      />
    </div>
  </div>
);
}
