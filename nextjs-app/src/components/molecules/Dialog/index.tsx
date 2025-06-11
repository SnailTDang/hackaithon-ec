import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import type { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'

export type FullScreenDialogProps = {
    openButtonLabel?: string
    dialogTitle?: string
    saveButtonLabel?: string
    onSave?: () => void
    children: React.ReactNode
    appBarSx?: SxProps<Theme>
    open?: boolean
    onOpen?: () => void
    onClose?: () => void
    isFullScreen?: boolean
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})

const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
    dialogTitle = 'Dialog',
    saveButtonLabel = 'save',
    isFullScreen = true,
    onSave,
    children,
    appBarSx = { position: 'fixed', borderRadius: 0 },
    open: controlledOpen,
    onOpen,
    onClose: controlledOnClose,
}) => {
    const [open, setOpen] = React.useState(false)

    const isControlled = controlledOpen !== undefined && controlledOnClose !== undefined
    const actualOpen = isControlled ? controlledOpen : open
    const handleClickOpen = () => {
        if (onOpen) onOpen()
        if (!isControlled) setOpen(true)
    }
    const handleClose = () => {
        if (controlledOnClose) controlledOnClose()
        if (!isControlled) setOpen(false)
    }
    return (
        <React.Fragment>
            <Dialog
                fullScreen={isFullScreen}
                open={actualOpen}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
            >
                <AppBar sx={appBarSx}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="secondary"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {dialogTitle}
                        </Typography>
                        <Button color="secondary" onClick={onSave || handleClose}>
                            {saveButtonLabel}
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{ mt: 8 }}>{children}</Box>
            </Dialog>
        </React.Fragment>
    )
}

export default FullScreenDialog
