var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var COLLS = OBJECTS_ID_STR.split(";")


function setNewRandPasswd(colls) {
    try {

        if (!colls.length) {
            throw new Error("Пользователи не выбраны!")
        }

        var dColl
        for (elem in colls) {
            dColl = tools.open_doc( elem )
        
            if ( dColl == undefined )
                continue;
        
            dColl.TopElem.password = tools.random_string(12)
            dColl.Save()
        }

    } catch (e) {
        throw Error("setNewRandPasswd -> " + e.message)
    }
}


function Main() {
    try {
        setNewRandPasswd(COLLS)
    } catch (e) {
        throw Error("Main -> " + e.message)
    }
}


function Log(value1, value2) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #1. Агент «Присвоение случайного пароля»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #1. Агент «Присвоение случайного пароля»-----------------------")
