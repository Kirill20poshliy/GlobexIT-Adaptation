import { Flex, message, Spin } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useLazyGetSubCollsQuery } from '../../store/api'
import { ListObject } from '../../shared/models'


const List: FC<{subName: string}> = ({subName}) => {

    const [colls, setColls] = useState<ListObject[]>()

    const [fetchData, {isLoading}] = useLazyGetSubCollsQuery()

    useEffect(() => {
        fetchData(subName).then(data => {
            if (data.error) {
                throw new Error('Не удаётся получить информацию. Попробуйте позже!')
            }
            if (data.data) {
                setColls(data.data?.data)
            }
        })
        .catch((e) => {
            message.error(e?.message)
        })
    }, [])


    return (
        <Flex vertical gap={2}>
            {
                isLoading
                ? <Spin/>
                : colls?.length
                    ? colls.map(item => (
                        <div className='flex w-full justify-between'>
                            {item.name}
                            <p className='text-gray-400'>
                                {item.position_name}
                            </p>
                        </div>
                    ))
                    : 'Сотрудники отсутствуют...'
            }
        </Flex>
    )
}


export default List
