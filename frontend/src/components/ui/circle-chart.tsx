"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import '@/styles/globals.css';

const revenueColors = [
  '#173739',
  '#4C7F81',
  '#93BAA7',
  '#C4D5AC',
  '#C0BE82',
  '#A6935B',
  '#836731'
];

const revenueData = [
  { 
    Account: 312412,
    Credit: 122000,
    Credit2: 444123, 
    savingAccount: 30123, 
    savingAccount2: 400000, 
    savingAccount3: 863123
  },
];

const currentConfig = {
  data: revenueData,
  keys: ["Account", "Credit", "Credit2", "savingAccount", "savingAccount2", "savingAccount3"],
  colors: revenueColors,
  labels: {
    Account: "Account",
    Credit: "Car credit",
    Credit2: "House credit",
    savingAccount: "Savings Account for vacation",
    savingAccount2: "Savings Account for house",
    savingAccount3: "Account for employee salaries",
  },
  title: "Sum of all products",
};

function CustomLegend({ labels, colors, data }) {
  return (
    <div
    className="font-gotham"
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "1rem",
        lineHeight: "1.5",
      }}
    >
      {Object.keys(labels).map((key, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 10,
              backgroundColor: colors[index],
              marginRight: 8,
              borderRadius: "10px",
            }}
          ></div>
          <div>
            <div>
              <span style={{fontWeight: 'bold'}}>{data[key].toLocaleString()} €</span>
            </div>   
            <div>
              {`${labels[key]}`}
            </div> 
          </div>       
        </div>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
      className="font-gotham"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p>{`${data.payload.name}`}, <span style={{fontWeight: 'bold'}}>{data.payload.value.toLocaleString()} €</span></p>
      </div>
    );
  }

  return null;
};

export function Component() {
  // Prepare data for the pie chart
  const pieData = currentConfig.keys.map((key) => ({
    name: currentConfig.labels[key],
    value: currentConfig.data[0][key],
  }));

  // Calculate total automatically
  const totalValue = pieData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: "0 auto",
        paddingBottom: '30px',
        overflow: "hidden",
        border: '0px'
      }}
    >
      <Card
        style={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          fontFamily: "Gotham, sans-serif",
          height: "100%",
          borderWidth: 0,
        border: '0px'
        }}
      >
        <CardHeader>
          <CardTitle style={{ fontSize: "2.8rem" }}>
            {currentConfig.title}: {totalValue.toLocaleString()} €
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            height: "calc(100% - 10%)",
            display: "flex",
            flexDirection: "column",
        border: '0px'
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "8px" }}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span style={{ fontSize: "22px", fontWeight: 'bold' }}>Configure total balance</span>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, paddingTop: "20px" }}>
              <div style={{ flex: "0 0 60%", maxHeight: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="78%" 
                    outerRadius="100%"
                    fill="#8884d8"
                    label={false}
                    paddingAngle={0}
                    startAngle={90} 
                    endAngle={-270}
                    stroke="none" 
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={currentConfig.colors[index % currentConfig.colors.length]}
                        stroke="none" 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                flex: "0 0 40%",
                display: "flex",
                alignItems: "center", 
                justifyContent: "center",
              }}
            >
              <CustomLegend
                labels={currentConfig.labels}
                colors={currentConfig.colors}
                data={currentConfig.data[0]}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
