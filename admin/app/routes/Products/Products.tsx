import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { DataTable } from '~/components/Customs/table/data-table';
import { Button } from '~/components/ui/button'
import { columns } from './table/columns';
import { filters } from './table/configTable';
import type { ProductSimple } from './table/schema';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { post } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store';

interface IPagination {
    totalCount: number,
    pageSize: number,
    pageNumber: number,
    items: ProductSimple[]
}
interface IProductPostData {
    name: string | null;
    isActive: boolean | null;
    isDeleted: boolean | null;
    limit: number | null;
    skip: number | null;
    sortByColumn: string | null;
    sortDirection: string | null;
    categoryId: number[] | null;
    subCategoryId: number | null;
    childCategoryId: number | null;
    isFeatured: boolean | null;
    isSoldOut: boolean | null;
    hasDiscount: boolean | null;
    amountDiscount: number | null;
}

export function meta(){
  return [
    {title: "Tus Productos"}
  ]
}


export default function Products() {
    const token = useAuthStore(s => s.token)
    const navigate = useNavigate();
    const [Products, setProduct] = useState<IPagination>({
        items: [],
        pageNumber: 1,
        pageSize: 25,
        totalCount: 0
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [totalCount, setTotalCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [sorting, setSorting] = useState<SortingState>([])

    const getProducts = useCallback(async () => {
        const filters = Object.fromEntries(
            columnFilters.map(f => [f.id, f.value])
        )
        const dataFilter: IProductPostData =
        {
            name: null,
            isActive: null,
            isDeleted: null,
            limit: pagination.pageSize,
            skip: pagination.pageIndex * pagination.pageSize,
            sortByColumn: sorting[0]?.id ?? null,
            sortDirection: null,
            categoryId: [],
            subCategoryId: null,
            childCategoryId: null,
            isFeatured: null,
            isSoldOut: null,
            hasDiscount: null,
            amountDiscount: null
        }
        Object.entries(filters).forEach(([key, value]) => {
            if (value != null) {
                if (key === "categoryId") {
                    dataFilter.categoryId = Array.isArray(value) ? value : [value];
                } else if (key === "subCategoryId") {
                    dataFilter.subCategoryId = Number(value);
                } else if (key === "childCategoryId") {
                    dataFilter.childCategoryId = Number(value);
                } else if (key === "tags") {
                    if (Array.isArray(value) || typeof value === "string") {
                        if (value.includes("hasDiscount")) {
                            dataFilter.hasDiscount = true;
                        }
                        if (value.includes("isSoldOut")) {
                            dataFilter.isSoldOut = true;
                        }
                        if (value.includes("isFeatured")) {
                            dataFilter.isFeatured = true;
                        }
                    }
                } else if (key === "status") {
                    if (Array.isArray(value)) {
                        dataFilter.isActive = value.includes("active") ? true : null;
                        dataFilter.isDeleted = value.includes("isDeleted") ? true : null;
                    } else if (value === "active") {
                        dataFilter.isActive = true;
                    } else if (value === "isDeleted") {
                        dataFilter.isDeleted = true;
                    }
                } else {
                    (dataFilter as any)[key] = value;
                }
            }
        });
        const data = await post<any, IPagination>({ path: `product/all`, data: dataFilter, token })

        if (data.success) {
            setProduct(data.data)
            setTotalCount(data.data.totalCount)
        }
    }, [token, pagination, sorting, columnFilters])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
                    <p className="text-muted-foreground text-sm">Gestioná tus productos.</p>
                </div>
                <div>
                    <Button onClick={() => navigate("/admin/products/add")} variant="default" size="sm">
                        Crear Producto
                    </Button>
                </div>
                {/* Botón para crear usuario (opcional) */}
                {/* <Button variant="default" size="sm">Nuevo usuario</Button> */}
            </div>

            <div className="rounded-2xl border bg-background p-4 shadow-sm">
                <DataTable
                    columns={columns}
                    data={Products.items}
                    filters={filters}
                    search={{ columnName: "name", placeHolder: "Buscar por usuario..." }}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    pageCount={Math.ceil(totalCount / pagination.pageSize)}
                    pagination={pagination}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                />
            </div>

        </div>
    )
}
