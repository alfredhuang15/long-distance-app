import React, { useEffect, useState } from "react";

const CountdownWidget = ({ targetDate, message = "🎉 Time’s Up! 🎉" }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isTimeUp = Object.keys(timeLeft).length === 0;

  return (
    <div className="flex justify-center gap-6 text-center p-5 bg-pink-50 rounded-2xl border-4 border-pink-300">
      {isTimeUp ? (
        <span className="text-2xl font-semibold text-red-500">{message}</span>
      ) : (
        ["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <span className="text-4xl font-bold text-gray-900">
              {timeLeft[unit]}
            </span>
            <span className="text-sm uppercase tracking-wide text-gray-500">
              {unit}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default CountdownWidget;
