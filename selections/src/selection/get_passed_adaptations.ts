declare var RESULT: Array<unknown>
declare var Env: Env
declare var SORT: {FIELD: string, DIRECTION: string}


interface Adaptation extends Object {
	id?: number,
	person_fullname?: string,
	position_name?: string,
	start_date?: string,
	plan_readiness_date?: string,
	finish_date?: string,
	readiness_percent?: number,
	status?: string,
	position_type?: string,
	url?: string
}


RESULT = Array()


var arrAdaptations = ArraySelectAll<Adaptation>(XQuery("sql: SELECT id, person_fullname, position_name, \
    start_date, plan_readiness_date, finish_date, readiness_percent, status, position_type \
    FROM dbo.career_reserves \
    WHERE readiness_percent = 100"))


var oAdaptation: Adaptation
var i: number = 0


for (i; i < ArrayCount(arrAdaptations); i++) {

	oAdaptation = new Object()

    oAdaptation.AddProperty('id', arrAdaptations[i].id)
    oAdaptation.AddProperty('person_fullname', arrAdaptations[i].person_fullname)
    oAdaptation.AddProperty('position_name', arrAdaptations[i].position_name)
    oAdaptation.AddProperty('start_date', arrAdaptations[i].start_date)
    oAdaptation.AddProperty('plan_readiness_date', arrAdaptations[i].plan_readiness_date)
    oAdaptation.AddProperty('finish_date', arrAdaptations[i].finish_date)
    oAdaptation.AddProperty('readiness_percent', arrAdaptations[i].readiness_percent)
    oAdaptation.AddProperty('status', arrAdaptations[i].status)
    oAdaptation.AddProperty('position_type', arrAdaptations[i].position_type)
    oAdaptation.AddProperty('url', tools_web.get_mode_clean_url('adaptation', null, {adaptation_id: arrAdaptations[i].id, doc_id: Env.GetOptProperty('curDocID', '')}))

    RESULT.push(oAdaptation)
}


if (SORT.FIELD == null)
    RESULT = ArraySort(RESULT, "name", "+")
else
    RESULT = ArraySort(RESULT, SORT.FIELD, (SORT.DIRECTION == "ASC" ? "+" : "-"))