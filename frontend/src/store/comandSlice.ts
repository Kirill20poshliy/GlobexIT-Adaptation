import { createSlice } from '@reduxjs/toolkit'
import { ListObject, RespData } from '../config/types'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface ComandState {
    count: number | string,
    comandList: ListObject[],
    serachValue: string,
}

const initialState: ComandState = {
    count: 0,
    comandList: [],
    serachValue: ''
}

export const comandSlice = createSlice({
    name: 'collList',
    initialState,
    reducers: {

        setComandList(state, action: PayloadAction<RespData | undefined>) {
            if (action.payload) {
                state.count = action.payload.count
                state.comandList = action.payload.data
            }
        },

        addCollToComandList(state, action) {
            const newList = [
                ...state.comandList,
                action.payload
            ]
            state.comandList = newList.sort((a: ListObject, b: ListObject) => {
                if (a.name && b.name) {
                    if (a?.name > b?.name) {
                        return 1;
                    }
                    if (a?.name < b?.name) {
                        return -1;
                    }
                    return 0;
                } else {
                    return 0
                }
            })
        },

        deleteCollFromComandList(state, action) {
            state.comandList = state.comandList.filter(item => item.id !== action.payload.id)
        },

        setSearchValue(state, action: PayloadAction<string>) {
            state.serachValue = action.payload
        },

    },
})


export const { 
    setComandList,
    addCollToComandList,
    deleteCollFromComandList,
    setSearchValue,  
} = comandSlice.actions

export default comandSlice.reducer