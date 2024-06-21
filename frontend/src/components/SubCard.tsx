import { FC, useState } from 'react'
import { CollObj, SubObjCard } from '../config/types'
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useFetch } from '../hooks/useFetch';
import { BACKEND_URL } from '../config/global';


const SubCard: FC<SubObjCard> = ({name}) => {


  const [open, setOpen] = useState<boolean>(false)
  const [collsList, setCollsList] = useState<CollObj[]>([])


  const openHandler = (): void => {
    if (!open) {
      const formData = new FormData()
      formData.append('method', 'getColls')
      formData.append('subdivision', `${name}`)

      useFetch(BACKEND_URL, {
        timeout: 3000,
        method: 'POST',
        body: formData,
      })
      .then(data => {
        setCollsList(data)
        setOpen(true)
      })
    } else {
      setOpen(false)
      setCollsList([])
    }
  }

  return (

    <div
      className='border 
              border-gray-200 
              rounded-lg 
              shadow-md 
              hover:bg-gray-100 
              text-gray-500 
              flex 
              flex-col
              overflow-hidden'>
      <div
        className='flex justify-between p-2 cursor-pointer items-center' 
        onClick={openHandler}>
        {name}
        {
          open
          ? <FiChevronDown />
          : <FiChevronUp />
        }
        
      </div>
      <div className={`bg-white flex-col px-4 ${open ? 'flex' : 'hidden'}`}>
        {
          collsList.length
          ? collsList.map(coll => (
              <p className='p-2 border-b last:border-0 border-gray-200' key={coll.id}>{coll.fullname}</p>
            ))
          : 'Список сотрудников пуст.'
        }
      </div>
    </div>

  )

}

export default SubCard
