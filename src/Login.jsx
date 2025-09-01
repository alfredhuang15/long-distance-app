export default function Login({ onLogin }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-3xl font-bold">Hi Welcome to my long distance app I made just for you!</h1>
      <h1 className="text-3xl font-bold">Please pick Eden!</h1>

      <button
        onClick={() => onLogin("Alfred")}
        className="px-6 py-3 rounded-full bg-blue-500 text-white text-lg font-semibold shadow-md hover:bg-blue-600 transition"
      >
        Alfred
      </button>
      <button
        onClick={() => onLogin("Eden")}
        className="px-6 py-3 rounded-full bg-pink-500 text-white text-lg font-semibold shadow-md hover:bg-pink-600 transition"
      >
        Eden
      </button>
    </div>
  );
}
