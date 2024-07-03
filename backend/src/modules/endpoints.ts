//=include ../utils/query.ts

function getColls(subdivision: string) {
	return selectAll(`SELECT id, fullname, position_parent_name FROM dbo.collaborators WHERE position_parent_name = '${subdivision}'`)
}

function getSubs() {
	return selectAll("SELECT id, name FROM dbo.subdivisions")
}