import { ListObject } from "../shared/models"

const useFilter = (item: ListObject, searchValue: string) => {
    return item.name?.toLowerCase().includes(searchValue.toLowerCase(), 0)
}

export default useFilter