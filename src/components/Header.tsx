import React, { useState } from 'react';
import './header.css';

const Header: React.FC = () => {
  return (
    <header>
      <div className="contenedor">
        <div className="logo">
          {/* <img src="./favicon.ico" alt="Logo" width="100" height="103" /> */}
          <p>Promomarka</p>
        </div>
        <nav className='menu-idioma'>
          <ul className="nav-links desktop-only">
            <li><a href="#Textileria">Textileria</a></li>
            <li><a href="#Maleteria">Maleteria</a></li>
            <li><a href="#Otros">Otros</a></li>
          </ul>

        </nav>
      </div>
    </header>
  );
};

export default Header;
