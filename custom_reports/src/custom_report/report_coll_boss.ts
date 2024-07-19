declare let _CRITERIONS: {value: string}[]
let grID = ArrayOptFind(_CRITERIONS, 'This.column_title == "name"').value

interface iResult {
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


let arrResult = ArraySelectAll<iResult>(XQuery("sql: SELECT \
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
    WHERE gr.group_id = '" + grID + "' \
    ORDER BY fullname"))

// @ts-ignore
return arrResult