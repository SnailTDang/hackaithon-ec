import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Contract, HeadCell, PaginationMeta } from '../../types'
// import { Contract, PaginationMeta } from './index'

const headCells: HeadCell[] = [
    { id: 'index', numeric: false, disablePadding: false, label: '#' },
    { id: 'contractName', numeric: false, disablePadding: false, label: 'Tên hợp đồng' },
    { id: 'createdAt', numeric: false, disablePadding: false, label: 'Ngày tạo' },
    { id: 'type', numeric: false, disablePadding: false, label: 'Loại file' },
    { id: 'originalname', numeric: false, disablePadding: false, label: 'Tên file gốc' },
    { id: 'size', numeric: true, disablePadding: false, label: 'Dung lượng' },
]

export function useTableContent(contracts: Contract[], pagination: PaginationMeta) {
    const router = useRouter()
    const [selected, setSelected] = useState<readonly string[]>([])

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = contracts.map((n) => n._id)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
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
        const params = new URLSearchParams(window.location.search)
        params.set('page', (newPage + 1).toString())
        params.set('limit', pagination.limit.toString())
        router.push(`?${params.toString()}`)
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLimit = parseInt(event.target.value, 10)
        const params = new URLSearchParams(window.location.search)
        params.set('limit', newLimit.toString())
        params.set('page', '1')
        router.push(`?${params.toString()}`)
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
    }
}
