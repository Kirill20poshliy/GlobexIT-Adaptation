import { FetchOptions } from "../config/types";


const useFetch = async (url: string, options: FetchOptions): Promise<[]> => {

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout)

    const data = await fetch(url, {
        ...options,    
        signal: controller.signal
    })
    .then(res => res.json())
    .catch(e => {
        if (e.name === 'AbortError') {
            console.log(e)
            alert('Время запроса вышло!')
        } else {
            console.log(e)
            alert(`Ошибка сервера: ${e?.message}`)
        }
    })
    clearTimeout(id)

    return data
}

export { useFetch }