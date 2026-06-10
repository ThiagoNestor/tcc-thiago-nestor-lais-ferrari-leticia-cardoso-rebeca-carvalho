import { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [texto, setTexto] = useState("Clique no botão ");

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f0f1a",
      color: "white",
      textAlign: "center",
      fontFamily: "Arial"
    }}>
      <div>
        <h1>Botão React ⚛️</h1>
        <p>{texto}</p>

        <button
          onClick={() => setTexto("Você clicou ")}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            fontSize: "16px",
            color: "white",
            background: "#6a00ff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 0 10px #6a00ff",
            transition: "0.3s"
          }}
          onMouseOver={(e) => {
            e.target.style.boxShadow =
              "0 0 20px #8c2bff, 0 0 40px #8c2bff";
            e.target.style.background = "#8c2bff";
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = "0 0 10px #6a00ff";
            e.target.style.background = "#6a00ff";
          }}
        >
          Clique aqui
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);