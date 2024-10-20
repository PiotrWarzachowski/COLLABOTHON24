"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  RowData,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox" // Import the Checkbox component
import DatePicker from "@/components/ui/date-picker";

export interface FilterOption {
  value: string
  label: string
}

export interface CustomFilter<TData> {
  id: string
  label: string
  options?: FilterOption[] // Optional for boolean filters
  filterFn: (row: Row<TData>, selectedValues: any) => boolean
  filterType: 'dropdown' | 'checkbox'
  multiSelect?: boolean // Optional, default is true
}

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  filterColumn?: string
  filters?: CustomFilter<TData>[]
  autoResetPageIndex?: boolean
}

export function DataTable<TData extends RowData, TValue>({
  data,
  columns,
  filterColumn,
  filters,
  autoResetPageIndex = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState<
    Record<string, any>
  >({})

  const globalFilterFn = React.useCallback(
    (row: Row<TData>, columnIds: string[], filterValue: any) => {
      if (!filters) return true

      for (const filter of filters) {
        const selectedValue = filterValue[filter.id]
        if (filter.filterType === 'dropdown') {
          const isMultiSelect = filter.multiSelect !== false // default is true
          if (isMultiSelect) {
            const selectedValues = selectedValue || []
            if (selectedValues.length > 0) {
              if (!filter.filterFn(row, selectedValues)) {
                return false
              }
            }
          } else {
            if (selectedValue) {
              if (!filter.filterFn(row, selectedValue)) {
                return false
              }
            }
          }
        } else if (filter.filterType === 'checkbox') {
          if (selectedValue) {
            if (!filter.filterFn(row, selectedValue)) {
              return false
            }
          }
        }
      }
      return true
    },
    [filters]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: globalFilterFn,
    autoResetPageIndex,
  })

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 space-x-4">
        {filterColumn && (
          <div 
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 1,
              borderColor: "#7D8A88",
              borderRadius: '6px',
              color: '#212A33',
            }}>
            <Input
              placeholder={`Filter by ${filterColumn}...`}
              style={{
                backgroundColor: 'rgba(0,0,0,0)',
                color: '#212A33'
              }}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filterColumn)?.setFilterValue(event.target.value)
              }
              className="max-w-xs"
            />
          </div>
        )}
        {filters &&
          filters.map((filter) => {
            if (filter.filterType === 'dropdown' && filter.options) {
              const isMultiSelect = filter.multiSelect !== false
              return (
                <DropdownMenu key={filter.id} >
                  <DropdownMenuTrigger asChild style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgb(125, 138, 136)',
                    color: '#212A33'
                  }}>
                    <Button variant="outline" className="" style={{
                      backgroundColor: 'rgba(0,0,0,0)',
                      borderColor: 'rgb(125, 138, 136)',
                      color: '#212A33'
                    }} >
                      {filter.label} <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{
                    backgroundColor: 'rgb(202,221,205)',
                    borderColor: 'rgb(125, 138, 136)',
                    color: '#212A33'
                  }}>
                    {isMultiSelect ? (
                      // Multi-select dropdown
                      filter.options.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={
                            globalFilter[filter.id]?.includes(option.value) || false
                          }
                          style={{
                            backgroundColor: 'rgb(202,221,205)',
                            color: '#212A33'
                          }}
                          onCheckedChange={(checked) => {
                            setGlobalFilter((prev) => {
                              const selectedValues = prev[filter.id] || []
                              let newValues = [...selectedValues]
                              if (checked) {
                                newValues.push(option.value)
                              } else {
                                newValues = newValues.filter(
                                  (v: string) => v !== option.value
                                )
                              }
                              return {
                                ...prev,
                                [filter.id]: newValues,
                              }
                            })
                          }}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))
                    ) : (
                      // Single-select dropdown
                      <DropdownMenuRadioGroup
                        value={globalFilter[filter.id] || ''}
                        onValueChange={(value) => {
                          setGlobalFilter((prev) => ({
                            ...prev,
                            [filter.id]: value,
                          }))
                        }}
                      >
                        {filter.options.map((option) => (
                          <DropdownMenuRadioItem key={option.value} value={option.value}>
                            {option.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            } else if (filter.filterType === 'checkbox') {
              return (
                <div
                  key={filter.id}
                  className="flex items-center space-x-2 border rounded-md px-3 py-2"
                >
                  <Checkbox
                    checked={globalFilter[filter.id] || false}
                    onCheckedChange={(checked) => {
                      setGlobalFilter((prev) => ({
                        ...prev,
                        [filter.id]: checked,
                      }))
                    }}
                    id={`${filter.id}-checkbox`}
                  />
                  <label htmlFor={`${filter.id}-checkbox`} className="ml-1 text-sm">
                    {filter.label}
                  </label>
                </div>
              )
            }
            return null
          })}
        <DatePicker
          onDateRangeChange={() => null}
          fromDate={new Date()}
          toDate={new Date()}
        />
      </div>
      <div className="rounded-md">
        <Table>
          <TableHeader className="border-b border-customBorder"> 
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Navigation Panel */}
      <div className="flex items-center justify-between py-4">
        {/* Rows per page Select */}
        <div className="flex items-center space-x-2" >
          <span>Number of rows on page:</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-[70px]" style={{borderColor: '#7D8A88', backgroundColor: 'rgba(0,0,0,0)'}}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{backgroundColor: 'rgb(202, 221, 205)'}}>
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            style={{borderColor: '#7D8A88', backgroundColor: 'rgba(0,0,0,0)'}}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1}/
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            style={{borderColor: '#7D8A88', backgroundColor: 'rgba(0,0,0,0)'}}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
