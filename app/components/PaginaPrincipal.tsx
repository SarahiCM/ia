"use client";

import { useState } from "react";
import SistemaFaltas from "@/app/components/SistemaFaltas";
import ChatDatos from "@/app/components/ChatDatos";

type Sistema = "faltas" | "datos";

export default function PaginaPrincipal() {
  const [sistemaActivo, setSistemaActivo] = useState<Sistema>("faltas");

  return (
    <div>
      {sistemaActivo === "faltas" ? (
        <>
          <SistemaFaltas />
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setSistemaActivo("datos")}
              className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition inline-flex items-center gap-2"
            >
              <span>🔄</span>
              <span>Ver Chat de Datos</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <ChatDatos />
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setSistemaActivo("faltas")}
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition inline-flex items-center gap-2"
            >
              <span>🔄</span>
              <span>Ver Sistema de Faltas</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
