import { AlertAction } from "../Alert/Alert";
import { SimplifiedAlertAction } from "./useMuiAlert";

export function processActions(id: string, actions: SimplifiedAlertAction[], hideAlert: (id: string) => void): AlertAction[] {
    if (actions.length > 0) {
        return actions.map(
            ({ action, ...restProps }) => ({
                ...restProps,
                onClick: () => {
                    if (action() !== false) {
                        hideAlert(id)
                    }
                }
            })
        )
    }
    return [{
        label: "OK",
        onClick: () => {
            hideAlert(id)
        }
    }]
}