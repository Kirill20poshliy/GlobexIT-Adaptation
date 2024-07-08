import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import Search from '../Search/Search'
import { Button, Empty, Flex, message, Spin, Tooltip, Tree, TreeProps } from 'antd'
import { deleteCollFromCollList, setCollList, setSearchValue } from '../../store/collSlice'
import { useAddToComandMutation, useLazyGetCollsQuery } from '../../store/api'
import Card from '../Card/Card'
import { FiPlus } from 'react-icons/fi'
import useFilter from '../../hooks/useFilter'
import { ListObject } from '../../shared/models'
import { addCollToComandList } from '../../store/comandSlice'


const CollsList: FC = () => {


    const [page, setPage] = useState<number>(1)
    const [limit] = useState<number>(15)
    const [fetching, setFetching] = useState<boolean>(true)
    const data = useSelector((state: RootState) => state.collList.collList)
    const count = useSelector((state: RootState) => state.collList.count)
    const subData = useSelector((state: RootState) => state.subList.subList)
    const searchValue = useSelector((state: RootState) => state.collList.serachValue)
    const [searchFlag, setSearchFlag] = useState<boolean>(true)
    const [checkedSubs, setCheckedSubs] = useState<React.Key[]>([])
    const dispatch = useDispatch()
    const [fetchData, {isLoading}] = useLazyGetCollsQuery()
    const [addToCommand, result] = useAddToComandMutation()


    useEffect(() => {
        if (fetching) {
            fetchData({page: page, limit: limit}).then((result) => {
                if (result.error) {
                    throw new Error('Не удаётся получить информацию. Попробуйте позже!')
                }
                if (result.data) {
                    dispatch(setCollList({
                        count: result.data.count,
                        data: [
                            ...data,
                            ...result.data.data
                        ]
                    }))
                    setPage(prevState => prevState + 1)
                }
            })
            .catch((e) => {
                message.error(`Ошибка сервера: ${e?.message}`)
            })
            .finally(() => setFetching(false))
        }
    }, [fetching])

    useEffect(() => {
        if (searchValue && searchFlag || checkedSubs.length && searchFlag) {
            fetchData({page: 1, limit: Number(count)})
            .then(result => {
                if (result.error) {
                    throw new Error('Не удаётся получить информацию. Попробуйте позже!')
                }
                if (result.data) {
                    dispatch(setCollList({
                        count: result.data.count,
                        data: result.data.data
                    }))
                    setSearchFlag(false)
                    setPage(Math.ceil(Number(count)/limit) + 1)
                }
            })
            .catch((e) => {
                message.error(`Ошибка сервера: ${e?.message}`)
            })
        }
    }, [searchValue, checkedSubs])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])


    const scrollHandler = () => {
        if (!searchValue && searchFlag) {
            if (document.documentElement.scrollHeight - (document.documentElement.scrollTop + window.innerHeight) < 100 && data.length <= Number(count)) {
                    setFetching(true)
            }
        }
    }

    const addToCommandHandler = (collaborator: ListObject) => {
        addToCommand({id: collaborator.id})
        .then(res =>{
            if (res.error) {
                throw new Error('Не удаётся добавить сотрудника. Попробуйте позже!')
            }
            dispatch(deleteCollFromCollList(collaborator))
            dispatch(addCollToComandList(collaborator))
            message.success('Сотрудник успешно добавлен в команду!')
        })
        .catch(e => {
            message.error(`Ошибка сервера: ${e?.message}`)
        })
    }

    const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
        setCheckedSubs(checkedKeys as React.Key[])
    }

    const checkFilter = (id: string | React.Key | undefined): boolean => {
        if (checkedSubs.length) {
            if (!checkedSubs.find(item => item === id)) {
                return false
            }
        }
        return true
    }

    const setTreeData = (data: ListObject[]): any[] => { 
        return data.map(item => ({
            title: item.name,
            key: item.id,
            children: item.child?.length ? setTreeData(item.child) : []
        }))
    }



 
    return (

        <section className='p-4 flex flex-col gap-4 text-gray-600'>
            <Search searchPlaceholder='Искать сотрудников...' setSearchValue={setSearchValue}/>
            <hr></hr>
            <Tree
                checkable
                onCheck={onCheck}
                treeData={setTreeData(subData)}/>
            <hr></hr>
            <Flex gap={8} vertical>
                {
                    isLoading
                    ? <Spin/>
                    : !data.length
                        ? <Empty description='Список пуст.'/>
                        : data
                            .filter(item => useFilter(item, searchValue))
                            .filter(item => checkFilter(item?.position_parent_id))
                            .map(item => (
                            <Card 
                                key={item?.id}
                                id={item?.id}
                                title={item?.name}
                                position_name={item?.position_name}>
                                <Tooltip placement="right" title='Добавить пользователя в команду'>
                                    <Button 
                                        onClick={() => addToCommandHandler(item)}
                                        type='primary'
                                        ghost>
                                        <FiPlus/>
                                    </Button>
                                </Tooltip>
                            </Card>
                        ))
                }
            </Flex>
            <Spin spinning={result.isLoading} fullscreen />
        </section>

    )
}

export default CollsList