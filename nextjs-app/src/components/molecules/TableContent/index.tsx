import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { Checkbox, IconButton, TablePagination, TableSortLabel, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTableContent } from './modules/useTableContent'
import { TableContentProps } from './types/index'

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import StatusLabel from './components/StatusLabel'
import { formatDateTime } from '@/shared/utils/formatDatetime'
import { useRouter } from 'next/router'

const TableContent: React.FC<TableContentProps> = ({ contracts, pagination }) => {
    const {
        sortBy,
        sortOrder,
        headCells,
        selected,
        handleSort,
        handleSelectAllClick,
        handleClick,
        handlePageChange,
        handleRowsPerPageChange,
    } = useTableContent(contracts, pagination)

    const numSelected = selected.length
    const rowCount = contracts.length

    const router = useRouter()

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="contract table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="warning"
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={rowCount > 0 && numSelected === rowCount}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                            </TableCell>
                            {headCells.map((headCell) => {
                                return (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.align}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {headCell.isCanSort ? (
                                            <TableSortLabel
                                                active={sortBy === headCell.id}
                                                direction={
                                                    sortBy === headCell.id ? sortOrder : 'asc'
                                                }
                                                onClick={() => handleSort(headCell.id)}
                                            >
                                                {headCell.label}
                                            </TableSortLabel>
                                        ) : (
                                            headCell.label
                                        )}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Không có hợp đồng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contracts.map((contract, idx) => (
                                <TableRow key={contract._id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="warning"
                                            checked={selected.includes(contract._id)}
                                            onChange={(event) => handleClick(event, contract._id)}
                                            inputProps={{
                                                'aria-labelledby': contract._id,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{pagination.startIndex + idx}</TableCell>
                                    <TableCell>{contract.contractName}</TableCell>
                                    <TableCell align="right">
                                        {(contract.file.size / 1024).toFixed(2)} KB
                                    </TableCell>
                                    <TableCell>{contract.file.type}</TableCell>
                                    <TableCell>{formatDateTime(contract.updatedAt)}</TableCell>
                                    <TableCell align="center">
                                        <StatusLabel status={contract.status || 'draft'} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Read results this contract" placement="top">
                                            <IconButton
                                                aria-label="expand row"
                                                size="large"
                                                color="primary"
                                                onClick={() => {
                                                    router.push(`/analyst/${contract._id}`)
                                                }}
                                            >
                                                <RemoveRedEyeOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete this contract" placement="top">
                                            <IconButton
                                                aria-label="expand row"
                                                size="large"
                                                color="error"
                                                onClick={() => {}}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Pagination info */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2,
                    flexDirection: 'column-reverse',
                }}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={pagination.total}
                    rowsPerPage={pagination.limit}
                    page={pagination.page - 1}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Box>
        </Box>
    )
}

export default TableContent
