declare let continueFlag: boolean

// Этап 1. Выгрузка новых пользователей. Регулярно выполняемый код:
//
var collsArray = ArrayOptFirstElem(XQuery("sql: SELECT id FROM dbo.collaborators WHERE fullname = '"
    + Trim('{[2]}') + " " 
    + Trim('{[3]}') + " "
    + Trim('{[4]}') + "'"))
if (collsArray != undefined || Trim('{[2]}') == "") {
    continueFlag = true
}


// Этап 2. Обновление пользователей. Регулярно выполняемый код:
//
if (Trim('{[2]}') == "" && Trim('{[3]}') == "") {
    continueFlag = true
}


// Этап 3. Выгрузка новых должностей. Регулярно выполняемый код:
//
var possArray = ArrayOptFirstElem(XQuery("sql: SELECT id FROM dbo.positions WHERE name = '"+ Trim('{[8]}' + "'")))
if (possArray != undefined || Trim('{[8]}')=="") {
    continueFlag = true
}


// Этап 4. Обновление должностей. Регулярно выполняемый код:
//
if (Trim('{[8]}') == "") {
    continueFlag = true
}