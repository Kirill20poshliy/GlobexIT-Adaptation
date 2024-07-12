var IS_DEBUG = tools_web.is_true(Param.IS_DEBUG)
var sFileUrl = Param.CARDS


interface Card {
    parent_document_id?: string,
    name: string,
    access_level: string,
    comment: string
}

type cardList = Card[]


function selectDoc(): cardList {
    try {
        var cFileUrl = Screen.AskFileOpen()
        var fileText = LoadFileData(UrlOrFilePathToFilePath(cFileUrl))
        return tools.read_object(fileText)
    } catch (e) {
        if (typeof sFileUrl === 'string') {
            var fileText = LoadFileData(sFileUrl)
            return tools.read_object(fileText)
        } else {
            throw Error('selectDoc -> ' + e?.message)
        }
    }
}

function createSection(card: Card) {
    try {
        var newSection = tools.new_doc_by_name('document')
        newSection.BindToDb()

        if (newSection.TopElem.Child('parent_document_id')) {
            newSection.TopElem.Child('parent_document_id').Value = card.parent_document_id
        }

        newSection.TopElem.Child('name').Value = card.name
        newSection.TopElem.Child('create_date').Value = Date()
        newSection.TopElem.Child('access').Child('access_level').Value = card.access_level
        newSection.TopElem.Child('comment').Value = card.comment
        newSection.Save()
    } catch (e) {
        throw Error("createSection -> " + e?.message)
    }
}


function createSections(cardsArr: cardList) {
    try {
        var i = 0
        for (i; i < ArrayCount(cardsArr); i++) {
            createSection(cardsArr[i])
        }
    } catch (e) {
        throw Error("createSections -> " + e?.message)
    }
}


function Main() {
    try {
        var CARDS = selectDoc()
        createSections(CARDS)
    } catch (e) {
        throw Error("Main -> " + e?.message)
    }
}


function Log(value1: string, value2?: string) {
    var text = value2 != undefined ? value1 + ": " + value2 : value1
    if(IS_DEBUG)
        alert(text)
} 


Log("----------------Начало. Globexit. Адаптация. #2. Агент «Создание карточек разделов портала по json-файлу»------------------")

var mainTimer = DateToRawSeconds(Date()) 

try {
    Main();
} catch(e) {
    Log(e?.message)
} 

mainTimer = DateToRawSeconds(Date()) - mainTimer

Log("Агент завершил свою работу за " + mainTimer + " секунд")
Log("---------------------Конец. Адаптация. #2. Агент «Создание карточек разделов портала по json-файлу»-----------------------")
function UrlOrFilePathToFilePath(cFileUrl: string): string {
    throw new Error("Function not implemented.")
}

export {}