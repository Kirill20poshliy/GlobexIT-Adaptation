/**
 * @namespace Websoft.WT.Collaborators
*/
/**
 * @typedef {number} bigint
 */
/**
 * @typedef {number} int
 */
/**
 * @typedef {Object} iColl
 * @property {bigint} id
 * @property {string} code
 * @property {string} fullname
 * @property {string} email
 * @property {string} position_name
 * @property {string} position_parent_name
 */
/**
 * @typedef {Object} iResponse
 * @property {int} code
 * @property {iColl[]} data
 */
/**
 * @function Get_colls
 * @memberof Websoft.WT.Collaborators
 * @description Отдаёт список сотрудников
 * @returns {iResponse}
*/


type iColl = {
    id: number,
    code: string,
    fullname: string,
    email: string,
    position_name: string,
    position_parent_name: string
}

type iResponse = {
    code: number,
    data: iColl[]
}


function Get_colls(): iResponse {
    try {
        let result = XQuery("sql: \
            SELECT id, code, fullname, email, position_name, position_parent_name \
            FROM dbo.collaborators");
        return {
            code: 200,
            data: tools.read_object(tools.array_to_text(result, 'json'))
        };
    }
    catch (e) {
        alert(e.message);
        return {
            code: 500,
            data: []
        };
    }
}