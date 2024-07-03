declare global {
    interface Window {
        _app: {
            backendID: string;
            appPath: string;
            baseServerPath: string;
        }
    }
}

export const backendID = '7382188145038739275'
export const BACKEND_URL = `/custom_web_template.html?object_id=${backendID}`