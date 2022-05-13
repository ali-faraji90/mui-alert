import React, { createContext, ReactNode, ReactElement } from 'react'
import { AlertProps } from './components/Alert/Alert'

interface MuiAlertContextValue {
    showAlert: (message: ReactNode, title?: string, configs?: AlertProps) => string,
    hideAlert: (key: string) => void,
}

interface MuiAlertProviderProps {
    children: ReactElement | null,
}

export const MuiAlertContext = createContext<null | MuiAlertContextValue>(null)


function MuiAlertProvider({ children }: MuiAlertProviderProps) {
    const contextValue: MuiAlertContextValue = {
        showAlert: (message, title, configs) => "",
        hideAlert: (key) => {},
    }

    return (
        <MuiAlertContext.Provider value={contextValue}>
            {children}
        </MuiAlertContext.Provider>
    )
}

export default MuiAlertProvider