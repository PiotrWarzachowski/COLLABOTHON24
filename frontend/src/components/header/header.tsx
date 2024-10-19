import React from 'react';
import './header.css';
import {Tabs} from '../ui/tabs';

const Header: React.FC = () => {
  return (
    <header className="header">
      <img src="../../public/header.svg" alt="search" />
    </header>
  );
};

export default Header;
