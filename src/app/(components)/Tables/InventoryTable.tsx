"use client";

import { useState } from "react";
import { useGetProductsQuery, Product } from "@/redux/api/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, SearchIcon } from "lucide-react";

const columns: GridColDef<Product>[] = [
  { field: "productId", headerName: "ID", width: 90 },
  {
    field: "mfr",
    headerName: "Manufacturer",
    width: 150,
  },
  {
    field: "name",
    headerName: "Product Name",
    width: 200,
  },
  {
    field: "sku",
    headerName: "SKU",
    width: 150,
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
  },
  {
    field: "price",
    headerName: "Price",
    width: 120,
    type: "number",
    valueFormatter: (value: number) => `$${value.toFixed(2)}`,
  },
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  if (isLoading) {
    return <div className="py-4 text-gray-500">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="py-4 text-red-500 text-center">
        Failed to fetch products.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* SEARCH */}
      <div className="mb-6">
        <div className="flex items-center border border-input rounded">
          <SearchIcon className="w-5 h-5 text-muted-foreground m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER & BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Inventory" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
        </button>
      </div>

      {/* TABLE */}
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        autoHeight
        className="shadow rounded-lg border border-input"
      />
    </div>
  );
};

export default Inventory;
