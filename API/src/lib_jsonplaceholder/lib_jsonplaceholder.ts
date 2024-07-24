/** 
 * @namespace Websoft.WT.JSONplaceholder 
*/

/**
 * @function Get_todos
 * @memberof Websoft.WT.JSONplaceholder
 * @description Получает список todos с сервиса jsonplaceholder
 * @returns {Object}
*/


function Get_todos(): {code: number, data: []} {
    try {
        var result = HttpRequest('https://jsonplaceholder.typicode.com/todos')
        if (result == undefined || result.RespCode !== 200) {
            throw new Error('Ошибка внешнего сервиса API')
        }
        return {
            code: result.RespCode,
            data: tools.read_object(result.Body)
        }
    } catch (e) {
        alert(e.message)
        return {
            code: result.RespCode,
            data: []
        }
    }
}