import { Portal } from '@mui/material'
import React, { createContext, ReactElement, ReactNode, useCallback, useMemo, useState } from 'react'
import Alert, { AlertAction, AlertProps } from '../Alert/Alert'

interface MuiAlertContextValue {
    generateId: () => string,
    showAlert: (id: string, message: ReactNode, title?: string, actions?: AlertAction[], configs?: Omit<AlertProps, "message" | "title" | "actions">) => string,
    hideAlert: (id: string) => void,
}

interface MuiAlertProviderProps {
    children: ReactElement | null,
}

interface AlertObjectProps {
    id: string,
    props: AlertProps,
}

export const MuiAlertContext = createContext<null | MuiAlertContextValue>(null)

function generateId() {
    return (Math.random() + 1).toString(36).substring(2)
}

function MuiAlertProvider({ children }: MuiAlertProviderProps) {
    const [alerts, setAlerts] = useState<AlertObjectProps[]>([])

    const cleanUp = useCallback(
        () => setAlerts(alerts => alerts.filter(a => a.props.open)),
        []
    )

    const hideAlert = useCallback(
        (id: string) => {
            setAlerts(
                alerts => {
                    const index = alerts.findIndex(ao => ao.id === id)
                    if (index > -1) {
                        const newAlerts = [...alerts]
                        newAlerts[index].props.open = false
                        return newAlerts
                    } else {
                        console.warn(`The alert id is invalid (${id}).`)
                    }
                    return alerts
                }
            )
        },
        []
    )

    const showAlert = useCallback(
        (id: string, message: ReactNode, title?: string, actions: AlertAction[] = [], configs: Omit<AlertProps, "open" | "message" | "title" | "actions"> = { }) => {
            const props: AlertProps = {
                ...configs,
                open: true,
                message,
                title,
                TransitionProps: {
                    ...configs.TransitionProps,
                    onExited: (node) => {
                        configs.TransitionProps?.onExited?.(node)
                        cleanUp()
                    }
                },
                actions: actions ?? [],
            }
            setAlerts(
                alerts => [
                    ...alerts,
                    {
                        id,
                        props,
                    }
                ]
            )
            return id
        },
        [cleanUp]
    )

    const contextValue: MuiAlertContextValue = useMemo(
        () => ({
            generateId,
            showAlert,
            hideAlert,
        }),
        [hideAlert, showAlert]
    )

    return (
        <MuiAlertContext.Provider value={contextValue}>
            {children}
            <Portal>
                {alerts.map(
                    ({ props }, index) => (
                        <Alert
                            {...props}
                            key={`muia-${index}`}
                        />
                    )
                )}
            </Portal>
        </MuiAlertContext.Provider>
    )
}

export default MuiAlertProvider