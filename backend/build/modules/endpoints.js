<%
/** @module utils.query start*/
/**
 * Выбирает все записи sql запроса
 * @param {string} query - sql-выражение
 */
function selectAll(query) {
    return ArraySelectAll(tools.xquery("sql: " + query));
}
/**
 * Выбирает первую запись sql запроса
 * @param {string} query - sql-выражение
 * @param {any} defaultObj - значение по умолчанию
 */
function selectOne(query, defaultObj) {
    return ArrayOptFirstElem(tools.xquery("sql: " + query), defaultObj);
}
/** @module utils.query end*/
function getColls(subdivision) {
    return selectAll("SELECT id, fullname, position_parent_name FROM dbo.collaborators WHERE position_parent_name = '" + subdivision + "'");
}
function getSubs() {
    return selectAll("SELECT id, name FROM dbo.subdivisions");
}
%>
