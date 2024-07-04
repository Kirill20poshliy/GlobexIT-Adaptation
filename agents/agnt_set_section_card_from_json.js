var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var sFileUrl = Param.CARDS



function selectDoc() {
    try {
        var cFileUrl = Screen.AskFileOpen()
        var fileText = LoadFileData(UrlOrFilePathToFilePath(cFileUrl))
        return tools.read_object(fileText)
    } catch (e) {
        var fileText = LoadFileData(sFileUrl)
        return tools.read_object(fileText)
    }
}

function createSection(card) {
    try {
        var newSection = tools.new_doc_by_name('document')
        newSection.BindToDb()

        if (newSection.TopElem.parent_document_id) {
            newSection.TopElem.parent_document_id = card.parent_document_id
        }

        newSection.TopElem.name = card.name
        newSection.TopElem.create_date = Date()
        newSection.TopElem.access.access_level = card.access_level
        newSection.TopElem.comment = card.comment
        newSection.Save()
    } catch (e) {
        throw Error("createSection -> " + e.message)
    }
}


function createSections(cardsArr) {
    try {
        for (elem in cardsArr) {
            createSection(elem)
        }
    } catch (e) {
        throw Error("createSections -> " + e.message)
    }
}


function Main() {
    try {
        var CARDS = selectDoc()
        createSections(CARDS)
    } catch (e) {
        throw Error("Main -> " + e.message)
    }
}


function Log(value1, value2) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #2. Агент «Создание карточек разделов портала по json-файлу»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #2. Агент «Создание карточек разделов портала по json-файлу»-----------------------")
