import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import Search from '../Search/Search'
import { Button, Empty, Flex, message, Popconfirm, Spin, Tooltip, Tree, TreeProps } from 'antd'
import { deleteCollFromComandList, setComandList, setSearchValue } from '../../store/comandSlice'
import { useDeleteFromComandMutation, useLazyGetComandQuery } from '../../store/api'
import Card from '../Card/Card'
import { FiX } from "react-icons/fi";
import useFilter from '../../hooks/useFilter'
import { ListObject } from '../../shared/models'
import { addCollToCollList } from '../../store/collSlice'


const ComandList: FC = () => {


    const data = useSelector((state: RootState) => state.comandList.comandList)
    const searchValue = useSelector((state: RootState) => state.comandList.serachValue)
    const dispatch = useDispatch()
    const subData = useSelector((state: RootState) => state.subList.subList)
    const [checkedSubs, setCheckedSubs] = useState<React.Key[]>([])
    const [fetchData, {isLoading}] = useLazyGetComandQuery()
    const [deleteUser, result] = useDeleteFromComandMutation()


    const deleteFromCommandHandler = (collaborator: ListObject) => {
        deleteUser({id: collaborator.id})
        .then(res =>{
            if (res.error) {
                throw new Error('Не удаётся удалить сотрудника. Попробуйте позже!')
            }
            dispatch(deleteCollFromComandList(collaborator))
            dispatch(addCollToCollList(collaborator))
            message.success('Сотрудник успешно удалён из команды!')
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

    useEffect(() => {
        fetchData().then((result) => {
            if (result.error) {
                throw new Error('Не удаётся получить информацию. Попробуйте позже!')
            }
            if (result.data) {
                dispatch(setComandList(result.data))
            }
        })
        .catch((e) => {
            message.error(`Ошибка сервера: ${e?.message}`)
        })
    }, [])

 
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
                                <Tooltip placement="right" title='Удалить сотрудника из команды'>
                                    <Popconfirm
                                        placement="topLeft"
                                        title={'Удалить из команды'}
                                        description={'Вы действительно хотите удалить сотрудника из команды?'}
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={() => deleteFromCommandHandler(item)}>
                                        <Button 
                                            type='primary'
                                            danger
                                            ghost>
                                            <FiX />
                                        </Button>
                                    </Popconfirm>
                                </Tooltip>
                            </Card>
                        ))
                }
            </Flex>
            <Spin spinning={result.isLoading} fullscreen />
        </section>

    )
}

export default ComandList