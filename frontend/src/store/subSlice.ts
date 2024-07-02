import { createSlice } from '@reduxjs/toolkit'
import { ListObject, RespData } from '../config/types'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface SubsState {
    count: number | string,
    subList: ListObject[],
    serachValue: string,
}

const initialState: SubsState = {
    count: 0,
    subList: [],
    serachValue: ''
}

export const subSlice = createSlice({
    name: 'subList',
    initialState,
    reducers: {

        setSubList(state, action: PayloadAction<RespData | undefined>) {
            if (action.payload) {
                state.count = action.payload.count
                state.subList = action.payload.data
            }

        },

        setSearchValue(state, action: PayloadAction<string>) {
            state.serachValue = action.payload
        }

    },
})


export const { 
    setSubList,
    setSearchValue,  
} = subSlice.actions

export default subSlice.reducer