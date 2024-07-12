var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var BOSS_TYPE = Param.GetOptProperty('BOSS_TYPE')
var NOTIFICATION: string = Param.GetOptProperty('NOTIFICATION')

interface Coll {id: number, fullname?: string, boss_id: number}

function selectColls(): Coll[] {
    try {
        var dateNow = DateNewTime(Date(), 0, 0, 0)
        var dateYesterday = DateOffset(dateNow, -86400)
        return ArraySelectAll<Coll>(XQuery("sql: SELECT colls.id, colls.fullname, boss_id \
            FROM dbo.collaborators colls \
            JOIN dbo.collaborator AS coll_data ON colls.id = coll_data.id \
            CROSS JOIN LATERAL \
            unnest(\
                xpath(\
                    '//collaborator/func_managers/func_manager[boss_type_id="+ BOSS_TYPE +"]/person_id/text()', \
                    coll_data.data)::text[]\
                ) AS boss_id \
            WHERE hire_date IN ('" + dateNow + "', '" + dateYesterday + "')"))
    } catch (e) {
        throw Error("selectColls -> " + e?.message)
    }
}


function sendEmail(coll: Coll) {
    try {
        var notificationDoc = tools.open_doc(Int(NOTIFICATION))
        if (notificationDoc == undefined) 
            throw new Error('Тип уведомления с ID: ' + NOTIFICATION + ' не найден!')

        var collDoc = tools.open_doc(Int(coll.id))
        if (collDoc == undefined) 
            throw new Error('Сотрудник с ID: ' + coll.id + 'не найден!')

        var bossDoc = tools.open_doc(Int(coll.boss_id))
        if (bossDoc == undefined) 
            throw new Error('Руководитель с ID: ' + coll.boss_id + 'не найден!')

        tools.create_notification(
            Int(NOTIFICATION), 
            Int(coll.id), 
            null, 
            Int(coll.boss_id), 
            collDoc.TopElem,
            bossDoc.TopElem
        )

    } catch (e) {
        throw Error("sendEmail -> " + e?.message)
    }
}


function Main() {
    try {
        var colls = selectColls()
        var i = 0
        for (i; i < ArrayCount(colls); i++) {
            sendEmail(colls[i])
        }
    } catch (e) {
        throw Error("Main -> " + e?.message)
    }
}


function Log(value1: string, value2?: string) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #4. Агент «Рассылка уведомления новым сотрудникам»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e?.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #4. Агент «Рассылка уведомления новым сотрудникам»-----------------------")

export {}