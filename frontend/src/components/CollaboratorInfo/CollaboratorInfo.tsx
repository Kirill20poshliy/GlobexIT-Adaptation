import { FC } from 'react'
import { CollChange, CollState } from '../../shared/models'
import dayjs from 'dayjs'


const CollaboratorInfo: FC<{data: {changes: CollChange[], states: CollState[]}}> = ({data}) => {


  const convertDate = (date: string): string => {
    return dayjs(date).format('DD.MM.YYYY HH:mm:ss')
  }


  return (
    <div className='flex-col gap-4 p-4 flex'>  
        <hr></hr>    
        <div className='flex flex-col p-2'>
          <p className='self-end'>История изменений</p>
          <table>
            <thead className='bg-gray-100 >& text-left'>
              <th className='border p-2 w-[40px] text-center'>№</th>
              <th className='border p-2'>Дата</th>
              <th className='border p-2'>Организация</th>
              <th className='border p-2'>Должность</th>
              <th className='border p-2'>Подразделение</th>
            </thead>
            {
              data.changes.length 
              ? data.changes.map((item, index) => (
                <tr>
                  <td className='border p-2 text-center'>{index + 1}</td>
                  <td className='border p-2'>{convertDate(item.change_log.date._text)}</td>
                  <td className='border p-2'>{item.change_log.org_name._text}</td>
                  <td className='border p-2'>{item.change_log.position_name._text}</td>
                  <td className='border p-2'>{item.change_log.position_parent_name._text}</td>
                </tr>
              ))
              : 'История изменений остутствует.'
            }
          </table>
        </div>
        <div className='flex flex-col p-2'>
          {
            data.states.length
            ? (<><p className='self-end'>История состояний</p>
              <table>
                <thead className='bg-gray-100 >& text-left'>
                  <th className='border p-2 w-[40px] text-center'>№</th>
                  <th className='border p-2'>Дата начала</th>
                  <th className='border p-2'>Дата окончания</th>
                </thead>
                {
                  data.states.length 
                  && data.states.map((item, index) => (
                    <tr>
                      <td className='border p-2 text-center'>{index + 1}</td>
                      <td className='border p-2'>{convertDate(item.history_state.start_date._text)}</td>
                      <td className='border p-2'>{convertDate(item.history_state.finish_date._text)}</td>
                    </tr>
                  ))
                }
              </table></>)
            : 'История состояний пуста.'
          }
        </div>
      </div>
  )
}

export default CollaboratorInfo
