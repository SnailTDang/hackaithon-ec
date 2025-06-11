import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Checkbox, TablePagination } from '@mui/material'
import { useTableContent } from './modules/useTableContent'
import { TableContentProps } from './types/index'

const TableContent: React.FC<TableContentProps> = ({ contracts, pagination }) => {
    const {
        headCells,
        selected,
        handleSelectAllClick,
        handleClick,
        handlePageChange,
        handleRowsPerPageChange,
    } = useTableContent(contracts, pagination)

    const numSelected = selected.length
    const rowCount = contracts.length

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
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
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
                                <TableRow
                                    key={contract._id}
                                    hover
                                    onClick={(event) => handleClick(event, contract._id)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="warning"
                                            checked={selected.includes(contract._id)}
                                            inputProps={{
                                                'aria-labelledby': contract._id,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{pagination.startIndex + idx}</TableCell>
                                    <TableCell>{contract.contractName}</TableCell>
                                    <TableCell>
                                        {new Date(contract.createdAt).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}{' '}
                                        {new Date(contract.createdAt).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>{contract.file.type}</TableCell>
                                    <TableCell>{contract.file.originalname}</TableCell>
                                    <TableCell align="right">
                                        {(contract.file.size / 1024).toFixed(2)} KB
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
