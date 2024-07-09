var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var BOSS_TYPE = Param.BOSS_TYPE
var NOTIFICATION = Param.NOTIFICATION

function selectColls() {
    try {
        dateNow = DateNewTime(Date(), 0, 0, 0)
        dateYesterday = DateOffset(dateNow, -86400)
        return ArraySelectAll(XQuery("sql: SELECT colls.id, colls.fullname, boss \
            FROM dbo.collaborators colls \
            JOIN dbo.collaborator AS coll_data ON colls.id = coll_data.id \
            CROSS JOIN LATERAL \
            unnest(\
                xpath(\
                    '//collaborator/func_managers/func_manager[boss_type_id="+ BOSS_TYPE +"]/person_id/text()'::text, \
                    coll_data.data)\
                ) AS boss \
            WHERE hire_date IN ('" + dateNow + "', '" + dateYesterday + "')"))
    } catch (e) {
        throw Error("selectColls -> " + e.message)
    }
}


function sendEmail(coll) {
    try {
        notificationDoc = tools.open_doc(OptInt(NOTIFICATION))
        if (notificationDoc == undefined) 
            throw new Error('Тип уведомления с ID: ' + NOTIFICATION + ' не найден!')

        collDoc = tools.open_doc(OptInt(coll.id))
        if (collDoc == undefined) 
            throw new Error('Сотрудник с ID: ' + coll.id + 'не найден!')

        bossDoc = tools.open_doc(OptInt(coll))
        if (bossDoc == undefined) 
            throw new Error('Руководитель с ID: ' + coll + 'не найден!')

        actNotification = tools.create_notification(
            OptInt(NOTIFICATION), 
            OptInt(coll.id), 
            null, 
            OptInt(coll), 
            collDoc.TopElem, 
            bossDoc.TopElem
        )

    } catch (e) {
        throw Error("sendEmail -> " + e.message)
    }
}


function Main() {
    try {
        var colls = selectColls()
        for (coll in colls) {
            sendEmail(coll)
        }
    } catch (e) {
        throw Error("Main -> " + e.message)
    }
}


function Log(value1, value2) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #4. Агент «Рассылка уведомления новым сотрудникам»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #4. Агент «Рассылка уведомления новым сотрудникам»-----------------------")