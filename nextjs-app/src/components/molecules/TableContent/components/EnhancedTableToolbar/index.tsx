import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { alpha } from '@mui/material/styles'
import { FC } from 'react'
import Box from '@mui/material/Box'

type EnhancedTableToolbarProps = {
    numSelected: number
}

const EnhancedTableToolbar: FC<EnhancedTableToolbarProps> = ({ numSelected }) => (
    <Toolbar
        sx={[
            { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
            numSelected > 0 && {
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            },
        ]}
    >
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Uploaded Files
                </Typography>
            )}
            <Box>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    </Toolbar>
)

export default EnhancedTableToolbar
