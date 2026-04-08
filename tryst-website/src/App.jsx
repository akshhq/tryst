import Artists from "./components/Artists";

function App() {
  return (
    <div className="min-h-screen bg-[#0b0120] p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
        TRYST 2026 – Past Performers
      </h1>

      <Artists />
    </div>
  );
}

export default App;