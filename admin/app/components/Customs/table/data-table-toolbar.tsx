import { type Table } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import type { IFilters, ISearch } from "./types"
import { X } from "lucide-react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>,
    filters: IFilters[],
    searchInput?: ISearch,
    buttonAdd?: string,
    toogleColumns: boolean
}


export function DataTableToolbar<TData>({
    table,
    filters,
    searchInput,
    buttonAdd,
    toogleColumns
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                {
                    searchInput && (
                        <Input
                            placeholder={searchInput.placeHolder}
                            value={(table.getColumn(searchInput.columnName)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchInput.columnName)?.setFilterValue(event.target.value)
                            }
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    )
                }

                {
                    filters.map((fil, inx) => (
                        table.getColumn(fil.columnName) && (
                            <DataTableFacetedFilter
                                key={inx}
                                column={table.getColumn(fil.columnName)}
                                title={fil.title}
                                options={fil.options}
                            />
                        )
                    ))
                }
                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                {
                    toogleColumns && (
                        <DataTableViewOptions table={table} />
                    )
                }
                {
                    buttonAdd && (
                        <Button size="sm">{buttonAdd}</Button>
                    )
                }

            </div>
        </div>
    )
}

