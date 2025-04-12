import { LinkShortener } from "./components/shortener";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-700">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          URL ACORTADOR
        </h1>
        <LinkShortener />
      </div>
    </div>
  );
}

export default App;
