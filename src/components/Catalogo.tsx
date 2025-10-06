import React, { useState, useRef } from 'react';
import './catalogo.css';
import productos from '../productos.json';

type Modelo = {
  nombre: string;
  imagen: string;
};

type Producto = {
  nombre: string;
  descripcion: string;
  modelos: Modelo[];
}

const Catalogo: React.FC = () => {

  const [selectedModelos, setSelectedModelos] = useState<number[]>(
    productos.productos.map(() => 0)
  );
  const [search, setSearch] = useState('');

  const productosFiltrados = productos.productos.filter((prod: Producto) =>
    prod.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const productosPorCategoria: { [categoria: string]: Producto[] } = {};
  productosFiltrados.forEach((prod) => {
    const cat = (prod as any).categoria || 'Otros';
    if (!productosPorCategoria[cat]) productosPorCategoria[cat] = [];
    productosPorCategoria[cat].push(prod);
  });

  const handleModeloClick = (prodIdx: number, modeloIdx: number) => {
    setSelectedModelos((prev) =>
      prev.map((sel, idx) => (idx === prodIdx ? modeloIdx : sel))
    );
  };

  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    idx: number
  ) => {
    const img = imgRefs.current[idx];
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(2)';
  };

  const handleMouseLeave = (idx: number) => {
    const img = imgRefs.current[idx];
    if (!img) return;
    img.style.transformOrigin = `center center`;
    img.style.transform = '';
  };

  return (
    <section className="catalogo-section">
      <h2 className="catalogo-title">CATALOGO</h2>
      <div className="catalogo-subtitle">
        <div>Conoce los productos promocionales mas destacados</div>
      </div>
      <div className="catalogo-searchbar-container">
        <input
          className="catalogo-searchbar-input"
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="catalogo-searchbar-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#ffffffff" strokeWidth="2"/>
            <line x1="16.4142" y1="16" x2="20" y2="19.5858" stroke="#ffffffff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </div>

      {Object.entries(productosPorCategoria).map(([categoria, productosCat]) => (
        <div key={categoria} style={{ marginBottom: 40 }}>
          <h3 id={categoria} style={{
            color: '#17407e',
            fontWeight: 700,
            fontSize: 22,
            margin: '32px 0 18px 0',
            letterSpacing: 1
          }}>
            {categoria}
          </h3>
          <div className="catalogo-grid">
            {productosCat.map((prod: Producto) => {
              const realIdx = productos.productos.findIndex(p => p.nombre === prod.nombre);
              return (
                <div key={realIdx} className="catalogo-card">
                  <div className="catalogo-img-frame">
                    <img
                      ref={el => (imgRefs.current[realIdx] = el)}
                      src={prod.modelos[selectedModelos[realIdx]]?.imagen}
                      alt={prod.nombre}
                      className="catalogo-img"
                      onMouseMove={e => handleMouseMove(e, realIdx)}
                      onMouseLeave={() => handleMouseLeave(realIdx)}
                      onMouseOut={() => handleMouseLeave(realIdx)}
                    />
                  </div>
                  <div className="catalogo-nombre">{prod.nombre}</div>
                  <div className="catalogo-desc">{prod.descripcion}</div>
                  <div className="catalogo-modelos">
                    {prod.modelos.map((modelo, modeloIdx) => (
                      <button
                        key={modeloIdx}
                        className={`catalogo-modelo-btn${selectedModelos[realIdx] === modeloIdx ? ' selected' : ''}`}
                        onClick={() => handleModeloClick(realIdx, modeloIdx)}
                        onMouseEnter={() => handleModeloClick(realIdx, modeloIdx)}
                        title={modelo.nombre}
                        type="button"
                      >
                        <img
                          src={modelo.imagen}
                          alt={modelo.nombre}
                          className="catalogo-modelo-mini"
                        />
                      </button>
                    ))}
                  </div>
                  <button className="catalogo-btn">Leer más</button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Catalogo;