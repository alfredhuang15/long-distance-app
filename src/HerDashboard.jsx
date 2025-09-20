import SleepWidget from "./SleepWidget";
import heart from "./assets/eden_heart.png";
import bf_heart from "./assets/alfred_heart.png";
import DuckyPhotoWidget from "./DuckyPhotoWidget";
import bf_thumbs from "./assets/alfred_thumbs.png";
import QuoteWidget from "./QuoteWidget";
import EnvelopeWidget from "./EnvelopeWidget";
import eden_tongue from "./assets/eden_tongue.png";
import CountdownWidget from "./Countdown";

export default function HerDashboard() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-start justify-start p-5 bg-pink-300 relative">
      <div className="w-full md:w-1/2 relative">
        <img
          src={heart}
          alt="Sticker"
          className="absolute top-0 right-0 w-35 h-35 translate-x-10 -translate-y-5 rotate-14 z-25"
        />
          <img
          src={bf_heart}
          alt="Sticker"
          className="absolute bottom-0 left-0 w-35 h-35 -translate-x-8 translate-y-5 -rotate-12"
        />

        <SleepWidget user="Eden" />
      </div>
         <div className="w-full md:w-1/2 flex flex-col">
         <div className="relative">
          <DuckyPhotoWidget user="Eden" />
            <img
          src={bf_thumbs}
          alt="Sticker"
          className="absolute bottom-0 left-0 w-35 h-35 -translate-x-10 translate-y-8 z-25"
        />
         </div>
         <div>
          <QuoteWidget user="Eden" target="Alfred" />
            <CountdownWidget
            targetDate="2025-10-02T16:00:00"
            message="I'm Here! 🎉"
          />
         </div>
         <div className="relative">
          <EnvelopeWidget editable={false} />
          <img
          src={eden_tongue}
          alt="Sticker"
          className="absolute bottom-0 right-0 w-35 h-35 -translate-x-5 translate-y-5 z-25"
        />
         </div>

      </div>
    </div>
  );
}
