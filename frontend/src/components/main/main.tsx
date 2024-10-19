import React from 'react';
import './main.css';
import { Component as MultipleChart } from "../ui/multiple-chart"
import { Component as CircleChart } from "../ui/circle-chart"


const Main: React.FC = () => {
  return (
    <main className="main-content">
      <img src="../../public/main_view_header.svg" style={{padding: '77px'}} alt="search" />

      <div className="row">
        <div className="rectangle">
          <CircleChart />
        </div>
        <div className="rectangle">
          <MultipleChart />
        </div>
      </div>

      <div className="row">
        <div className="rectangle"></div>
      </div>
    </main>
  );
};

export default Main;
