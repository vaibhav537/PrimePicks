"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Selection,
  SortDescriptor,
  Tooltip,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Helper } from "@/lib/utils/HelperClient";
import { getAllOrders } from "@/lib/api/orders";
import { FaEye } from "react-icons/fa6";
import SLoader from "@/components/SLoader";
import { encrypter } from "@/lib/utils/crypto";

const columns = [
  { name: "ORDER ID", uid: "id" },
  { name: "USER", uid: "user" },
  { name: "PRODUCTS", uid: "count" },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "ORDER DATE", uid: "createdAt" },
  { name: "PAYMENT TYPE", uid: "paymentIntent" },
  { name: "PAYMENT STATUS", uid: "paymentStatus", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

//type User = any;

interface Status {
  paymentMode: string;
}

interface User {
  id: string;
  username: string;
}

// interface Count {
//   products: number;
// }

interface OrdersType {
  createdAt: string;
  id: string;
  paymentIntent: string;
  paymentStatus: boolean;
  price: number;
  status: Status;
  updatedAt: string;
  user: string;
  products: number;
}

const Page = () => {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [orders, setOrders] = useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const helper = new Helper();
  const [page, setPage] = React.useState(1);
  const [deleteID, setDeleteID] = React.useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllOrders();
      setOrders(response?.data.reverse());
    };
    fetchData();
    setPage(1);
  }, []);

  const handleView = async (id: string) => {
    const newId: string | null = encrypter(id);
    if (newId) {
      router.push(`/admin/orders/${newId}`);
    } else {
      helper.showErrorMessage("Try Again Later...");
    }
  };
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = columns;

  const filteredItems = React.useMemo(() => {
    if (!hasSearchFilter) return orders;

    return orders.filter((order: OrdersType) => {
      const searchValue = filterValue.toLowerCase();

      // Ensure user is a string and handle null/undefined gracefully
      const user = order.user?.toString() || "Unknown User";

      return (
        user.toLowerCase().includes(searchValue) ||
        order.id.toLowerCase().includes(searchValue) ||
        order.paymentIntent.toLowerCase().includes(searchValue)
      );
    });
  }, [orders, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: OrdersType, b: OrdersType) => {
      const first = a[sortDescriptor.column as keyof OrdersType];
      const second = b[sortDescriptor.column as keyof OrdersType];

      if (typeof first === "number" && typeof second === "number") {
        return sortDescriptor.direction === "descending"
          ? second - first
          : first - second;
      }

      if (typeof first === "string" && typeof second === "string") {
        return sortDescriptor.direction === "descending"
          ? second.localeCompare(first)
          : first.localeCompare(second);
      }

      return 0;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (order: OrdersType, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof OrdersType];

      switch (columnKey) {
        case "count": {
          return <div>{order.products || 0}</div>;
        }
        case "user": {
          return <div>{String(cellValue) || "Unknown User"}</div>;
        }
        case "paymentStatus": {
          return (
            <Chip
              className="capitalize"
              color={cellValue ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue ? "Completed" : "Pending"}
            </Chip>
          );
        }
        case "paymentIntent": {
          return (
            <Chip
              className="capitalize"
              color={cellValue === "Stripe" ? "secondary" : "success"}
              size="sm"
              variant="flat"
            >
              {cellValue === "Stripe" ? "Stripe" : "Cash on Delivery"}
            </Chip>
          );
        }
        case "actions": {
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="View Order" color="default">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="primary"
                  onClick={() => handleView(order.id)}
                >
                  <FaEye />
                </Button>
              </Tooltip>
            </div>
          );
        }
        default: {
          // Fallback for primitive values
          return <div>{String(cellValue)}</div>;
        }
      }
    },
    [router]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by Order ID, User, or Payment Type..."
            startContent={<FaSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {orders.length} orders
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    orders.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="default"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="p-10">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<SLoader text="LOADING ..." />}
          items={sortedItems}
        >
          {(item: OrdersType) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
