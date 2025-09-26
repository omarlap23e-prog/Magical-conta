import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const cuentas = [
  // Activo circulante
  { nombre: "Caja", tipo: "Activo circulante" },
  { nombre: "Bancos", tipo: "Activo circulante" },
  { nombre: "Inversiones temporales", tipo: "Activo circulante" },
  { nombre: "Clientes", tipo: "Activo circulante" },
  { nombre: "Documentos por cobrar", tipo: "Activo circulante" },
  { nombre: "Deudores diversos", tipo: "Activo circulante" },
  { nombre: "Inventarios (almacén/mercancías)", tipo: "Activo circulante" },
  { nombre: "Anticipo a proveedores", tipo: "Activo circulante" },
  { nombre: "Gastos pagados por anticipado", tipo: "Activo circulante" },

  // Activo no circulante
  { nombre: "Terrenos", tipo: "Activo no circulante" },
  { nombre: "Edificios", tipo: "Activo no circulante" },
  { nombre: "Mobiliario y equipo de oficina", tipo: "Activo no circulante" },
  { nombre: "Equipo de transporte", tipo: "Activo no circulante" },
  { nombre: "Depreciación acumulada (cuenta correctiva)", tipo: "Activo no circulante" },
  { nombre: "Marcas y patentes", tipo: "Activo no circulante" },

  // Pasivo corto plazo
  { nombre: "Proveedores", tipo: "Pasivo a corto plazo" },
  { nombre: "Documentos por pagar", tipo: "Pasivo a corto plazo" },
  { nombre: "Acreedores diversos", tipo: "Pasivo a corto plazo" },
  { nombre: "Anticipo de clientes", tipo: "Pasivo a corto plazo" },
  { nombre: "IVA por pagar", tipo: "Pasivo a corto plazo" },
  { nombre: "ISR por pagar", tipo: "Pasivo a corto plazo" },
  { nombre: "Sueldos por pagar", tipo: "Pasivo a corto plazo" },
  { nombre: "Préstamos bancarios a corto plazo", tipo: "Pasivo a corto plazo" },

  // Pasivo largo plazo
  { nombre: "Préstamos bancarios a largo plazo", tipo: "Pasivo a largo plazo" },

  // Capital contable
  { nombre: "Capital social", tipo: "Capital contable" },
  { nombre: "Reserva legal", tipo: "Capital contable" },
  { nombre: "Utilidad del ejercicio", tipo: "Capital contable" },
  { nombre: "Pérdida del ejercicio", tipo: "Capital contable" },
  { nombre: "Resultados acumulados", tipo: "Capital contable" },
];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const modos = [
  { nombre: "Todo mezclado", filter: () => true, opciones: ["Activo circulante","Activo no circulante","Pasivo a corto plazo","Pasivo a largo plazo","Capital contable"] },
  { nombre: "Por tipo de activo", filter: c => c.tipo.includes("Activo"), opciones: ["Activo circulante","Activo no circulante"] },
  { nombre: "Por tipo de pasivo", filter: c => c.tipo.includes("Pasivo"), opciones: ["Pasivo a corto plazo","Pasivo a largo plazo"] },
  { nombre: "Reto de velocidad", filter: () => true, opciones: ["Activo circulante","Activo no circulante","Pasivo a corto plazo","Pasivo a largo plazo","Capital contable"] },
  { nombre: "Modo examen", filter: () => true, opciones: ["Activo circulante","Activo no circulante","Pasivo a corto plazo","Pasivo a largo plazo","Capital contable"] }
];

export default function MagicaLConta() {
  const [iniciado, setIniciado] = useState(false);
  const [modo, setModo] = useState(null);
  const [deck, setDeck] = useState([]);
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [correctas, setCorrectas] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const iniciarJuego = (modoSeleccionado) => {
    const nuevoDeck = shuffleArray(cuentas.filter(modoSeleccionado.filter));
    setDeck(nuevoDeck);
    setIndice(0);
    setCorrectas(0);
    setSeleccion("");
    setRespuesta(null);
    setModo(modoSeleccionado);
    setIniciado(true);
    setTerminado(false);
  };

  const cuentaActual = deck[indice];

  const verificarRespuesta = (opcion) => {
    setSeleccion(opcion);
    const esCorrecta = opcion === cuentaActual.tipo;
    setRespuesta(esCorrecta);
    if (esCorrecta) setCorrectas(prev => prev + 1);
  };

  const siguiente = () => {
    const siguienteIndice = indice + 1;
    if (siguienteIndice >= deck.length) {
      setTerminado(true);
    } else {
      setIndice(siguienteIndice);
      setSeleccion("");
      setRespuesta(null);
    }
  };

  if (!iniciado) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-green-100">
        <h1 className="text-4xl font-bold mb-6">MagicaL Conta</h1>
        <p className="mb-4">Elige un modo de práctica:</p>
        <div className="grid gap-4">
          {modos.map(m => (
            <Button key={m.nombre} onClick={() => iniciarJuego(m)}>{m.nombre}</Button>
          ))}
        </div>
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-pink-100">
        <h1 className="text-3xl font-bold mb-6">¡Juego terminado!</h1>
        <p className="text-xl mb-4">Tu calificación: {correctas} / {deck.length}</p>
        <Button onClick={() => iniciarJuego(modo)}>Jugar de nuevo</Button>
        <Button onClick={() => { setIniciado(false); setModo(null); }} className="mt-2">Volver al menú</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <motion.div
        className={`p-10 rounded-2xl shadow-xl mb-6 text-center w-96 transition-colors duration-500 ${
          respuesta === null ? "bg-white" : respuesta ? "bg-green-300" : "bg-red-300"
        }`}
        whileHover={{ scale: 1.05 }}
      >
        <h2 className="text-2xl font-bold">{cuentaActual.nombre}</h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 w-80">
        {modo.opciones.map((opcion) => (
          <Button
            key={opcion}
            variant={seleccion === opcion ? "default" : "outline"}
            onClick={() => verificarRespuesta(opcion)}
            disabled={respuesta !== null}
          >
            {opcion}
          </Button>
        ))}
      </div>

      {respuesta !== null && (
        <div className="mt-6">
          <Button onClick={siguiente}>Siguiente</Button>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">Correctas: {correctas} / {deck.length}</div>
    </div>
  );
}
