import * as React from 'react'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { FC } from 'react'
import { Box } from '@mui/material'

type FileData = {
    id: string
    name: string
    type: string
    size: number
    uploadDate: string
}

type FileTableBodyProps = {
    visibleRows: FileData[]
    selected: readonly string[]
    handleClick: (event: React.MouseEvent<unknown>, id: string) => void
}

const FileTableBody: FC<FileTableBodyProps> = ({ visibleRows, selected, handleClick }) => (
    <TableBody>
        {visibleRows.map((row, index) => {
            const isItemSelected = selected.includes(row.id)
            const labelId = `enhanced-table-checkbox-${index}`
            return (
                <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell align="right">{(row.size / 1024).toFixed(2)}</TableCell>
                    <TableCell>{row.uploadDate}</TableCell>
                    <TableCell>
                        <Box display="flex" gap={1}>
                            <Button size="small" color="primary">
                                Download
                            </Button>
                            <Button size="small" color="error">
                                Delete
                            </Button>
                        </Box>
                    </TableCell>
                </TableRow>
            )
        })}
    </TableBody>
)

export default FileTableBody
