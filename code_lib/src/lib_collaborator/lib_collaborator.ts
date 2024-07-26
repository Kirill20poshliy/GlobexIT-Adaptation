/**
 * @namespace Websoft.WT.Collaborator
 */
/**
 * @typedef {number} bigint
 */
/**
 * @typedef {number} real
*/


/**
 * @function changePassword
 * @memberof Websoft.WT.Collaborator
 * @description Меняет пароль указанного сотрудника на случайный. Отправляет уведомление сотруднику.
 * @param {bigint} userId - ID cотрудника
 * @param {bigint} notificationTypeId - ID типа уведомления
 */

function changePassword(userId: number, notificationTypeId: number) {
    try {
        let oDoc = tools.open_doc(userId)
        if (oDoc == undefined) {
            throw new Error('Сотрудника с ID ' + userId + ' не существует!')
        }
        let newPass = tools.random_string(12)
    
        oDoc.TopElem.Child('password').Value = newPass
        oDoc.Save()
    
        tools.create_notification(notificationTypeId, userId, newPass, null, oDoc.TopElem)
    } catch (e) {
        alert('changePassword -> ' + e.message)
    }
}


/**
 * @function raiseSalary
 * @memberof Websoft.WT.Collaborator
 * @description Поднимает зарплату указанному сотруднику на указанный процент.
 * @param {bigint} userId - ID cотрудника
 * @param {real} percent - Процент повышения зарплаты
 */

function raiseSalary(userId: number, percent: number) {
    try {
        let oDoc = tools.open_doc(userId)
        if (oDoc == undefined) {
            throw new Error('Сотрудника с ID ' + userId + ' не существует!')
        }
        let salary = oDoc.TopElem.Child('comp_ben').Child('salary').Value
        let newSalary = OptReal(salary) * (1 + OptReal(percent) / 100)
    
        oDoc.TopElem.Child('comp_ben').Child('salary').Value = newSalary
        oDoc.Save()
    } catch (e) {
        alert('raiseSalary -> ' + e.message)
    }
}


/**
 * @function addInGroup
 * @memberof Websoft.WT.Collaborator
 * @description Добавляет сотрудника в указанную группу
 * @param {bigint} userId - ID cотрудника
 * @param {bigint} groupId - ID группы
 */

function addInGroup(userId: number, groupId: number) {
    try {
        if (!userId) {
            throw new Error('ID сотрудника не задан!')
        }
        let grDoc = tools.open_doc(groupId)
        if (grDoc == undefined) {
            throw new Error('Группы с ID ' + groupId + ' не существует!')
        }
        let newColl = grDoc.TopElem.Child('collaborators').AddChild('collaborator')
        newColl.Child('collaborator_id').Value = userId
        grDoc.Save()
    } catch (e) {
        alert('addInGroup -> ' + e.message)
    }
}


/**
 * @function dismiss
 * @memberof Websoft.WT.Collaborator
 * @description "Увольняет" указанного сотрудника
 * @param {bigint} userId - ID cотрудника
 */

function dismiss(userId: number) {
    try {
        let oDoc = tools.open_doc(userId)
        if (oDoc == undefined) {
            throw new Error('Сотрудника с ID ' + userId + ' не существует!')
        }
        oDoc.TopElem.Child('is_dismiss').Value = 1
        oDoc.TopElem.Child('dismiss_date').Value = Date()
        oDoc.Save()
    } catch (e) {
        alert('dismiss -> ' + e.message)
    }
}