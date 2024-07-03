//=include ../utils/query.ts


function getSubColls(subdivision: string) {
	const data = selectAll(`SELECT id, fullname AS name, position_parent_name, position_name 
		FROM dbo.collaborators 
		WHERE position_parent_name = '${subdivision}'`)
	const count = selectOne<{count: number}>(`SELECT count(*) as count 
		FROM dbo.collaborators 
		WHERE position_parent_name = '${subdivision}'`)
	return {
		count: `${count.count}`,
		data: data
	}
}

function getColls(page: string, limit: string) {
	const offset = (Int(page) - 1) * Int(limit)
	const data = selectAll(`SELECT colls.id, colls.fullname AS name, colls.position_name, colls.org_name, 
		subs.person_id as subscription, colls.position_parent_id
		FROM dbo.collaborators colls
		LEFT JOIN dbo.subscriptions subs ON colls.id = subs.document_id
		WHERE (subs.person_id <> ${curUserID} AND colls.id <> ${curUserID}) OR subs.document_id IS NULL
		ORDER BY name
		LIMIT ${limit}
		OFFSET ${offset}`)
	const count = selectOne<{count: number}>(`SELECT count(*) as count FROM dbo.collaborators colls
		LEFT JOIN dbo.subscriptions subs ON colls.id = subs.person_id
		WHERE (subs.person_id <> ${curUserID} AND colls.id <> ${curUserID}) OR subs.document_id IS NULL`)
	return {
		count: `${count.count}`,
		data: data
	}
}

function getComand() {
	const data = selectAll(`SELECT colls.id, colls.fullname AS name, colls.position_name, colls.org_name, 
		subs.person_id as subscription, colls.position_parent_id
		FROM dbo.collaborators colls
		LEFT JOIN dbo.subscriptions subs ON colls.id = subs.document_id
		WHERE subs.person_id = ${curUserID}
		ORDER BY name`)
	const count = selectOne<{count: number}>(`SELECT count(*) as count FROM dbo.collaborators colls
		LEFT JOIN dbo.subscriptions subs ON colls.id = subs.person_id
		WHERE subs.document_id = ${curUserID}`)
	return {
		count: `${count.count}`,
		data: data		
	}
}

function addToComand(person_id: string) {
	const newSubscription = tools.new_doc_by_name('subscription')
	newSubscription.BindToDb()
	newSubscription.TopElem.Child('type').Value = 'collaborator'
	newSubscription.TopElem.Child('person_id').Value = Int(curUserID)
	newSubscription.TopElem.Child('document_id').Value = Int(person_id)
	newSubscription.Save()
	return {
		result: true
	}
}

function deleteFromComand(id: string) {
	const document = selectOne<{id: number}>(`SELECT id FROM dbo.subscriptions 
		WHERE document_id = ${id} AND person_id = ${curUserID}`)
	if (document !== undefined) {
		const documentId = document.id
		const docUrl = UrlFromDocID(documentId)
		DeleteDoc(docUrl, true)
		return {
			result: true
		}
	} else return {
		result: false
	}
}

function getSubs() {
	const data = selectAll(`WITH RECURSIVE sub_hierarchy (id, name, parent_object_id, level) AS (
		SELECT sub.id, sub.name, sub.parent_object_id, CAST(0 AS int) AS level
		FROM dbo.subdivisions AS sub
		WHERE sub.parent_object_id IS NULL
		UNION ALL
		SELECT sub.id, sub.name, sub.parent_object_id, shr.level + 1 AS level
		FROM dbo.subdivisions AS sub
		JOIN sub_hierarchy AS shr ON sub.parent_object_id = shr.id)
		SELECT * from sub_hierarchy AS shr
		ORDER BY shr.level DESC`)
	const count = selectOne<{count: number}>("SELECT count(*) as count FROM dbo.subdivisions")
	return {
		count: `${count.count}`,
		data: data		
	}
}

function getCollChanges(coll_id: string) {
	return selectAll(`SELECT colls.id, colls.fullname AS name, change FROM dbo.collaborators AS colls
		JOIN dbo.collaborator AS coll_data ON colls.id = coll_data.id
		CROSS JOIN LATERAL unnest(xpath('//collaborator/change_logs/change_log'::text, coll_data.data)) AS change
		WHERE colls.id = ${coll_id}`)
}

function getCollStates(coll_id: string) {
	return selectAll(`SELECT colls.id, colls.fullname AS name, history_state FROM dbo.collaborators AS colls
		JOIN dbo.collaborator AS coll_data ON colls.id = coll_data.id
		CROSS JOIN LATERAL unnest(xpath('//collaborator/history_states/history_state'::text, coll_data.data)) AS history_state
		WHERE colls.id = ${coll_id}`)
}