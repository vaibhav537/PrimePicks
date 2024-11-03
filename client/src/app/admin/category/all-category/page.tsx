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
import { allCategory, deleteCategory } from "@/lib/api/category";

type Category = {
  id: number;
  name: string;
};

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "PRODUCTS", uid: "products", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

type User = any;

const page = () => {
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");
  const [categories, setCategories] = useState<Category[]>([]);
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
      const response = await allCategory();
      setCategories(response?.data);
    };
    fetchData();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/admin/category/edit-category/${id}`);
    },
    [router]
  );

  const handleDelete = (category: {
    product_count: any;
    id: React.SetStateAction<null>;
  }) => {
    if (category.product_count > 0) {
      return helper.showErrorMessage("Cannot Delete Category with Products");
    }
    setDeleteID(category.id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (deleteID) {
      const res = await deleteCategory(deleteID);
      if (res.status === true) {
        const clonedCategories = [...categories];
        const index = clonedCategories.findIndex(
          (category) => category.id === deleteID
        );
        if (index !== -1) {
          clonedCategories.splice(index, 1);
        }
        setCategories(clonedCategories);
        helper.showSuccessMessage("Category deleted");
      } else {
        helper.showErrorMessage("Error in deleting category");
      }
    } else {
      helper.showErrorMessage("Error in deleting category");
    }
    onClose();
  };

  const headerColumns = columns;
  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...categories];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [categories, filterValue]);

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
    (category: User, columnKey: React.Key) => {
      const cellValue = category[columnKey as keyof User];
      switch (columnKey) {
        case "products": {
          console.log({ category });
          return <div>{category.product_count} </div>;
        }
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip content="Edit Category" color="default">
                <span
                  className="text-lg text-blue-500 hover:text-blue-400 cursor-pointer"
                  onClick={() => handleEdit(category.id)}
                >
                  <FaEdit />
                </span>
              </Tooltip>
              <Tooltip content="Delete Category" color="danger">
                <span
                  className="text-lg text-red-500 hover:text-red-400 cursor-pointer"
                  onClick={() => handleDelete(category)}
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
            placeholder="Search by category name..."
            startContent={<FaSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              endContent={<FaPlus />}
              onClick={() => router.push("/admin/category/add-category")}
            >
              Add New Category
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {categories.length} categories
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
    categories.length,
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
          color="primary"
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
        <TableBody emptyContent={"No Category found"} items={sortedItems}>
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
                Are you sure you want to delete category?
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

export default page;
