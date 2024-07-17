declare let RESULT: Array<unknown>
declare let Env: Env
declare let SORT: {FIELD: string, DIRECTION: string}


interface iAdaptation {
	id: number,
	person_fullname: string,
	position_name: string,
	start_date: string,
	plan_readiness_date: string,
	finish_date: string,
	readiness_percent: number,
	status: string,
	position_type: string,
}


RESULT = []


let arrAdaptations = ArraySelectAll<iAdaptation>(XQuery("sql: SELECT \
		id, \
		person_fullname, \
		position_name, \
		start_date, \
		plan_readiness_date, \
		finish_date, \
		readiness_percent, \
		status, \
		position_type \
    FROM dbo.career_reserves \
    WHERE readiness_percent = 100"))


if (SORT.FIELD == null)
    RESULT = ArraySort(arrAdaptations, "name", "+")
else
    RESULT = ArraySort(arrAdaptations, SORT.FIELD, (SORT.DIRECTION == "ASC" ? "+" : "-"))