"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const description = "A donut chart with a legend showing values and tags";

const revenueColors = [
  '#173739',
  '#4C7F81',
  '#93BAA7',
  '#C4D5AC',
  '#C0BE82',
  '#A6935B',
  '#836731'
];

// Data for a single month (January)
const revenueData = [
  { month: "January", productA: 120, productB: 90, productC: 60, productD: 12, productE: 90 },
];

// Chart configuration
const currentConfig = {
  data: revenueData,
  keys: ["productA", "productB", "productC", "productD", "productE"],
  colors: revenueColors,
  labels: {
    productA: "Product A",
    productB: "Product B",
    productC: "Product C",
    productD: "Product D",
    productE: "Product E",
  },
  title: "Total Revenue",
  // Removed the hard-coded total
};

function CustomLegend({ labels, colors, data }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "1rem",
        lineHeight: "1.5",
        fontFamily: "Gotham, sans-serif",
        alignItems: "center", // Center horizontally
        justifyContent: "center", // Center vertically
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
          <span>
            {data[key]} ({labels[key]})
          </span>
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
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          fontFamily: "Gotham, sans-serif",
        }}
      >
        <p>{`${data.payload.name}: ${data.payload.value}`}</p>
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
        overflow: "hidden",
      }}
    >
      <Card
        style={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          fontFamily: "Gotham, sans-serif",
          height: "100%",
          borderWidth: 0,
        }}
      >
        <CardHeader>
          <CardTitle style={{ fontSize: "2.8rem" }}>
            {currentConfig.title}: {totalValue} $
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            height: "calc(100% - 10%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Menu Icon and Text */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              {/* Inline SVG for the menu icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "8px" }}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span style={{ fontSize: "14px" }}>Configure total balance</span>
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
          <div style={{ marginTop: "10px", fontFamily: "Gotham, sans-serif" }}>
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Trending up by 5.2% this month
            </p>
            <p style={{ fontSize: "12px", fontWeight: "200" }}>
              Displaying financial performance for {currentConfig.data[0].month}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
