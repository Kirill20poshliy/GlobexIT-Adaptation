declare let continueFlag: boolean

// Этап 1. Выгрузка новых сотрудников в кастомный каталог cc_outsource. Регулярно выполняемый код:
//
let coll = ArrayOptFirstElem<{collaborator_code: string}>(XQuery("sql: \
    SELECT collaborator_code \
    FROM dbo.cc_outsources \
    WHERE collaborator_code = '" + Trim('{[1]}') + "'"
))


if (coll !== undefined || Trim('{[1]}') == "" || Trim('{[5]}') !== "outsource") {
    continueFlag = true
}