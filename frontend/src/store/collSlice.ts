import { createSlice } from '@reduxjs/toolkit'
import { ListObject, RespData } from '../shared/models'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface CollState {
    count: number | string,
    collList: ListObject[],
    serachValue: string,
}

const initialState: CollState = {
    count: 0,
    collList: [],
    serachValue: ''
}

export const collSlice = createSlice({
    name: 'collList',
    initialState,
    reducers: {

        setCollList(state, action: PayloadAction<RespData | undefined>) {
            if (action.payload) {
                state.count = action.payload.count
                state.collList = action.payload.data
            }
        },

        addCollToCollList(state, action) {
            const newList = [
                ...state.collList,
                action.payload
            ]
            state.collList = newList.sort((a: ListObject, b: ListObject) => {
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

        deleteCollFromCollList(state, action) {
            state.collList = state.collList.filter(item => item.id !== action.payload.id)
        },

        setSearchValue(state, action: PayloadAction<string>) {
            state.serachValue = action.payload
        },

    },
})


export const { 
    setCollList,
    addCollToCollList,
    deleteCollFromCollList,
    setSearchValue,  
} = collSlice.actions

export default collSlice.reducer