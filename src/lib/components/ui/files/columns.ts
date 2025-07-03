import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "$lib/components/ui/files/data-table-actions.svelte";
import DataTableSortable from "$lib/components/ui/files/data-table-sortable-button.svelte";
import DataTableColumnHeader from "$lib/components/ui/files/data-table-column-header.svelte";
import DataTableTitleCell from "$lib/components/ui/files/data-table-title-cell.svelte";
import DataTableLinkCell from "$lib/components/ui/files/data-table-link-cell.svelte";
import DataTableJudulCell from "$lib/components/ui/files/data-table-judul-cell.svelte";
import DataTableImportanceBadge from "$lib/components/ui/files/data-table-badge.svelte";
 
// This type is used to define the shape of our data.\
export type File = {
  id: string;
  name: string;
  description: string;
  label?: string;
  link: string;
  date: Date;
  importance: string;
  type: string;
};
 
export const columns: ColumnDef<File>[] = [
 {
  accessorKey: "name",
  header: ({ column }) => 
    renderComponent(DataTableColumnHeader<File, unknown>, { column, title: "Judul Fail"}),
  cell : ({ row }) => {
    return renderComponent(DataTableJudulCell, {
      name: row.original.name,
      labelValue: row.original.label,
      description: row.original.description,
      link: row.original.link,
      date: row.original.date,
      importance: row.original.importance,
    });
  },
 },
 {
  accessorKey: "date",
  header: ({ column }) =>
    renderComponent(DataTableColumnHeader<File, unknown>, { column, title: "Tanggal Unggah"}),
  cell: ({ row }) => {
    const formatted = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(row.original.date));

    return formatted;
  },
 },
 {
  accessorKey: "link",
  header: "Tautan",
  cell: ({ row }) =>
    renderComponent(DataTableLinkCell, {
      link: row.original.link,
    }),
 },
 {
  id: "importance",
  accessorFn: (row) => row.importance,
  header: () => null,
  enableSorting: false,
  cell: ({ row }) => {
    return renderComponent(DataTableImportanceBadge, {
      importance: row.original.importance
    });
  },
  filterFn: (row, id, value: string[]) => {
    return value.includes(row.getValue(id) as string);
  },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     // You can pass whatever you need from `row.original` to the component
  //         return renderComponent(DataTableActions, 
  //           { file: row.original,
  //           }
  //         );
  //     },
  // },
  {
    id: "label",
    accessorFn: (row) => row.label,
    header: () => null,
    cell: () => null, 
  },
  {
    id: "type",
    accessorFn: (row) => row.type,
    header: () => null,
    cell: () => null, 
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (filterValue === "pengumuman") {
        return value === "pengumuman" || value === "both";
      }
      return value === filterValue;
    }
  },
];