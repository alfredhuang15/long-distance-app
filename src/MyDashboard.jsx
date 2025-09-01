import QuoteWidget from "./QuoteWidget";
import DuckyPhotoWidget from "./DuckyPhotoWidget";
import SleepWidget from "./SleepWidget";
import EnvelopeWidget from "./EnvelopeWidget";

export default function MyDashboard() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-start justify-start p-6 bg-blue-200">
      <div className="w-full md:w-1/2">
        <SleepWidget user="Alfred" />
      </div>
      <div className="w-full md:w-1/2">
        <DuckyPhotoWidget user="Alfred" />
        <QuoteWidget user="Alfred" target="Eden" />
      </div>
      <EnvelopeWidget editable={true} />

    </div>
  );
}
