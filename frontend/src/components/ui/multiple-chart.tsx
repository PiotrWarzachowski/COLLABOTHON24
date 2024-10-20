"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserTags } from "@/api/tagsEndpoint";
import { getTransactions } from "@/api/transactionsEndpoint";
import '@/styles/globals.css';

export const description = "A stacked bar chart with a legend";

function getDaysBetweenDates(date1: Date, date2: Date): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const timeDifference = Math.abs(date2.getTime() - date1.getTime());
  const dayDifference = Math.ceil(timeDifference / oneDay);
  return dayDifference;
}

const revenueColors = [
  "#173739",
  "#4C7F81",
  "#93BAA7",
  "#C4D5AC",
  "#C0BE82",
  "#A6935B",
  "#836731",
];

const expensesColors = [
  "#3F1715",
  "#73332F",
  "#C89C89",
  "#D5C7AC",
  "#C0A982",
  "#A6805B",
  "#834F31",
];

const profitsColors = ["#173739", "#A12F1B"]; // Updated colors

// Custom Tooltip Component
function CustomTooltip({ active, payload, label, labels, hoveredSegment }) {
  if (active && payload && payload.length && hoveredSegment) {
    const hoveredData = payload.find(
      (entry) => entry.dataKey === hoveredSegment
    );
    if (hoveredData) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <span>{labels[hoveredData.dataKey]}</span>
        </div>
      );
    }
  }

  return null;
}

export function Component() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [fromDate, setFromDate] = useState("2024-10-13");
  const [toDate, setToDate] = useState("2024-10-20");
  const [type, setType] = useState("day");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentConfig, setCurrentConfig] = useState({
    keys: [],
    colors: [],
    labels: {},
    title: "",
    isStacked: true, 
  });
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleDateRangeChange = (newFromDate, newToDate) => {
    setFromDate(newFromDate);
    setToDate(newToDate);

    if (
      getDaysBetweenDates(new Date(newFromDate), new Date(newToDate)) <
      15
    ) {
      setType("day");
    } else {
      setType("year");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let jsonData = await getUserTags(
          fromDate,
          toDate,
          type,
          activeTab
        );

        if (jsonData.data.length === 0) {
          setData([]);
          setTotal(0);
          setCurrentConfig({
            keys: [],
            colors: [],
            labels: {},
            title: "",
            isStacked: true,
          });
          return;
        }

        const dataKeys = Object.keys(jsonData.data[0].transactions);

        let computedTotal = 0;
        jsonData.data.forEach((item) => {
          dataKeys.forEach((key) => {
            computedTotal += item.transactions[key];
          });
        });
        setTotal(computedTotal);

        const chartData = jsonData.data.map((item) => ({
          period: item.period,
          ...item.transactions,
        }));
        setData(chartData);

        const newConfig = {
          keys: dataKeys,
          colors: [],
          labels: jsonData.labels,
          title: "",
          isStacked: true, 
        };

        if (activeTab === "revenue") {
          newConfig.colors = revenueColors;
          newConfig.title = "Total Revenue";
          newConfig.isStacked = true;
          newConfig.className = "font-gotham";
        } else if (activeTab === "expenses") {
          newConfig.colors = expensesColors;
          newConfig.title = "Total Expenses";
          newConfig.isStacked = true;
          newConfig.className = "font-gotham";
        } else if (activeTab === "profit") {
          newConfig.colors = profitsColors;
          newConfig.title = "Total Profit";
          newConfig.isStacked = false;
          newConfig.className = "font-gotham";
        }

        setCurrentConfig(newConfig);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [activeTab, fromDate, toDate, type]);

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
        className="font-gotham"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          height: "100%",
          borderWidth: 0,
        }}
      >
        <CardHeader>
          <CardTitle style={{ fontSize: "2.8rem" }}>

              {currentConfig.title}: {total.toLocaleString()} €

            {/*{currentConfi159.131,00g.title}: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(total)}*/}
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
            <DatePicker
              onDateRangeChange={handleDateRangeChange}
              fromDate={fromDate}
              toDate={toDate}
            />
            <Tabs
              defaultValue="expenses"
              className="w-[400px]"
              style={{ marginLeft: "2%" }}
              onValueChange={handleTabChange}
            >
              <TabsList style={{ backgroundColor: "#CADDCD" }}>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="profit">Profit</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div style={{ display: "flex", flex: 1, paddingTop: "20px" }}>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={data}
                  margin={{ top: 20 }}
                  // Usunięto onMouseMove z BarChart
                >
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                    className="font-gotham"
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        labels={currentConfig.labels}
                        hoveredSegment={hoveredSegment}
                      />
                    }
                    cursor={{ fill: "rgba(0, 0, 0, 0)" }}
                  />
                  {currentConfig.keys.map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId={
                        currentConfig.isStacked ? "a" : undefined
                      }
                      fill={
                        currentConfig.colors[
                          index % currentConfig.colors.length
                        ]
                      }
                      radius={
                        currentConfig.keys.length !== 2 && type !== 'profit' ? (
                          currentConfig.isStacked
                            ? index === 0
                              ? [0, 0, 10, 10]
                              : index === currentConfig.keys.length - 1
                              ? [10, 10, 0, 0]
                              : [0, 0, 0, 0]
                            : [5, 5, 0, 0]
                        ) : [10, 10, 10, 10]
                      }
                      barSize={currentConfig.isStacked ? undefined : 40} 
                      onMouseEnter={() => setHoveredSegment(key)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              <CustomLegend
                labels={currentConfig.labels}
                colors={currentConfig.colors}
              />
            </div>
          </div>
          <div
            className="font-gotham"
            style={{
              marginTop: "10px",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>
              Trending up by 5.2% this month
            </p>
            <p style={{ fontSize: "12px", fontWeight: "200" }}>
              Displaying financial performance for the selected date
              range.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Custom Legend Component
function CustomLegend({ labels, colors }) {
  return (
    <div
      className="font-gotham"
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "1rem",
        lineHeight: "1.5",
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
              width: 30,
              height: 10,
              backgroundColor: colors[index % colors.length],
              marginRight: "1rem",
              borderRadius: "10px",
              marginLeft: "3rem",
            }}
          ></div>
          <span>{labels[key]}</span>
        </div>
      ))}
    </div>
  );
}
