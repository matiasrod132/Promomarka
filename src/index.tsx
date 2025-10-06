import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Catalogo from './components/Catalogo';
import './index.css';
import Footer from './components/Footer';
import { injectSpeedInsights } from "@vercel/speed-insights";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Header />
      <Catalogo />
      <Footer />
  </React.StrictMode>
);

injectSpeedInsights();