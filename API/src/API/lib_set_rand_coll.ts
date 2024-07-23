/**
 * @namespace Websoft.WT.NewColls
 */

/**
 * @function Set_coll
 * @memberof Websoft.WT.NewColls
 * @description Создаёт рандомного сотрудника в системе
 * @returns {string}
 */

function Set_coll(): string {
    try {
        let result = HttpRequest('https://randomuser.me/api/')
        if (result == undefined) {
            throw new Error('Ошибка внешнего сервиса API')
        }
        let data: [] = tools.read_object(result.Body).GetOptProperty('results')
        let newColl: Object = ArrayOptFirstElem(data)

        let oDoc = tools.new_doc_by_name('collaborator')
        oDoc.BindToDb()

        let name = newColl.GetOptProperty('name')
        oDoc.TopElem.Child('lastname').Value = name.GetOptProperty('last')
        oDoc.TopElem.Child('firstname').Value = name.GetOptProperty('first')

        let gender = newColl.GetOptProperty('gender')
        oDoc.TopElem.Child('sex').Value = gender === 'male' ? 'm' : 'w'

        oDoc.TopElem.Child('email').Value = newColl.GetOptProperty('email')

        let login = newColl.GetOptProperty('login')
        oDoc.TopElem.Child('login').Value = login.GetOptProperty('username')
        oDoc.TopElem.Child('password').Value = login.GetOptProperty('password')

        oDoc.TopElem.Child('phone').Value = newColl.GetOptProperty('phone')
        oDoc.TopElem.Child('mobile_phone').Value = newColl.GetOptProperty('cell')

        let birth = newColl.GetOptProperty('dob')
        oDoc.TopElem.Child('birth_date').Value = birth.GetOptProperty('date')

        oDoc.Save()

        return 'Сотрудник успешно создан!'

    } catch (e) {
        return 'Ошибка:' + e.message
    }
}