import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material'
import React, { ReactNode } from 'react'

interface AlertProps extends DialogProps {
    title?: string,
    message: ReactNode | ReactNode[],
    actions: (Omit<ButtonProps, "children"> & { label: string })[]
}

function Alert({ title, message, actions = [{ label: "OK" }], ...dialogProps }: AlertProps) {
    return (
        <Dialog {...dialogProps}>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>
                {typeof message === "string" ?
                    <DialogContentText>{message}</DialogContentText>
                    :
                    message
                }
            </DialogContent>
            <DialogActions>
                {actions.map(
                    ({ label, ...action }, index) => (
                        <Button {...action} key={index}>
                            {label}
                        </Button>
                    )
                )}
            </DialogActions>
        </Dialog>
    )
}

export default Alert