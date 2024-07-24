let IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
const MODE = Param.GetOptProperty('MODE')
let userId = Param.GetOptProperty('userId')
let groupId = Param.GetOptProperty('groupId')
let notificationTypeId = Param.GetOptProperty('notificationTypeId')
let percent = Param.GetOptProperty('percent')


function callLib() {
    try {
        switch (MODE) {
            case 'Сменить пароль':
                if (!userId || !notificationTypeId) 
                    throw new Error('Не указаны требуемые параметры для выполнения метода!')
                tools.call_code_library_method('lib_collaborator', 'changePassword', [userId, notificationTypeId])
                break
            case 'Повысить зарплату':
                if (!userId || !percent) 
                    throw new Error('Не указаны требуемые параметры для выполнения метода!')
                tools.call_code_library_method('lib_collaborator', 'raiseSalary', [userId, OptInt(percent, 0)])
                break
            case 'Добавить в группу':
                if (!userId || !groupId)
                    throw new Error('Не указаны требуемые параметры для выполнения метода!')
                tools.call_code_library_method('lib_collaborator', 'addInGroup', [userId, groupId])
                break
            case 'Уволить':
                if (!userId) 
                    throw new Error('Не указаны требуемые параметры для выполнения метода!')
                tools.call_code_library_method('lib_collaborator', 'dismiss', [userId])
                break
            default: throw new Error('Указан неверный MODE!')
        }
    } catch (e) {
        throw Error("callLib -> " + e.message)
    }
}


function Main() {
    try {
        callLib()
    } catch (e) {
        throw Error("Main -> " + e.message)
    }
}


function Log(value1: string, value2?: string) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #18. Агент «Вызов методов из библиотеки кода»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e?.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #18. Агент «Вызов методов из библиотеки кода»-----------------------")

export {}