<%
var DEV_MODE = ArrayOptFirstElem(XQuery("sql:\
	SELECT id\
	FROM dbo.custom_web_templates\
	WHERE code = 'test' --\u041A\u043E\u0434 \u0448\u0430\u0431\u043B\u043E\u043D\u0430\
		AND enable_anonymous_access = true")) != undefined;
if (DEV_MODE) {
    // Для тестирования, шаблон должен быть анонимным.
    Request.AddRespHeader("Access-Control-Allow-Origin", "*", false);
    Request.AddRespHeader("Access-Control-Expose-Headers", "Error-Message");
    Request.AddRespHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
    Request.AddRespHeader("Access-Control-Allow-Credentials", "true");
}
Request.RespContentType = "application/json";
Request.AddRespHeader("Content-Security-Policy", "frame-ancestors 'self'");
Request.AddRespHeader("X-XSS-Protection", "1");
Request.AddRespHeader("X-Frame-Options", "SAMEORIGIN");
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
/* --- types --- */
/* --- utils --- */
function getParam(name) {
    return tools_web.get_web_param(curParams, name, undefined, 0);
}
/* --- global --- */
var curUserId = DEV_MODE ? OptInt("7000000000000000") : OptInt(Request.Session.Env.curUserID);
var curUser = DEV_MODE ? tools.open_doc(curUserId).TopElem : Request.Session.Env.curUser;
/* --- logic --- */
function handler(body) {
    var method = tools_web.convert_xss(body.GetOptProperty("method"));
    if (method === undefined) {
        throw HttpError({
            code: 400,
            message: "unknown method"
        });
    }
    if (method === "getColls") {
        var subdivision = tools_web.convert_xss(body.GetOptProperty("subdivision"));
        return getColls(subdivision);
    }
    if (method === "getSubs")
        return getSubs();
}
/* --- start point --- */
function main(req, res) {
    try {
        var body = req.Query;
        var payload = handler(body);
        res.Write(tools.object_to_text(payload, "json"));
    }
    catch (error) {
        var errorObject = tools.read_object(error);
        Request.RespContentType = "application/json";
        Request.SetRespStatus(errorObject.GetOptProperty("code", 500), "");
        Response.Write(errorObject.GetOptProperty("message", error));
    }
}
main(Request, Response);
%>
