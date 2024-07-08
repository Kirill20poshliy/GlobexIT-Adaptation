import { UnknownAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export interface FCWithChildren {
    children?: ReactNode
}

export interface ListObject {
    level?: number;
    child?: ListObject[];
    parent_object_id?: number;
    id?: number,       
    name?: string,   
    position_name?: string,  
    org_name?: string,  
    position_parent_id?: string | React.Key,
}

export interface RespData {
    count: number | string,
    data: ListObject[]
}

export interface CardProps extends ListObject {
    key?: React.Key,
    title?: string,
    children?: ReactNode,
    position_name?: string,
}

export interface SearchInput {
    searchPlaceholder: string,
    setSearchValue: (searchValue: string) => UnknownAction
}

export interface CollChange {
    change_log: {
        date: {_text: string},
        org_name: {_text: string},
        position_name: {_text: string},
        position_parent_name: {_text: string},
    }
}

export interface CollState {
    history_state: {
        start_date: {_text: string},
        finish_date: {_text: string},
    }
}
