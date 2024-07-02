import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../config/global";
import { RespData } from "../config/types";
import convert from 'xml-js'


export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: '', timeout: 3000}),
    tagTypes: ['Subs', 'Colls', 'Comand'],
    endpoints: (builder) => ({
        getSubs: builder.query<RespData, void>({
            query: () => ({
                url: `${BACKEND_URL}&method=getSubs`,
                method: 'GET',
            }),
            transformResponse: (res: RespData): RespData => {
                let data = res.data
                if (data?.length) {
                    for (let i = 0; i < data.length; i++) {
                        let child = []
                        for (let j = 0; j < data.length; j++) {
                            if (data[j].parent_object_id === data[i].id) {
                                child.push(data[j])
                            }
                        }
                        data[i].child = child
                    }
                    data = data.filter(elem => elem.level === 0)
                }
                return {
                    count: Number(res.count),
                    data: data
                }
            },
            providesTags: (result) =>
                result?.data
                  ? [
                      ...result?.data.map(({ id }) => ({ type: 'Subs' as const, id })),
                      { type: 'Subs', id: 'LIST' },
                    ]
                  : [{ type: 'Subs', id: 'LIST' }],
        }),

        getSubColls: builder.query<RespData, string>({
            query: (subName) => ({
                url: `${BACKEND_URL}&method=getSubColls&subdivision=${subName}`,
                method: 'GET',
            }),
            transformResponse: (res: RespData): RespData => {
                return {
                    count: Number(res.count),
                    data: res.data
                }
            }
        }),

        getColls: builder.query<RespData, {page: number, limit: number}>({
            query: ({page, limit}) => ({
                url: `${BACKEND_URL}&method=getColls&page=${page}&limit=${limit}`,
                method: 'GET',
            }),
            transformResponse: (res: RespData): RespData => {
                return {
                    count: Number(res.count),
                    data: res.data
                }
            },
            providesTags: (result) =>
                result?.data
                  ? [
                      ...result?.data.map(({ id }) => ({ type: 'Colls' as const, id })),
                      { type: 'Colls', id: 'LIST' },
                    ]
                  : [{ type: 'Colls', id: 'LIST' }],
        }),

        getComand: builder.query<RespData, void>({
            query: () => ({
                url: `${BACKEND_URL}&method=getComand`,
                method: 'GET',
            }),
            transformResponse: (res: RespData): RespData => {
                return {
                    count: Number(res.count),
                    data: res.data
                }
            },
            providesTags: (result) =>
                result?.data
                  ? [
                      ...result?.data.map(({ id }) => ({ type: 'Comand' as const, id })),
                      { type: 'Comand', id: 'LIST' },
                    ]
                  : [{ type: 'Comand', id: 'LIST' }],
        }),

        addToComand: builder.mutation({
            query: body => ({
                url: `${BACKEND_URL}&method=addToComand`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Colls'],
        }),

        deleteFromComand: builder.mutation({
            query: body => ({
                url: `${BACKEND_URL}&method=deleteFromComand`,
                method: 'DELETE',
                body: body
            }),
            invalidatesTags: ['Comand'],
        }),

        getCollInfo: builder.query<any, number | undefined>({
            query: (id) => ({
                url: `${BACKEND_URL}&method=getCollInfo&coll_id=${id}`,
                method: 'GET',
            }),
            transformResponse: (info: {changes: [], states: []}) => {
                return {
                    changes: info?.changes.map((item: {change: string}) => convert.xml2js(item.change, {compact: true})),
                    states: info?.states.map((item: {history_state: string}) => convert.xml2js(item.history_state, {compact: true}))
                }
            }
        }),

    })
})

export const {
    useLazyGetSubsQuery,
    useLazyGetSubCollsQuery,
    useLazyGetCollsQuery,
    useLazyGetCollInfoQuery,
    useLazyGetComandQuery,
    useAddToComandMutation,
    useDeleteFromComandMutation,
} = api