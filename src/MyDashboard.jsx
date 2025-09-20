import QuoteWidget from "./QuoteWidget";
import DuckyPhotoWidget from "./DuckyPhotoWidget";
import SleepWidget from "./SleepWidget";
import EnvelopeWidget from "./EnvelopeWidget";
import CountdownWidget from "./Countdown";

export default function MyDashboard() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-start justify-start p-6 bg-blue-200">
      <div className="w-full md:w-1/2">
        <SleepWidget user="Alfred" />
      </div>
      <div className="w-full md:w-1/2">
        <DuckyPhotoWidget user="Alfred" />
        <QuoteWidget user="Alfred" target="Eden" />
        <CountdownWidget
            targetDate="2025-10-02T16:00:00"
            message="I'm Here! 🎉"
          />
      </div>
      <EnvelopeWidget editable={true} />

    </div>
  );
}
