import { FC } from "react"
import SubList from "./components/SubList"


const App:FC = () => {

  return (
    <main className='w-full p-4 flex flex-col gap-4'>
      <h1 className='font-bold text-xl'>Подразделения</h1>
      <SubList/>
    </main>
  )
}

export default App
