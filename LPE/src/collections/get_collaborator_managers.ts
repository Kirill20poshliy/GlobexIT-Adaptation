interface iManager {
    id: number,
    person_id?: number,
    person_fullname: string,
    pict_url: string,
}

declare let RESULT: iManager[]

let arrManagers = ArraySelectAll<iManager>(XQuery("sql: \
    SELECT fm.person_id, fm.person_fullname, c.pict_url \
    FROM dbo.func_managers fm \
    JOIN dbo.collaborators c ON fm.person_id = c.id \
    WHERE fm.object_id = " + curUserID
))


RESULT = []
let i: number = 0
for (i; i < ArrayCount(arrManagers); i++) {
    RESULT.push({
        id: arrManagers[i].person_id,
        person_fullname: arrManagers[i].person_fullname,
        pict_url: UrlAppendPath(global_settings.settings.portal_base_url, arrManagers[i].pict_url)
    })
}


export {}