import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import React from "react";

const columns = [
  { name: "NAME", uid: "user" },
  { name: "ORDER", uid: "id" },
  { name: "REVENUE", uid: "price" },
];

export default function RecentOrders({
  data,
}: {
  data: { id: number; price: number; user: { username: string } }[];
}) {
  const renderCell = React.useCallback(
    (
      user: { id: number; price: number; user: { username: string } },
      columnKey: string
    ) => {
      const cellValue =
        user[
          columnKey as keyof {
            id: number
            price: number;
            user: { username: string };
          }
        ];
      if (columnKey === "user") {
        const userData = cellValue as { username: string };
        return <>{userData?.username}</>;
      } else {
        return <> {cellValue}</>;
      }
    },
    []
  );

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
