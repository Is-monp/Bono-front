import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { obtenerRecetas } from '../api';
import Temporizador from '../components/Temporizador';

function Detalle({ propias = [], favoritos = [], onToggleFavorito }) {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);

    const propia = propias.find((r) => r.id === Number(id));
    if (propia) {
      setReceta(propia);
      setRelacionadas([]);
      setCargando(false);
      return;
    }

    obtenerRecetas(controller.signal)
      .then((todas) => {
        const encontrada = todas.find((r) => r.id === Number(id)) ?? null;
        setReceta(encontrada);
        setRelacionadas(
          encontrada?.relacionadas
            ? todas.filter((r) => encontrada.relacionadas.includes(r.id))
            : []
        );
        setCargando(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error(error);
        setReceta(null);
        setCargando(false);
      });

    return () => controller.abort();
  }, [id, propias]);

  if (cargando) return <p>Cargando receta…</p>;
  if (!receta) return <p>No encontramos esta receta.</p>;

  const esFavorita = favoritos.includes(receta.id);

  return (
    <article className="detalle">
      <h1>{receta.nombre}</h1>
      <p>
        {receta.categoria} · ⏱️ {receta.tiempo} min
      </p>

      <button onClick={() => onToggleFavorito(receta.id)}>
        {esFavorita ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </button>

      {receta.ingredientes && (
        <>
          <h2>Ingredientes</h2>
          <ul>
            {receta.ingredientes.map((ingrediente) => (
              <li key={ingrediente}>{ingrediente}</li>
            ))}
          </ul>
        </>
      )}

      {receta.pasos && (
        <>
          <h2>Preparación</h2>
          <ol>
            {receta.pasos.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </>
      )}

      <Temporizador key={receta.id} minutos={receta.tiempo} />

      {relacionadas.length > 0 && (
        <>
          <h2>También te puede gustar</h2>
          <ul>
            {relacionadas.map((r) => (
              <li key={r.id}>
                <Link to={`/recetas/${r.id}`}>{r.nombre}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export default Detalle;