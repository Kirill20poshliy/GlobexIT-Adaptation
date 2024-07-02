import { Tabs } from "antd";
import { FC } from "react"
import SubHierarchyList from "./components/SubHierarchyList";
import CollsList from "./components/CollsList";
import ComandList from "./components/ComandList";


const App:FC = () => {

  return (
    <main className='w-full min-h-screen p-4 flex flex-col gap-4 bg-white rounded-xl'>
      <h1 className='font-bold text-3xl'>Поиск</h1>

      <Tabs 
        defaultActiveKey="1"
        type="card"
        size={'middle'}
        items={[
          {
            key: '1',
            label: 'Подразделения',
            children: (
              <SubHierarchyList/>
            )
          },
          {
            key: '2',
            label: 'Сотрудники',
            children: (
              <CollsList/>
            )
          },
          {
            key: '3',
            label: 'Команда',
            children: (
              <ComandList/>
            )
          },
        ]}/>
    </main>
  )
}

export default App
