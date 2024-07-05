var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var sFileUrl = Param.COLLS


function selectDoc() {
    try {
        var cFileUrl = Screen.AskFileOpen()
        alert(cFileUrl)
        var doc = OpenDoc(cFileUrl, 'format=excel')
        var ws = ArrayFirstElem(doc.TopElem)
        return ws
    } catch (e) {
        doc = OpenDoc('file:///' + sFileUrl, 'format=excel')
        ws = ArrayFirstElem(doc.TopElem)
        return ws
    }
}


function createCards(collsData) {
    try {
        for (row = 1; row < ArrayCount(collsData); row++) {
            fullname = collsData[row][0] + ' ' + collsData[row][1] + ' ' + collsData[row][2]
            coll = ArrayOptFirstElem(tools.xquery("sql: SELECT id FROM dbo.collaborators WHERE fullname = '" + fullname + "'"), {id: ''})
            pos = ArrayOptFirstElem(tools.xquery("sql: SELECT id FROM dbo.collaborators WHERE name = '" + collsData[row][5] + "'"), {id: ''})
            subdivision = ArrayOptFirstElem(tools.xquery("sql: SELECT id FROM dbo.subdivisions WHERE name = '" + collsData[row][6] + "'"), {id: ''})
            organization = ArrayOptFirstElem(tools.xquery("sql: SELECT id FROM dbo.orgs WHERE disp_name = '" + collsData[row][7] + "'"), {id: ''})

            if (coll.id) {
                docColl = tools.open_doc(coll.id)
                docColl.TopElem.login = collsData[row][3]
                docColl.TopElem.sex = collsData[row][4]
                docColl.Save()
            } else {
                docColl = tools.new_doc_by_name('collaborator')
                docColl.BindToDb()

                docColl.TopElem.lastname = collsData[row][0]
                docColl.TopElem.firstname = collsData[row][1]
                docColl.TopElem.middlename = collsData[row][2]
                docColl.TopElem.login = collsData[row][3] 
                docColl.TopElem.sex = collsData[row][4]
                coll = docColl.TopElem
                docColl.Save()
            }

            if (pos.id) {
                docPos = tools.open_doc(pos.id)
                docPos.TopElem.parent_object_id = subdivision.id
                docPos.TopElem.org_id = organization.id
                docPos.TopElem.basic_collaborator_id = coll.id
                docPos.Save()
            } else {
                docPos = tools.new_doc_by_name('position')
                docPos.BindToDb()
                
                docPos.TopElem.name = collsData[row][5]
                docPos.TopElem.parent_object_id = subdivision.id
                docPos.TopElem.org_id = organization.id
                docPos.TopElem.basic_collaborator_id = coll.id
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


function Log(value1, value2) {
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
