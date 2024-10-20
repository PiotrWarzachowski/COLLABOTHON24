// components/ui/DataTableExtra.tsx

import React, { useState, useEffect } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { DataTable, CustomFilter, FilterOption } from "../../components/ui/data-table";
import { getTransactions, Transaction } from "@/api/transactionsEndpoint";

export interface Transactions {
    bankAccount: string;
    title: string;
    tag: string;
    date: Date;
    amount: number;
}

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

const DataTableExtra: React.FC = () => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [tags, setTags] = useState<FilterOption[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsData: Transactions[] = await getTransactions();
      setTransactions(transactionsData);
      const uniqueTags = Array.from(new Set(transactionsData.map(t => t.tag)));
      const tagOptions = uniqueTags.map(tag => ({
        value: tag,
        label: tag
      }));
      setTags(tagOptions);
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
  ];

  return (
    <DataTable
      data={transactions}
      columns={columns}
      filters={filters}
      filterColumn="title"
    />
  );
};

export default DataTableExtra;
