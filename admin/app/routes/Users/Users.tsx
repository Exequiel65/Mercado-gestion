import { DataTable } from '~/components/Customs/table/data-table'
import { columns } from '~/routes/Users/table/columns'
import { filters } from './table/configTable'
import { get } from '~/services/apiService';
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '~/store/auth-store';
import { type user } from './table/schema';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import { useNavigate } from 'react-router';


interface IPagination {
  totalCount: number,
  pageSize: number,
  pageNumber: number,
  items: user[]
}

export function meta(){
  return [
    {title: "Usuarios del sistema"}
  ]
}

export default function UsersPage() {
  const token = useAuthStore(s => s.token)
  const navigate = useNavigate();
  const [users, setUsers] = useState<IPagination>({
    items: [],
    pageNumber: 1,
    pageSize: 25,
    totalCount: 0
  })
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const getListUsers = useCallback(async () => {
    const filters = Object.fromEntries(
      columnFilters.map(f => [f.id, f.value])
    )

    const params = new URLSearchParams({
      skip: String(pagination.pageIndex * pagination.pageSize),
      limit: String(pagination.pageSize),
      sortBy: sorting[0]?.id ?? "",
      sortOrder: sorting[0]?.desc ? "desc" : "asc",
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value != null ? String(value) : ""])
      ),
    })

    const queryString = params.toString()
    const data = await get<IPagination>({
      path: `user/list?${queryString}`,
      token,
    })

    if (data.success) {
      setUsers(data.data)
      setTotalCount(data.data.totalCount)
    }
  }, [token, pagination, sorting, columnFilters])

  useEffect(() => {
    getListUsers()
  }, [getListUsers])


  return (
  <div className="flex flex-col gap-4 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground text-sm">Gestioná los usuarios de tu organización.</p>
      </div>
      <div>
        <Button onClick={() => navigate("/admin/user/new")}>
          Crear Usuario
        </Button>
      </div>
      {/* Botón para crear usuario (opcional) */}
      {/* <Button variant="default" size="sm">Nuevo usuario</Button> */}
    </div>

    <div className="rounded-2xl border bg-background p-4 shadow-sm">
      <DataTable
        columns={columns}
        data={users.items}
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
