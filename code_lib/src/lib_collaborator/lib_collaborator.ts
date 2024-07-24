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