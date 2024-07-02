import { ListObject } from "../config/types"

const useFilter = (item: ListObject, searchValue: string) => {
    return item.name?.toLowerCase().includes(searchValue.toLowerCase(), 0)
}

export default useFilter