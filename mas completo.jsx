import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Menu } from "lucide-react";

export default function RedFCA() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // asesor o estudiante
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("inicio");
  const [materia, setMateria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [materiasAsesor, setMateriasAsesor] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chatOpen, setChatOpen] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const login = () => {
    setUser({
      id: 1,
      nombre: "Estudiante FCA",
      semestre: "3er semestre",
      promedio: 90,
    });
  };

  const publicarAsesoria = () => {
    if (!materia || !descripcion) return;

    const nueva = {
      id: Date.now(),
      materia,
      descripcion,
      solicitante: user,
      asesor: null,
      estado: "Pendiente",
      mensajes: [],
    };

    setPosts([nueva, ...posts]);
    setMateria("");
    setDescripcion("");
    setView("misAsesorias");
  };

  const aceptarSolicitud = (post) => {
    const actualizado = posts.map((p) =>
      p.id === post.id ? { ...p, asesor: user, estado: "En acuerdo" } : p,
    );
    setPosts(actualizado);
    setChatOpen(post.id);
  };

  const enviarMensaje = (postId) => {
    if (!mensaje) return;

    const actualizado = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            mensajes: [...p.mensajes, { autor: user.nombre, texto: mensaje }],
          }
        : p,
    );

    setPosts(actualizado);
    setMensaje("");
  };

  const agregarMateriaAsesor = () => {
    if (!materia) return;
    setMateriasAsesor([...materiasAsesor, materia]);
    setMateria("");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="rounded-2xl p-6 shadow-xl">
          <CardContent className="space-y-4">
            <h1 className="text-3xl font-bold">Red FCA</h1>
            <Button onClick={login}>Entrar con @uach.mx</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-6 bg-gray-100">
        <Button onClick={() => setRole("asesor")}>Iniciar como Asesor</Button>
        <Button onClick={() => setRole("estudiante")}>Iniciar como Estudiante</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="font-bold">Red FCA</h1>
        <Menu className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-16 w-64 space-y-3 rounded-2xl bg-white p-4 shadow-xl">
          <Button className="w-full" onClick={() => setView("perfil")}>
            Mi Perfil
          </Button>
          {role === "estudiante" && (
            <Button className="w-full" onClick={() => setView("publicar")}>
              Publicar Asesoría
            </Button>
          )}
          <Button className="w-full" onClick={() => setView("disponibles")}>
            Asesorías Disponibles
          </Button>
          <Button className="w-full" onClick={() => setView("misAsesorias")}>
            Mis Asesorías
          </Button>
        </div>
      )}

      <div className="p-8">
        {view === "perfil" && (
          <Card className="space-y-4 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold">Perfil</h2>
            <p>Nombre: {user.nombre}</p>
            <p>Semestre: {user.semestre}</p>
            <p>Promedio: {user.promedio}</p>

            {role === "asesor" && (
              <>
                <h3 className="mt-4 font-semibold">Materias que domino</h3>
                <div className="flex gap-2">
                  <Input
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                    placeholder="Agregar materia"
                  />
                  <Button onClick={agregarMateriaAsesor}>Agregar</Button>
                </div>
                <ul>
                  {materiasAsesor.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        )}

        {view === "publicar" && role === "estudiante" && (
          <Card className="space-y-4 rounded-2xl p-6 shadow-lg">
            <h2 className="font-bold">Publicar necesidad de asesoría</h2>
            <Input
              placeholder="Materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            />
            <Textarea
              placeholder="Describe tu duda"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <Button onClick={publicarAsesoria}>Publicar</Button>
          </Card>
        )}

        {view === "disponibles" && (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Card key={post.id} className="space-y-2 rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold">{post.materia}</h3>
                <p>{post.descripcion}</p>
                <p>Solicita: {post.solicitante.nombre}</p>
                {role === "asesor" && !post.asesor && (
                  <Button onClick={() => aceptarSolicitud(post)}>
                    Aceptar y chatear
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {view === "misAsesorias" && (
          <div className="space-y-4">
            {posts
              .filter((p) => p.solicitante.id === user.id || p.asesor?.id === user.id)
              .map((post) => (
                <Card key={post.id} className="space-y-2 rounded-2xl p-4 shadow-lg">
                  <h3 className="font-bold">{post.materia}</h3>
                  <p>Estado: {post.estado}</p>
                  {post.asesor && <p>Asesor: {post.asesor.nombre}</p>}

                  {chatOpen === post.id && (
                    <div className="space-y-2 rounded-xl bg-gray-100 p-3">
                      <div className="h-32 overflow-y-auto rounded bg-white p-2">
                        {post.mensajes.map((m, i) => (
                          <p key={i}>
                            <strong>{m.autor}:</strong> {m.texto}
                          </p>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                          placeholder="Escribe mensaje"
                        />
                        <Button onClick={() => enviarMensaje(post.id)}>Enviar</Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
