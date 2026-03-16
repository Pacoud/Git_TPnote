import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Vérification de l'API en cours...");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setStatus(data.status);
        setMessage("La communication frontend/backend fonctionne.");
      } catch (error) {
        setStatus("error");
        setMessage(`Erreur lors de l'appel API: ${error.message}`);
      }
    };

    fetchHealth();
  }, []);

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">TP Master DevOps</p>
        <h1>Pipeline CI/CD GitLab avec Docker et AWS</h1>
        <p className="description">
          Cette interface React appelle le backend Express via HTTP sur
          <code>/api/health</code>.
        </p>

        <div className={`status status-${status}`}>
          <span>Statut API</span>
          <strong data-testid="api-status">{status}</strong>
        </div>

        <p data-testid="api-message" className="message">
          {message}
        </p>
      </section>
    </main>
  );
}

export default App;
