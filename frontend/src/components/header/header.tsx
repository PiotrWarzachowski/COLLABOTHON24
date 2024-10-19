import React from 'react';
import './header.css';
import {Tabs} from '../ui/tabs';

const Header: React.FC = () => {
  return (
    <header className="header">
      {/* Górny wiersz */}
      <div className="top-row">
        <div className="icons">
          <span className="icon">🔍</span>
          <span className="icon">📄</span>
        </div>
        <div className="links">
          <a href="#">Group</a> | <a href="#">Contact</a> | <a href="#">PhotoTAN</a>
        </div>
      </div>

      {/* Środkowy wiersz */}
      <div className="middle-row">
        <div className="logo">
          {/* Umieść tutaj swoje logo SVG */}
          <img src="/path/to/logo.svg" alt="Logo" />
        </div>
        <div className="customer-links">
          <a href="#">Private customer</a>
          <a href="#">Corporate customer</a>
          <a href="#">Corporate customer</a>
        </div>
      </div>

      {/* Dolny wiersz */}
      <div className="bottom-row">
        <Tabs />
      </div>
    </header>
  );
};

export default Header;
