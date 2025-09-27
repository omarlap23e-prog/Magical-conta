<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MagicaL Conta</title>
  <style>
    body { font-family: Arial, sans-serif; background: linear-gradient(to bottom right, #d0e8ff, #d0ffd8); display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; margin:0; }
    h1 { font-size:2.5rem; margin-bottom:1rem; }
    .cuenta { padding:20px; width:350px; text-align:center; border-radius:15px; box-shadow:0 0 10px rgba(0,0,0,0.2); margin-bottom:20px; font-size:1.5rem; transition: background 0.3s; }
    button { padding:10px 20px; margin:5px; border:none; border-radius:10px; cursor:pointer; font-size:1rem; }
    .verde { background-color:#a0e7a0; }
    .rojo { background-color:#f5a0a0; }
    .opciones { display:flex; flex-direction:column; }
  </style>
</head>
<body>
  <h1>MagicaL Conta</h1>
  <div id="menu">
    <p>Elige un modo de práctica:</p>
    <button onclick="iniciarJuego('Todo mezclado')">Todo mezclado</button>
    <button onclick="iniciarJuego('Por tipo de activo')">Por tipo de activo</button>
    <button onclick="iniciarJuego('Por tipo de pasivo')">Por tipo de pasivo</button>
    <button onclick="iniciarJuego('Reto de velocidad')">Reto de velocidad</button>
    <button onclick="iniciarJuego('Modo examen')">Modo examen</button>
  </div>

  <div id="juego" style="display:none;">
    <div id="cuenta" class="cuenta"></div>
    <div id="opciones" class="opciones"></div>
    <p id="puntaje" style="margin-top:20px;"></p>
    <button id="siguienteBtn" style="display:none;" onclick="siguiente()">Siguiente</button>
  </div>

  <script>
    const cuentas = [
      { nombre: "Caja", tipo: "Activo circulante" },
      { nombre: "Bancos", tipo: "Activo circulante" },
      { nombre: "Inversiones temporales", tipo: "Activo circulante" },
      { nombre: "Clientes", tipo: "Activo circulante" },
      { nombre: "Documentos por cobrar", tipo: "Activo circulante" },
      { nombre: "Deudores diversos", tipo: "Activo circulante" },
      { nombre: "Inventarios (almacén/mercancías)", tipo: "Activo circulante" },
      { nombre: "Anticipo a proveedores", tipo: "Activo circulante" },
      { nombre: "Gastos pagados por anticipado", tipo: "Activo circulante" },
      { nombre: "Terrenos", tipo: "Activo no circulante" },
      { nombre: "Edificios", tipo: "Activo no circulante" },
      { nombre: "Mobiliario y equipo de oficina", tipo: "Activo no circulante" },
      { nombre: "Equipo de transporte", tipo: "Activo no circulante" },
      { nombre: "Depreciación acumulada (cuenta correctiva)", tipo: "Activo no circulante" },
      { nombre: "Marcas y patentes", tipo: "Activo no circulante" },
      { nombre: "Proveedores", tipo: "Pasivo a corto plazo" },
      { nombre: "Documentos por pagar", tipo: "Pasivo a corto plazo" },
      { nombre: "Acreedores diversos", tipo: "Pasivo a corto plazo" },
      { nombre: "Anticipo de clientes", tipo: "Pasivo a corto plazo" },
      { nombre: "IVA por pagar", tipo: "Pasivo a corto plazo" },
      { nombre: "ISR por pagar", tipo: "Pasivo a corto plazo" },
      { nombre: "Sueldos por pagar", tipo: "Pasivo a corto plazo" },
      { nombre: "Préstamos bancarios a corto plazo", tipo: "Pasivo a corto plazo" },
      { nombre: "Préstamos bancarios a largo plazo", tipo: "Pasivo a largo plazo" },
      { nombre: "Capital social", tipo: "Capital contable" },
      { nombre: "Reserva legal", tipo: "Capital contable" },
      { nombre: "Utilidad del ejercicio", tipo: "Capital contable" },
      { nombre: "Pérdida del ejercicio", tipo: "Capital contable" },
      { nombre: "Resultados acumulados", tipo: "Capital contable" }
    ];

    let deck = [];
    let indice = 0;
    let correctas = 0;
    let opcionesActuales = [];

    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length -1; i>0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [a[i],a[j]] = [a[j],a[i]];
      }
      return a;
    }

    function iniciarJuego(modo) {
      document.getElementById('menu').style.display='none';
      document.getElementById('juego').style.display='block';
      indice=0;
      correctas=0;

      if (modo==='Todo mezclado' || modo==='Reto de velocidad' || modo==='Modo examen') {
        deck = shuffleArray(cuentas);
        opcionesActuales = ["Activo circulante","Activo no circulante","Pasivo a corto plazo","Pasivo a largo plazo","Capital contable"];
      } else if (modo==='Por tipo de activo') {
        deck = shuffleArray(cuentas.filter(c=>c.tipo.includes('Activo')));
        opcionesActuales = ["Activo circulante","Activo no circulante"];
      } else if (modo==='Por tipo de pasivo') {
        deck = shuffleArray(cuentas.filter(c=>c.tipo.includes('Pasivo')));
        opcionesActuales = ["Pasivo a corto plazo","Pasivo a largo plazo"];
      }
      mostrarCuenta();
    }

    function mostrarCuenta() {
      const cuenta = deck[indice];
      document.getElementById('cuenta').textContent = cuenta.nombre;
      document.getElementById('cuenta').className = 'cuenta';
      const opcionesDiv = document.getElementById('opciones');
      opcionesDiv.innerHTML = '';
      opcionesActuales.forEach(opcion => {
        const btn = document.createElement('button');
        btn.textContent = opcion;
        btn.onclick = ()=> verificarRespuesta(opcion);
        opcionesDiv.appendChild(btn);
      });
      document.getElementById('siguienteBtn').style.display='none';
      document.getElementById('puntaje').textContent = `Correctas: ${correctas} / ${deck.length}`;
    }

    function verificarRespuesta(opcion) {
      const cuenta = deck[indice];
      const divCuenta = document.getElementById('cuenta');
      if (opcion === cuenta.tipo) {
        divCuenta.classList.add('verde');
        correctas++;
      } else {
        divCuenta.classList.add('rojo');
      }
      document.getElementById('siguienteBtn').style.display='block';
    }

    function siguiente() {
      indice++;
      if (indice >= deck.length) {
        alert(`¡Juego terminado! Tu calificación: ${correctas} / ${deck.length}`);
        location.reload();
      } else {
        mostrarCuenta();
      }
    }
  </script>
</body>
</html>
