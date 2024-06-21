export interface FetchOptions {
    timeout: number,
    body: FormData,
    method: string,
}

export interface SubObj {
    name: string,
    id: React.Key,
}

export interface CollObj {
    id: React.Key,
    fullname: string,
    position_parent_name: string,
}

export interface SubObjCard extends SubObj {
    key: React.Key,
}