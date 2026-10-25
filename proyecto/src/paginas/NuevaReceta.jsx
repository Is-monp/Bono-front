import { useState } from 'react';
import { useNavigate } from 'react-router';

const VACIO = { nombre: '', categoria: 'almuerzo', tiempo: '' };

function NuevaReceta({ onAgregar }) {
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.nombre.trim() === '') {
      setError('La receta necesita un nombre.');
      return;
    }
    if (!(Number(form.tiempo) > 0)) {
      setError('El tiempo debe ser un número mayor que cero.');
      return;
    }

    onAgregar({
      id: Date.now(),
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      tiempo: Number(form.tiempo),
    });
    navigate('/recetas');
  }

  return (
    <section>
      <h1>Nueva receta</h1>

      <form className="formulario" onSubmit={handleSubmit} noValidate>
        <label>
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </label>

        <label>
          Categoría
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="desayuno">desayuno</option>
            <option value="almuerzo">almuerzo</option>
            <option value="acompañamiento">acompañamiento</option>
            <option value="postre">postre</option>
          </select>
        </label>

        <label>
          Tiempo (minutos)
          <input
            name="tiempo"
            type="number"
            value={form.tiempo}
            onChange={handleChange}
          />
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit">Guardar receta</button>
      </form>
    </section>
  );
}

export default NuevaReceta;