import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Contract, HeadCell, PaginationMeta } from '../../types'
import { useSearchParams } from 'next/navigation'

const headCells: HeadCell[] = [
    { id: 'index', numeric: false, disablePadding: false, label: '#', align: 'center' },
    {
        id: 'contractName',
        numeric: false,
        disablePadding: false,
        label: 'Contract Name',
        align: 'left',
        isCanSort: true,
    },
    {
        id: 'fileSize',
        numeric: true,
        disablePadding: false,
        label: 'File size',
        align: 'right',
        isCanSort: true,
    },
    { id: 'type', numeric: false, disablePadding: false, label: 'File type', align: 'left' },
    {
        id: 'updatedAt',
        numeric: false,
        disablePadding: false,
        label: 'Updated at',
        align: 'left',
        isCanSort: true,
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
        align: 'center',
        isCanSort: true,
    },
    {
        id: 'originalName',
        numeric: false,
        disablePadding: false,
        label: 'Feature',
        align: 'center',
    },
]

export function useTableContent(contracts: Contract[], pagination: PaginationMeta) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selected, setSelected] = useState<readonly string[]>([])
    const [sortBy, setSortBy] = useState<string>('createdAt')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [filter, setFilter] = useState<string>('')

    // Helper to get current query as object
    const getQueryObject = () => {
        const params: Record<string, string> = {}
        searchParams?.forEach((value, key) => {
            params[key] = value
        })
        return params
    }

    const handleSort = (column: string) => {
        let order: 'asc' | 'desc' = 'asc'
        if (sortBy === column) {
            order = sortOrder === 'asc' ? 'desc' : 'asc'
        }
        setSortBy(column)
        setSortOrder(order)
        const query = getQueryObject()
        query['sortBy'] = column
        query['sortOrder'] = order
        query['page'] = '1'
        if (filter) query['contractName'] = filter
        router.push({ pathname: '', query })
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value)
    }

    const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const query = getQueryObject()
        query['contractName'] = filter
        query['page'] = '1'
        query['sortBy'] = sortBy
        query['sortOrder'] = sortOrder
        router.push({ pathname: '', query })
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = contracts.map((n) => n._id)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.ChangeEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: readonly string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }
        setSelected(newSelected)
    }

    const handlePageChange = (_: unknown, newPage: number) => {
        const query = getQueryObject()
        query['page'] = (newPage + 1).toString()
        query['limit'] = pagination.limit.toString()
        router.push({ pathname: '', query })
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLimit = parseInt(event.target.value, 10)
        const query = getQueryObject()
        query['limit'] = newLimit.toString()
        query['page'] = '1'
        router.push({ pathname: '', query })
    }

    return {
        selected,
        headCells,
        pagination,
        contracts,
        setHeadCells: (newHeadCells: HeadCell[]) => {
            headCells.splice(0, headCells.length, ...newHeadCells)
        },
        setSelected,
        handleSelectAllClick,
        handleClick,
        handlePageChange,
        handleRowsPerPageChange,
        sortBy,
        sortOrder,
        filter,
        handleSort,
        handleFilterChange,
        handleFilterSubmit,
    }
}
