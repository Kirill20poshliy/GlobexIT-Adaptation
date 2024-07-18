declare let teSystemEventHandler: {wvars: Object}
declare let learningDoc: XmlTopElem


let newCourseId = teSystemEventHandler.wvars.ObtainChildByKey( "newCourseId" ).value


let learningCourseId = learningDoc.Child('course_id').Value
let learningPersonId = learningDoc.Child('person_id').Value
let learningStateId = learningDoc.Child('state_id').Value


let arrLearnings = ArraySelectAll(XQuery("sql: SELECT id FROM dbo.learnings \
    WHERE course_id = '" + learningCourseId + "' AND person_id = '" + learningPersonId + "' AND state_id <> 4"))


if (ArrayCount(arrLearnings) < 3 && learningStateId == 4) {
    try {
        tools.activate_course_to_person(learningPersonId + '', newCourseId)
    } catch (e) {
        alert('Ошибка при назначении курса: ' + e?.message)
    }
}