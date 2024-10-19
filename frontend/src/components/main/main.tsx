import React from 'react';
import './main.css';
import { Component as MultipleChart } from "../ui/multiple-chart"
import { Component as CircleChart } from "../ui/circle-chart"


const Main: React.FC = () => {
  return (
    <main className="main-content">
      <div className="row">
        <div className="rectangleSmall"></div>
        <div className="rectangleSmall"></div>
        <div className="rectangleSmall"></div>
      </div>

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
