import { FC } from 'react'
import { SearchInput } from '../config/types'
import { Input } from 'antd';
import { useDispatch } from 'react-redux';


const Search: FC<SearchInput> = ({searchPlaceholder = '', setSearchValue}) => {


    const dispatch = useDispatch()


    return (
        <Input 
            placeholder={searchPlaceholder}
            onChange={(e) => dispatch(setSearchValue(e.currentTarget.value))}
            size="large"/>
    )
}

export default Search
