var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var BOSS_TYPE = Param.BOSS_TYPE
var NOTIFICATION_COLL: string = Param.GetOptProperty('NOTIFICATION_COLL')
var NOTIFICATION_BOSS: string = Param.GetOptProperty('NOTIFICATION_BOSS')


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


function sendMails(colls: Coll[]) {
    try {
        var notificationCollDoc = tools.open_doc(Int(NOTIFICATION_COLL))
        if (notificationCollDoc == undefined) 
            throw new Error('Тип уведомления с ID: ' + NOTIFICATION_COLL + ' не найден!')

        var notificationBossDoc = tools.open_doc(Int(NOTIFICATION_BOSS))
        if (notificationBossDoc == undefined) 
            throw new Error('Тип уведомления с ID: ' + NOTIFICATION_BOSS + ' не найден!')

        if (ArrayCount(colls)) {

            var collsList = new Array()
            var i: number = 0
            var collDoc: XmlDocument
            var bossDoc: XmlDocument

            for (i; i < ArrayCount(colls); i++) {
                collDoc = tools.open_doc(Int(colls[i].id))
                if (collDoc == undefined) 
                    throw new Error('Сотрудник с ID: ' + colls[i].id + 'не найден!')

                collsList.push(collDoc.TopElem.Child('lastname').Value + " " 
                + collDoc.TopElem.Child('firstname').Value + " "
                + collDoc.TopElem.Child('middlename').Value)

                bossDoc = tools.open_doc(Int(colls[i].boss_id))
                if (bossDoc == undefined) 
                    throw new Error('Руководитель с ID: ' + colls[i].boss_id + 'не найден!')

                tools.create_notification(
                    Int(NOTIFICATION_COLL), 
                    Int(colls[i].id), 
                    null, 
                    Int(colls[i].boss_id), 
                    collDoc.TopElem, 
                    bossDoc.TopElem
                )
            }

            var text = collsList.join(', ')

            for (i = 0; i < ArrayCount(colls); i++) {
                tools.create_notification(
                    Int(NOTIFICATION_BOSS),
                    Int(colls[i].boss_id),
                    text
                )
            }
        } else {
            throw new Error('Список новых сотрудников пуст!')
        }

    } catch (e) {
        throw Error("sendMails -> " + e?.message)
    }
}


function Main() {
    try {
        var colls = selectColls()
        sendMails(colls)
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