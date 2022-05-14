import { Portal } from '@mui/material'
import { useMemo } from '@storybook/addons'
import React, { createContext, ReactElement, ReactNode, useCallback, useState } from 'react'
import { Alert } from '..'
import { AlertAction, AlertProps } from '../Alert/Alert'

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

    const hideAlert = useCallback(
        (id: string) => {
            setAlerts(
                alerts => {
                    const index = alerts.findIndex(ao => ao.id === id)
                    if (index > -1) {
                        const newAlerts = [...alerts]
                        newAlerts[index].props.open = false
                        return newAlerts
                    }
                    return alerts
                }
            )
        },
        []
    )

    const showAlert = useCallback(
        (id:string, message: ReactNode, title?: string, actions: AlertAction[] = [], configs: Omit<AlertProps, "message" | "title" | "actions"> = { open: true }) => {
            const props: AlertProps = {
                ...configs,
                message,
                title,
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
        []
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