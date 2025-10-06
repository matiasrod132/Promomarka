import React, { useState } from 'react';
import './header.css';

const Header: React.FC = () => {
  return (
    <header>
      <div className="contenedor">
        <div className="logo">
          <img src="./favicon.ico" alt="Logo"/>
          <p>Promomarka</p>
        </div>
        <nav>
          <ul className="nav-links">
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
