import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import Navegacion from './components/Navegacion';
import Inicio from './paginas/Inicio';
import Catalogo from './paginas/Catalogo';
import Detalle from './paginas/Detalle';
import Favoritos from './paginas/Favoritos';
import NuevaReceta from './paginas/NuevaReceta';
import NoEncontrada from './paginas/NoEncontrada';

function leerFavoritos() {
  try {
    const guardado = JSON.parse(localStorage.getItem('favoritos'));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

function App() {
  const [favoritos, setFavoritos] = useState(leerFavoritos);
  const [propias, setPropias] = useState([]);

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  function toggleFavorito(id) {
    setFavoritos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((f) => f !== id)
        : [...actuales, id]
    );
  }

  function agregarReceta(receta) {
    setPropias((actuales) => [...actuales, receta]);
  }

  return (
    <div className="app">
      <Navegacion totalFavoritos={favoritos.length} />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/recetas" element={<Catalogo propias={propias} />} />
          <Route
            path="/recetas/:id"
            element={
              <Detalle propias={propias} favoritos={favoritos} onToggleFavorito={toggleFavorito} />
            }
          />
          <Route
            path="/favoritos"
            element={<Favoritos favoritos={favoritos} onQuitar={toggleFavorito} />}
          />
          <Route path="/nueva" element={<NuevaReceta onAgregar={agregarReceta} />} />
          <Route path="/404" element={<NoEncontrada />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
