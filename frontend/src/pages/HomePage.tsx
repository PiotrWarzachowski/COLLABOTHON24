// src/pages/Home.tsx
import { Component as MultipleChart } from "../components/ui/multiple-chart"
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="App" style={{backgroundColor: '#E9F5EB'}}>
      <h1>Dashboard</h1>
      <MultipleChart  />
    </div>
  );
};

export default Home;
