// main.tsx (lub odpowiednia nazwa pliku)

"use client"

import React from 'react';
import './main.css';
import { Component as MultipleChart } from "../ui/multiple-chart";
import { Component as CircleChart } from "../ui/circle-chart";
import '@/styles/globals.css';
import { Link } from "react-router-dom";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DataTableExtra from "@/components/ui/data-table-extra";

const Main: React.FC = () => {
  return (
    <main className="main-content">
      <img src="../../public/main_view_header.svg" style={{ padding: '77px' }} alt="search" />

      <div className="row">
        <div className="rectangle">
          <CircleChart />
        </div>
        <div className="rectangle">
          <MultipleChart />
        </div>
      </div>
    </main>
  );
};

export default Main;
