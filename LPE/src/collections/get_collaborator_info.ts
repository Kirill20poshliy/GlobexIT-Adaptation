interface iCollInfo {
	email: string,
	age: number,
	birth_date: string,
	position_name: string,
	position_parent_name: string,
	tab_num: string
}


interface iResult {
    id: number, 
    name: string, 
    value: string | number
}


declare let RESULT: iResult[]


let collInfo = ArrayOptFirstElem<iCollInfo>(XQuery("sql: \
    SELECT \
        c1.email, \
        date_part('year', age(c1.birth_date)) AS age, \
        c1.birth_date, \
        c1.position_name, \
        c1.position_parent_name, \
        tab_num \
    FROM dbo.collaborators c1 \
    JOIN dbo.collaborator c2 ON c1.id = c2.id \
    CROSS JOIN LATERAL unnest(xpath('/collaborator/custom_elems/custom_elem[name=\"tab_num\"]/value/text()', c2.data)::text[]) AS tab_num \
    WHERE c1.id = " + curUserID
))


RESULT = [
    {
        id: 1,
        name: 'Email',
        value: collInfo.email
    },
    {
        id: 2,
        name: 'Возраст',
        value: collInfo.age
    },
    {
        id: 3,
        name: 'Дата рождения',
        value: StrDate(Date(collInfo.birth_date), false)
    },
    {
        id: 4,
        name: 'Должность',
        value: collInfo.position_name
    },
    {
        id: 5,
        name: 'Подразделение',
        value: collInfo.position_parent_name
    },
    {
        id: 6,
        name: 'Табельный номер',
        value: collInfo.tab_num
    }
];

export {}