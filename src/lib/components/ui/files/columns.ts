import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "$lib/components/ui/files/data-table-actions.svelte";
import DataTableSortable from "$lib/components/ui/files/data-table-sortable-button.svelte";
import DataTableColumnHeader from "$lib/components/ui/files/data-table-column-header.svelte";
import DataTableTitleCell from "$lib/components/ui/files/data-table-title-cell.svelte";
 
// This type is used to define the shape of our data.\
export type File = {
  id: string;
  name: string;
  description: string;
  label?: string;
  link: string;
  date: Date;
  importance: boolean;
};
 
export const columns: ColumnDef<File>[] = [
 {
  accessorKey: "name",
  header: ({ column }) => 
    renderComponent(DataTableColumnHeader<File, unknown>, { column, title: "Judul Fail"}),
  cell : ({ row }) => {
    return renderComponent(DataTableTitleCell, {
      labelValue: row.original.label,
      value: row.original.name
    });
  },
 },
//  {
//   accessorKey: "description",
//   header: "Deskripsi",
//  },
 {
  accessorKey: "date",
  header: ({ column }) =>
    renderComponent(DataTableColumnHeader<File, unknown>, { column, title: "Tanggal Unggah"}),
    // renderComponent(DataTableSortable, {
    //   label: "Tanggal Unggah",
    //   onclick: column.getToggleSortingHandler(),
    // }),
 },
 {
  id: "actions",
  cell: ({ row }) => {
    // You can pass whatever you need from `row.original` to the component
        return renderComponent(DataTableActions, 
          { id: row.original.id,
            link: row.original.link
          }
        );
        // return renderComponent(DataTableActions<File>, { row });
    },
 },
];