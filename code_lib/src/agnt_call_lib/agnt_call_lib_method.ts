let IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
const MODE = Param.GetOptProperty<string>('MODE')
let userId = Param.GetOptProperty<string>('userId')
let groupId = Param.GetOptProperty<string>('groupId')
let notificationTypeId = Param.GetOptProperty<string>('notificationTypeId')
let percent = Param.GetOptProperty<string>('percent')


function checkParams(params: string[]): void {
    let i: number = 0
    for (i; i < ArrayCount(params); i++) {
        if (!params[i]) {
            throw new Error('checkParams -> Не указаны требуемые параметры для выполнения метода!')
        }
    }
}


function callLib(): void {
    try {
        checkParams([MODE, userId])
        switch (MODE) {
            case 'Сменить пароль':
                checkParams([notificationTypeId])
                tools.call_code_library_method('lib_collaborator', 'changePassword', [userId, notificationTypeId])
                break
            case 'Повысить зарплату':
                checkParams([percent])
                tools.call_code_library_method('lib_collaborator', 'raiseSalary', [userId, OptInt(percent, 0)])
                break
            case 'Добавить в группу':
                checkParams([groupId])
                tools.call_code_library_method('lib_collaborator', 'addInGroup', [userId, groupId])
                break
            case 'Уволить':
                tools.call_code_library_method('lib_collaborator', 'dismiss', [userId])
                break
            default: throw new Error('Указан неверный MODE!')
        }
    } catch (e) {
        throw Error("callLib -> " + e.message)
    }
}


function Main(): void {
    try {
        callLib()
    } catch (e) {
        throw Error("Main -> " + e.message)
    }
}


function Log(value1: string, value2?: string): void {
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