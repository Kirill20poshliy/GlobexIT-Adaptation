declare let continueFlag: boolean

// Этап 1. Выгрузка новых пользователей. Регулярно выполняемый код:
//
let arrColls = ArrayOptFirstElem(XQuery("sql: SELECT id FROM dbo.collaborators WHERE code = '" + Trim('{[1]}') + "'"))
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
if (Trim('{[5]}') == "") {
    continueFlag = true
}

let arrPoss = ArraySelectAll<{code: string}>(XQuery("sql: SELECT c.code \
    FROM dbo.positions p \
    JOIN dbo.collaborators c ON c.id = p.basic_collaborator_id \
    WHERE p.name = '" + Trim('{[8]}') + "' AND p.code = '"+ Trim('{[5]}') + "'"))

if (ArrayCount(arrPoss) !== 0) {
    let i: number = 0
    for (i; i < ArrayCount(arrPoss); i++) {
        if (arrPoss[i].code == Trim('{[1]}')) {
            continueFlag = true
            break
        }
    }
}


// Этап 4. Обновление должностей. Регулярно выполняемый код:
//
if (Trim('{[5]}') == "") {
    continueFlag = true
}