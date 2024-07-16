declare let columns: XmlElem<Column>


interface Column {
    flag_formula: boolean,
    column_title: string,
    column_value: string,
    datatype: string
}


interface Result {
    id?: number,
    code: string,
    fullname: string,
    email: string,
    position: string,
    subdivision: string,
    tutor_fullname: string,
    tutor_email: string,
    tutor_position: string,
    PrimaryKey?: string
}


let arrResult = ArraySelectAll<Result>(XQuery("sql: SELECT \
        gr.id, \
        gr.code, \
        gr.collaborator_fullname AS fullname, \
        c1.email, \
        c1.position_name AS position, \
        c1.position_parent_name AS subdivision, \
        gr.tutor_fullname, \
        c2.email AS tutor_email, \
        c2.position_name AS tutor_position \
    FROM dbo.group_collaborators gr \
    LEFT JOIN dbo.collaborators c1 ON c1.id = gr.collaborator_id \
    LEFT JOIN dbo.collaborators c2 ON c2.id = gr.tutor_id \
    ORDER BY fullname"))


function setColumn(title: string, value: string): void {
    let column = columns.AddChild()
    column.flag_formula = true
    column.column_title = title
    column.column_value = 'ListElem.' + value
    column.datatype = 'string'
}

columns.Clear()

setColumn('Код', 'code')
setColumn('ФИО', 'fullname')
setColumn('Email', 'email')
setColumn('Должность', 'position')
setColumn('Подразделение', 'subdivision')
setColumn('ФИО руководителя', 'tutor_fullname')
setColumn('Email руководителя', 'tutor_email')
setColumn('Должность руководителя', 'tutor_position')

// @ts-ignore
return arrResult