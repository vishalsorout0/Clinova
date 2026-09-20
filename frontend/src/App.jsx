import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { PatientProvider } from "./context/PatientContext";
import AppRoutes from "./routes/AppRoutes";

function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    function handlePointerMove(event) {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    }

    function handlePointerLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      className={`cursor-follower ${visible ? "visible" : ""}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-hidden="true"
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PatientProvider>
          <div className="app-shell">
            <CursorFollower />
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />
            <AppRoutes />
          </div>
        </PatientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}