"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const description = "A stacked bar chart with a legend";


const revenueColors = [
  '#173739',
  '#4C7F81',
  '#93BAA7',
  '#C4D5AC',
  '#C0BE82',
  '#A6935B',
  '#836731'
]


const expensesColors = [
  '#3F1715',
  '#73332F',
  '#C89C89',
  '#D5C7AC',
  '#C0A982',
  '#A6805B',
  '#834F31'
]

const profitsColors = [
  '#3F1715',
  '#73332F',
  '#C89C89',
  '#D5C7AC',
  '#C0A982',
  '#A6805B',
  '#834F31'
]

// Dane dla Revenue, Expenses i Profits
const revenueData = [
  { month: "January", productA: 120, productB: 90, productC: 60 },
  { month: "February", productA: 150, productB: 110, productC: 80 },
  { month: "March", productA: 130, productB: 100, productC: 70 },
  { month: "April", productA: 160, productB: 120, productC: 90 },
  { month: "May", productA: 170, productB: 130, productC: 100 },
  { month: "June", productA: 180, productB: 140, productC: 110 },
  { month: "July", productA: 190, productB: 150, productC: 120 },
  { month: "August", productA: 200, productB: 160, productC: 130 },
  { month: "September", productA: 210, productB: 170, productC: 140 },
  { month: "October", productA: 220, productB: 180, productC: 150 },
  { month: "November", productA: 230, productB: 190, productC: 160 },
  { month: "December", productA: 240, productB: 200, productC: 170 },
];

const expensesData = [
  { month: "January", employees: 25, office: 15, marketing: 10 },
  { month: "February", employees: 35, office: 20, marketing: 15 },
  { month: "March", employees: 30, office: 20, marketing: 15 },
  { month: "April", employees: 35, office: 20, marketing: 10 },
  { month: "May", employees: 40, office: 30, marketing: 20 },
  { month: "June", employees: 50, office: 35, marketing: 25 },
  { month: "July", employees: 60, office: 40, marketing: 35 },
  { month: "August", employees: 55, office: 35, marketing: 30 },
  { month: "September", employees: 40, office: 25, marketing: 20 },
  { month: "October", employees: 45, office: 30, marketing: 25 },
  { month: "November", employees: 40, office: 25, marketing: 20 },
  { month: "December", employees: 35, office: 20, marketing: 15 },
];

const profitsData = [
  { month: "January", profit: 80 },
  { month: "February", profit: 95 },
  { month: "March", profit: 85 },
  { month: "April", profit: 100 },
  { month: "May", profit: 110 },
  { month: "June", profit: 120 },
  { month: "July", profit: 130 },
  { month: "August", profit: 140 },
  { month: "September", profit: 150 },
  { month: "October", profit: 160 },
  { month: "November", profit: 170 },
  { month: "December", profit: 180 },
];

// Konfiguracje wykresu dla różnych zakładek
const chartConfigs = {
  revenue: {
    data: revenueData,
    keys: ["productA", "productB", "productC"],
    colors: revenueColors,
    labels: {
      productA: "Product A",
      productB: "Product B",
      productC: "Product C",
    },
    title: "Total Revenue",
    total: "1,920,000 $",
  },
  expenses: {
    data: expensesData,
    keys: ["employees", "office", "marketing"],
    colors: expensesColors,
    labels: {
      employees: "Employees",
      office: "Office",
      marketing: "Marketing",
    },
    title: "Total Expenses",
    total: "226,241.20 $",
  },
  profits: {
    data: profitsData,
    keys: ["profit"],
    colors: profitsColors,
    labels: {
      profit: "Profit",
    },
    title: "Total Profits",
    total: "1,693,758.80 $",
  },
};

// Niestandardowy komponent legendy
function CustomLegend({ labels, colors }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "1rem",
        lineHeight: "1.5",
        fontFamily: "Gotham, sans-serif",
        paddingLeft: "20px",
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
          <span>{labels[key]}</span>
        </div>
      ))}
    </div>
  );
}

export function Component() {
  const [activeTab, setActiveTab] = useState("expenses");

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const currentConfig = chartConfigs[activeTab];

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
            {currentConfig.title}: {currentConfig.total}
          </CardTitle>
        </CardHeader>
        <CardContent
          style={{
            height: "calc(100% - 10%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <DatePicker />
            <Tabs
              defaultValue="expenses"
              className="w-[400px]"
              style={{ marginLeft: "2%" }}
              onValueChange={handleTabChange}
            >
              <TabsList style={{ backgroundColor: "#CADDCD" }}>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="profits">Profits</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Kontener dla wykresu i legendy */}
          <div style={{ display: "flex", flex: 1, paddingTop: "20px" }}>
            {/* Kontener wykresu */}
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={currentConfig.data} margin={{ top: 20 }}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    style={{ fontFamily: "Gotham, sans-serif" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                    }}
                    cursor={{ fill: "rgba(0, 0, 0, 0)" }}
                  />
                  {/* Dodaj dynamicznie słupki */}
                  {currentConfig.keys.map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={currentConfig.colors[index]}
                      radius={
                        index === 0
                          ? [0, 0, 15, 15]
                          : index === currentConfig.keys.length - 1
                          ? [15, 15, 0, 0]
                          : [0, 0, 0, 0]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Kontener legendy */}
            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
              <CustomLegend
                labels={currentConfig.labels}
                colors={currentConfig.colors}
              />
            </div>
          </div>
          <div style={{ marginTop: "10px", fontFamily: "Gotham, sans-serif" }}>
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Trending up by 5.2% this month
            </p>
            <p style={{ fontSize: "12px", fontWeight: "200" }}>
              Displaying financial performance for the past 6 months.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
