import { ReactNode, useCallback, useContext, useMemo } from "react";
import { AlertAction, AlertProps } from "../Alert/Alert";
import { MuiAlertContext } from "../MuiAlertProvider/MuiAlertProvider";
import { processActions } from "./utils";

export interface SimplifiedAlertAction extends Omit<AlertAction, "onClick"> {
    action: () => boolean | void
}

interface MuiAlertHookReturnType {
    showAlert: (message: ReactNode, actions?: SimplifiedAlertAction[], title?: string, configs?: Omit<AlertProps, "title" | "message" | "actions">) => string,
    hideAlert: (id: string) => void
}

export default function useMuiAlert() {
    const context = useContext(MuiAlertContext)

    const showAlert = useCallback(
        (message: ReactNode, actions: SimplifiedAlertAction[] = [], title?: string, configs?: Omit<AlertProps, "message" | "title" | "actions">) => {
            if (context) { // context is defined
                const id = context.generateId()
                const processedActions: AlertAction[] = processActions(id, actions, context.hideAlert)
                return context.showAlert(id, message, title, processedActions, configs)
            }
            return ""
        },
        [context]
    )

    const hookReturn: MuiAlertHookReturnType = useMemo(
        () => ({
            showAlert,
            hideAlert: context ? context.hideAlert : (id: string) => { }
        }),
        [showAlert, context]
    )

    return hookReturn
}