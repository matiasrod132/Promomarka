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
  const isMobile = window.innerWidth <= 768;
  const [zoomed, setZoomed] = useState(false);

  const handleTouchMove = (
    e: React.TouchEvent<HTMLImageElement>,
    idx: number
  ) => {
    const img = imgRefs.current[idx];
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(2.5)'; // O el nivel de zoom que prefieras
  };

  const [hoveredModelos, setHoveredModelos] = useState<(number | null)[]>(
    productos.productos.map(() => null)
  );

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
        <span className="catalogo-searchbar-icon material-symbols-outlined">search</span>
      </div>

      {Object.keys(productosPorCategoria).length === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#f25820',
          fontWeight: 700,
          fontSize: 22,
          margin: '60px 0 100px 0',
          minHeight: '200px'
        }}>
          No se encontró ese producto.
        </div>
      )}
      
      {Object.entries(productosPorCategoria).map(([categoria, productosCat]) => (
        <div key={categoria} style={{ marginBottom: 40 }}>
          <h3 id={categoria} className="catalogo-sections">{categoria}</h3>
          <div className="catalogo-grid">
            {productosCat.map((prod: Producto) => {
              const realIdx = productos.productos.findIndex(p => p.nombre === prod.nombre);
              return (
                <div key={realIdx} className="catalogo-card">
                  <div className="catalogo-img-frame">
                    <img
                    ref={el => (imgRefs.current[realIdx] = el)}
                    src={
                      prod.modelos[
                        hoveredModelos[realIdx] !== null
                          ? hoveredModelos[realIdx]!
                          : selectedModelos[realIdx]
                      ]?.imagen
                    }
                    onClick={() => {
                      if (isMobile) {
                        const img  = imgRefs.current[realIdx];
                        if (!img) return;
                        if (!zoomed) {
                          img.style.transform = 'scale(2)';
                        } else {
                          img.style.transform = '';
                        }
                        setZoomed(!zoomed);
                      }
                    }}
                    alt={prod.nombre}
                    className="catalogo-img"
                    onMouseMove={e => !isMobile && handleMouseMove(e, realIdx)}
                    onMouseLeave={() => !isMobile && handleMouseLeave(realIdx)}
                    onMouseOut={() => !isMobile && handleMouseLeave(realIdx)}
                    onTouchStart={e => handleTouchMove(e, realIdx)}
                    onTouchMove={e => handleTouchMove(e, realIdx)}
                    onTouchEnd={() => handleMouseLeave(realIdx)}
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
                        onMouseEnter={() => {
                          setHoveredModelos(prev =>
                            prev.map((val, idx) => (idx === realIdx ? modeloIdx : val))
                          );
                        }}
                        onMouseLeave={() => {
                          setHoveredModelos(prev =>
                            prev.map((val, idx) => (idx === realIdx ? null : val))
                          );
                        }}
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