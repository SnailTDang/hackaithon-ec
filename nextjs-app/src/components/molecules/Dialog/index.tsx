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
import { DialogContent, DialogTitle, type SxProps, type Theme } from '@mui/material'
import Box from '@mui/material/Box'

export type CommonDialogProps = {
    openButtonLabel?: string
    dialogTitle?: string
    saveButtonLabel?: string
    onSave?: () => void
    children: React.ReactNode
    headerSx?: SxProps<Theme>
    open?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
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

const CommonDialog: React.FC<CommonDialogProps> = ({
    dialogTitle = 'Dialog',
    saveButtonLabel = 'SAVE',
    isFullScreen,
    children,
    headerSx,
    size = 'lg',
    open: controlledOpen,
    onClose: controlledOnClose,
    onSave,
}) => {
    const [open, setOpen] = React.useState(false)

    const isControlled = controlledOpen !== undefined && controlledOnClose !== undefined
    const actualOpen = isControlled ? controlledOpen : open
    const handleClose = () => {
        if (controlledOnClose) controlledOnClose()
        if (!isControlled) setOpen(false)
    }
    return (
        <React.Fragment>
            <Dialog
                scroll="paper"
                fullWidth={true}
                maxWidth={size}
                fullScreen={isFullScreen}
                open={actualOpen}
                onClose={handleClose}
                slots={{
                    transition: Transition,
                }}
            >
                <DialogTitle
                    sx={{
                        ...headerSx,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        p: 0,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="secondary"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                            {dialogTitle}
                        </Typography>
                        <Button size="large" color="secondary" onClick={onSave || handleClose}>
                            {saveButtonLabel}
                        </Button>
                    </Toolbar>
                </DialogTitle>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default CommonDialog
