declare let continueFlag: boolean

// Этап 1. Выгрузка новых пользователей. Регулярно выполняемый код:
//
let arrColls = ArrayOptFirstElem(XQuery("sql: \
    SELECT id \
    FROM dbo.collaborators \
    WHERE code = '" + Trim('{[1]}') + "'"
))

if (arrColls != undefined || Trim('{[1]}') == "") {
    continueFlag = true
}


// Этап 2. Обновление пользователей. Регулярно выполняемый код:
//
if (Trim('{[1]}') == "") {
    continueFlag = true
}


// Этап 3. Выгрузка новых должностей. Регулярно выполняемый код:
//
let arrPoss = ArrayOptFirstElem(XQuery("sql: \
    SELECT id \
    FROM dbo.positions \
    WHERE code = '"+ Trim('{[5]}') + "_" + Trim('{[1]}') + "'"
))

if (arrPoss !== undefined || Trim('{[5]}') == "") {
    continueFlag = true
}


// Этап 4. Обновление должностей. Регулярно выполняемый код:
//
if (Trim('{[5]}') == "") {
    continueFlag = true
}