import { FC } from 'react'
import { Collapse, Empty, Flex } from 'antd';
import useFilter from '../../hooks/useFilter';
import { ListObject } from '../../shared/models';
import SubCollsList from '../SubCollsList/SubCollsList';


const HierarchyList: FC<{data: ListObject[], searchValue: string}> = ({data, searchValue}) => {


    return (
        <>
            {
                data.length
                ? data
                    .filter(item => useFilter(item, searchValue), 0)
                    .map(item => (
                        <Collapse
                            items={[
                                {
                                    key: item?.id,
                                    label: item?.name,
                                    children: <Flex vertical gap={8}>
                                        {
                                            item.name 
                                            && (
                                                <div className='flex flex-col gap-2'>
                                                    <p className='font-semibold'>Сотрудники:</p>
                                                    <div className='pl-4'>
                                                        <SubCollsList subName={item.name}/>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            item.child?.length 
                                            ? (<>
                                                    <p className='font-semibold'>Дочерние подразделения:</p>
                                                    <HierarchyList data={item.child} searchValue=''/>
                                                </>)
                                            : ''
                                        }
                                    </Flex> 
                                }
                            ]}/>
                    ))
                : <Empty description='Список пуст.'/>
            }
        </>
    )
}

export default HierarchyList
