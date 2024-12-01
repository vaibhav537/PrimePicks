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
  User,
  Pagination,
  Selection,
  SortDescriptor,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Helper } from "@/lib/utils/HelperClient";
import { allProducts, deleteProduct } from "@/lib/api/product";
import { verifyToken } from "@/lib/utils/verifyToken";
import { encrypter } from "@/lib/utils/crypto";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "title", sortable: true },
  { name: "PRICE", uid: "discountedPrice", sortable: true },
  { name: "ORDERS", uid: "count", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

type User = any;

type Product = {
  category: {
    id: string;
  };
  order: {
    id: string;
  }[];
  colors: [];
  createdAt: string;
  description: string[];
  discountPrice: number;
  id: string;
  images: string[];
  salePrice: number;
  title: string;
  updatedAt: string;
  variants: string[];
  count: { order: number };
};

const Page = () => {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [products, setProducts] = useState<Product[]>([]);
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
  const token = localStorage.getItem(helper.tokenName);
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !(await verifyToken(token))) router.push("/admin");
      const response = await allProducts();
      setProducts(response?.data);
    };
    fetchData();
    setPage(1);
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const handleEdit = useCallback(
    (id: string) => {
      const newID: string | null = encrypter(id);
      if (newID) {
        router.push(`/admin/products/edit-product/${newID}`);
      } else {
        helper.showErrorMessage("Try Again Later...");
      }
    },
    [router]
  );

  const handleDelete = (product: {
    orders: string[];
    id: React.SetStateAction<null>;
  }) => {
    if (product.orders.length > 0) {
      return helper.showErrorMessage("Cannot Delete Product with Orders");
    }
    setDeleteID(product.id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteID) {
      if (!token || !(await verifyToken(token))) router.push("/admin");
      const res = await deleteProduct(deleteID);
      if (res.status === true) {
        const clonedProducts = [...products];
        const index = clonedProducts.findIndex(
          (product) => product.id === deleteID
        );
        if (index !== -1) {
          clonedProducts.splice(index, 1);
        }
        setProducts(clonedProducts);
        helper.showSuccessMessage("Product deleted");
      } else {
        helper.showErrorMessage("Unable to delete product");
      }
    } else {
      helper.showErrorMessage("Unable to delete product");
    }
    onClose();
  };

  const headerColumns = columns;
  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...products];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [products, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (product: User, columnKey: React.Key) => {
      const cellValue = product[columnKey as keyof Product];
      switch (columnKey) {
        case "count": {
          return <div>{product.orders.length} </div>;
        }
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Edit Product" color="default">
                <span
                  className="text-lg text-blue-500 hover:text-blue-400 cursor-pointer"
                  onClick={() => handleEdit(product.id)}
                >
                  <FaEdit />
                </span>
              </Tooltip>
              <Tooltip content="Delete Product" color="danger">
                <span
                  className="text-lg text-red-500 hover:text-red-400 cursor-pointer"
                  onClick={() => handleDelete(product)}
                >
                  <FaTrash />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
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
            placeholder="Search by product name..."
            startContent={<FaSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              endContent={<FaPlus />}
              onClick={() => router.push("/admin/products/add-products")}
            >
              Add New Product
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {products.length} products
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
    products.length,
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
        <TableBody emptyContent={"No Products found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete product?
              </ModalHeader>
              <ModalBody>
                <p>This Action will be irreversible.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
