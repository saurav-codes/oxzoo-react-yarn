import { useEffect, useState } from "react";

const PROJECT = "oxzoo-react-yarn";
// Baked into the bundle at BUILD time via vite envPrefix; project name is inlined
// so the full literal survives esbuild constant folding for the build proof.
const FRONTEND_LINE = `frontend: hello world oxzoo-react-yarn_${import.meta.env.GREETING_TAG}`;

export default function App() {
  const [backendLine, setBackendLine] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/greeting")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => setBackendLine(`backend: ${text}`))
      .catch((err) => setError(`backend: error (${err.message})`));
  }, []);

  return (
    <main>
      <h1>{PROJECT}</h1>
      <p>{FRONTEND_LINE}</p>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <p>{backendLine ?? "backend: loading"}</p>
      )}
    </main>
  );
}
