var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var sFileUrl = Param.COLLS


function selectDoc() {
    try {
        var cFileUrl = Screen.AskFileOpen()
        var doc = OpenDoc(cFileUrl, 'format=excel')
        var ws = doc.TopElem.OptChild<[]>('worksheet')
        return ws
    } catch (e) {
        doc = OpenDoc('file:///' + sFileUrl, 'format=excel')
        ws = doc.TopElem.OptChild<[]>('worksheet')
        return ws
    }
}


function getID(table: string, column: string, value: string) {
    return ArrayOptFirstElem<{id: number}, {id: undefined}>(XQuery("sql: SELECT id FROM dbo." + table 
        + " WHERE " + column + " = '" + value + "'"), {id: undefined})
}


function createCards(collsData: []) {
    try {
        var row: number
        var fullname: string
        var coll: {id: number | any}
        var pos: {id: number}
        var subdivision: {id: number}
        var organization: {id: number}
        var docColl: XmlDocument
        var docPos: XmlDocument
        for (row = 1; row < ArrayCount(collsData); row++) {
            fullname = collsData[row][0] + ' ' + collsData[row][1] + ' ' + collsData[row][2]
            coll = getID('collaborators', 'fullname', fullname)
            pos = getID('positions', 'name', collsData[row][5])
            subdivision = getID('subdivisions', 'name', collsData[row][6])
            organization = getID('orgs', 'disp_name', collsData[row][7])

            if (!subdivision.id)
                throw new Error('Подразделения с именем "' + collsData[row][6] + '" не существует!')

            if (!organization.id)
                throw new Error('Организации с именем "' + collsData[row][7] + '" не существует!')

            if (coll.id) {
                docColl = tools.open_doc(coll.id)
                docColl.TopElem.Child('login').Value = collsData[row][3]
                docColl.TopElem.Child('sex').Value = collsData[row][4]
                docColl.Save()

            } else {
                docColl = tools.new_doc_by_name('collaborator')
                docColl.BindToDb()

                docColl.TopElem.Child('fullname').Value = fullname
                docColl.TopElem.Child('login').Value = collsData[row][3]
                docColl.TopElem.Child('sex').Value = collsData[row][4]
                coll = {id: docColl.TopElem.Child('id').Value}
                docColl.Save()
            }

            if (pos.id) {
                docPos = tools.open_doc(pos.id)
                docPos.TopElem.Child('parent_object_id').Value = subdivision.id
                docPos.TopElem.Child('org_id').Value = organization.id
                docPos.TopElem.Child('basic_collaborator_id').Value = coll.id
                docPos.Save()

            } else {
                docPos = tools.new_doc_by_name('position')
                docPos.BindToDb()
                
                docPos.TopElem.name = collsData[row][5]
                docPos.TopElem.Child('parent_object_id').Value = subdivision.id
                docPos.TopElem.Child('org_id').Value = organization.id
                docPos.TopElem.Child('basic_collaborator_id').Value = coll.id
                docPos.Save()
            }
        }
    } catch (e) {
        throw Error("createCards -> " + e.message)
    }
}


function Main() {
    try {
        var collsData = selectDoc()
        createCards(collsData)
    } catch (e) {
        throw Error("Main -> " + e.message)
    }
}


function Log(value1: string, value2?: string) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #3. Агент «Создание карточек сотрудников и должностей по excel-файлу»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #3. Агент «Создание карточек сотрудников и должностей по excel-файлу»-----------------------")
