"use client"

import React, { useState, useEffect } from 'react';
import './main.css';
import { Component as MultipleChart } from "../ui/multiple-chart"
import { Component as CircleChart } from "../ui/circle-chart"
import '@/styles/globals.css';
import { Link } from "react-router-dom"

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { ColumnDef, Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataTable, CustomFilter, FilterOption } from "../../components/ui/data-table"
import { getTransactions, Transaction } from "@/api/transactionsEndpoint";
import { DotProps } from 'recharts';

export interface Transactions {
    bankAccount: string,
    title: string,
    tag: string,
    date: Date,
    amount: number
};
interface DotProps {
  isActive: boolean;
  size?: number; 
}

const Dot: React.FC<DotProps> = ({ isActive, size = 20 }) => {
  const color = isActive ? '#173739' : '#A12F1B';

  const style: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: '50%'
  };

  return <span style={style}></span>;
};

export const columns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "bankAccount",
    header: () => <div>Account owner</div>,
    cell: ({ row }) => 
      <div style={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center'
      }}>
          <Dot isActive={row.original.amount > 0 } size={10}/> 
          <div style={{paddingLeft: '20px'}}>{row.getValue("bankAccount")}</div>
      </div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Title
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "tag",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Tag
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>{row.getValue("tag")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.original.date.toLocaleString().replace(', 00:00:00', '')}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Amount
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div style={{fontWeight: 'bold'}}>{row.getValue("amount")} €</div>
    ),
  },
]


const Main: React.FC = () => {
  const [transactions, setTransactions] = useState([] as Transactions[]);
  const [tags, setTags] = React.useState<FilterOption[]>([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
        const transactions: Transactions[] = await getTransactions();
        setTransactions(transactions);
        setTags(transactions.map((value, index) => value.tag).filter((value, index, array) => array.indexOf(value) === index).map((value, index) => {
          return {
            value: value,
            label: value
          }
        }))
    };

    fetchTransactions();
  }, []);

  const filters: CustomFilter<Transactions>[] = [
    {
      id: "tagFilter",
      label: "Tag",
      options: tags,
      filterFn: (row, selectedValues) => selectedValues.includes(row.original.tag),
      filterType: "dropdown",
    }
  ]


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
        <div className="rectangleBig">
          <DataTable
              data={transactions}
              columns={columns}
              filters={filters}
              filterColumn="title"
            />
        </div>
      </div>
    </main>
  );
};

export default Main;
