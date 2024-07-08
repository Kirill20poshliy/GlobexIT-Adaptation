import { FC, useState } from 'react'
import { CardProps, CollChange, CollState } from '../../shared/models'
import CollaboratorInfo from '../CollaboratorInfo/CollaboratorInfo'
import { useLazyGetCollInfoQuery } from '../../store/api'
import { message, Spin } from 'antd'


const Card: FC<CardProps> = ({id, children, title, position_name}) => {


  const [collData, setCollData] = useState<{changes: CollChange[], states: CollState[]}>({changes: [], states: []})
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [fetchData, {isLoading}] = useLazyGetCollInfoQuery()

  const openHandler = () => {
    if (!isOpen) {
      fetchData(id).then((data) => {
        if (data.error) {
          throw new Error('Не удаётся получить информацию. Попробуйте позже!')
        }
        if (data.data) {
            setCollData(data.data)
            setIsOpen(true)
        }
      })
      .catch((e) => {
        message.error(`Ошибка сервера: ${e?.message}`)
      })
    } else {
      setIsOpen(false)
      setCollData({changes: [], states: []})      
    }
  }


  return (
    <div
      className={`border 
              border-gray-200 
              rounded-lg 
              shadow-md              
              text-gray-500
              p-2 
              ${!isOpen && 'hover:bg-gray-100'}`}>
      <div className='flex justify-between items-center pr-4 cursor-pointer'>
        <div className='p-4 grow flex justify-between' onClick={openHandler}>
          {title}
          <p className='text-gray-400'>
            {position_name}
          </p>
        </div>
        {children}
      </div>
      {
        !isOpen 
        ? ''
        : isLoading 
          ? <Spin/>
          : <CollaboratorInfo data={collData}/> 
      }
    </div>
  )
  
}

export default Card
