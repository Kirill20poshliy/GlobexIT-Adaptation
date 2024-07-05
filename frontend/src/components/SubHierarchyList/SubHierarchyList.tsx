import { FC, useEffect } from 'react'
import { Flex, message, Spin } from 'antd';
import Search from '../Search/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setSubList, setSearchValue } from '../../store/subSlice';
import { RootState } from '../../store';
import { useLazyGetSubsQuery } from '../../store/api';
import HierarchyCollapse from '../HierarchyCollapse/HierarchyCollapse';


const SubHierarchyList: FC = () => {


    const data = useSelector((state: RootState) => state.subList.subList)
    const searchValue = useSelector((state: RootState) => state.subList.serachValue)
    const dispatch = useDispatch()
    const [fetchData, {isLoading}] = useLazyGetSubsQuery()


    useEffect(() => {
        fetchData().then((data) => {
            if (data.error) {
                throw new Error('Не удаётся получить информацию. Попробуйте позже!')
            }
            if (data.data) {
                dispatch(setSubList(data.data))
            }
        })
        .catch((e) => {
            message.error(`Ошибка сервера: ${e?.message}`)
        })
    }, [])


    return (
        <section className='p-4 flex flex-col gap-4 text-gray-600'>
            <Search searchPlaceholder='Искать подразделение...' setSearchValue={setSearchValue}/>
            <hr></hr>
            <Flex gap={8} vertical>
                {
                    isLoading
                    ? <Spin/>
                    : <HierarchyCollapse data={data} searchValue={searchValue}/>
                }
            </Flex>
        </section>
    )

}


export default SubHierarchyList
