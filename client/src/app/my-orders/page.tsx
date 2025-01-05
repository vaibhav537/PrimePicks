"use client";

import { useUserDetails } from "@/hooks/useAppStore";
import { getAllOrders, getUserOrders } from "@/lib/api/orders";
import { encrypter } from "@/lib/utils/crypto";
import { Helper } from "@/lib/utils/HelperClient";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const columns = [
  { name: "Order ID", uid: "id" },
  { name: "Products", uid: "products" },
  { name: "Price", uid: "price", sortable: true },
  { name: "Order Date", uid: "createdAt" },
  { name: "Payment Type", uid: "paymentType" },
  { name: "Payment Status", uid: "paymentStatus", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

interface OrderStatus {
  key: string;
  status: string;
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  users: string;
  products: string[];
  price: string;
  status: OrderStatus;
  paymentintent: string;
  paymentStatus: boolean;
  user: string;
}

const MyOrders = () => {
  const router = useRouter();
  const { user } = useUserDetails();
  const helper = new Helper();
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id !== undefined) {
        const response = await getUserOrders(user.id);
        if (response && "data" in response) {
          setOrders(response.data.data as Order[]);
        }
      } else {
        helper.showErrorMessage("User not found");
        router.push("/logout");
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.id.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [orders, filterValue]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredOrders]);

  const sortedOrders = useMemo(() => {
    return [...paginatedOrders].sort((a, b) => {
      const aValue = a[sortDescriptor.column as keyof Order] as string | number;
      const bValue = b[sortDescriptor.column as keyof Order] as string | number;
      const compare = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDescriptor.direction === "ascending" ? compare : -compare;
    });
  }, [sortDescriptor, paginatedOrders]);

  const renderCell = useCallback(
    (order: Order, columnKey: React.Key) => {
      switch (columnKey) {
        case "products":
          return <span>{order.products.length}</span>;
        case "createdAt":
          return <span>{new Date(order.createdAt).toLocaleDateString()}</span>;
        case "paymentType":
          return (
            <Chip
              color={order.paymentintent === "Stripe" ? "secondary" : "success"}
              size="sm"
              variant="flat"
            >
              {order.paymentintent}
            </Chip>
          );
        case "paymentStatus":
          return (
            <Chip
              color={order.paymentStatus ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {order.paymentStatus ? "Completed" : "Pending"}
            </Chip>
          );
        case "actions":
          return (
            <Tooltip content="View Order">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => {
                  const eOID = encrypter(order.id);
                  router.push(`/my-orders/${eOID}`);
                }}
              >
                <FaEye />
              </Button>
            </Tooltip>
          );
        default:
          const cellValue = order[columnKey as keyof Order];
          if (Array.isArray(cellValue)) {
            return <span>{cellValue.join(", ")}</span>;
          } else if (typeof cellValue === "object" && cellValue !== null) {
            return <span>{JSON.stringify(cellValue)} </span>;
          } else if (typeof cellValue === "boolean") {
            return <span>{cellValue ? "Yes" : "No"}</span>;
          }
          return <span>{cellValue}</span>;
      }
    },
    [router]
  );

  return (
    <div className="p-10">
      <Table
        aria-label="Orders Table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedOrders} emptyContent="No orders found">
          {(order) => (
            <TableRow key={order.id}>
              {(columnKey) => (
                <TableCell>{renderCell(order, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        total={Math.ceil(filteredOrders.length / rowsPerPage)}
        page={page}
        onChange={setPage}
      />
    </div>
  );
};

export default MyOrders;
