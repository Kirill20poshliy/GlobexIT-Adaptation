import { FC, useEffect, useState } from 'react'
import SubCard from './SubCard'
import { BACKEND_URL } from '../config/global'
import { SubObj } from '../config/types'
import { useFetch } from '../hooks/useFetch'


const SubList: FC = () => {


    const [searchValue, setSearchValue] = useState<string>('')
    const [subList, setSublist] = useState<SubObj[]>([])


    useEffect(() => {

        const formData = new FormData()
        formData.append('method', 'getSubs')

        useFetch(BACKEND_URL, {
            timeout: 3000,
            method: 'POST',
            body: formData,
        })
        .then(data => {
            setSublist(data.filter((sub: SubObj) => sub.name.toLowerCase().includes(searchValue.toLowerCase(), 0)))
        })

    }, [searchValue])

    return (
        <section className='border-gray-400 p-4 border flex flex-col gap-4 rounded-xl'>
            <input 
                name='search' 
                type='text' 
                placeholder='Искать подразделение...'
                autoComplete='off'
                value={searchValue}
                onChange={(e) => setSearchValue(e.currentTarget.value)}
                className='outline-none border border-gray-400 rounded-[.25rem] px-2 py-1 focus:border-gray-500'/>
            <hr></hr>
            {
                subList.length 
                    ? subList.map(sub => <SubCard key={sub.id} id={sub.id} name={sub.name}/>)
                    : 'Загрузка...'
            }
        </section>
    )
}

export default SubList
