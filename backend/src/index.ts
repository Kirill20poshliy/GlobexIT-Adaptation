//=require ./modules/devmode.ts
//=require ./modules/endpoints.ts

/* --- types --- */

/* --- utils --- */
function getParam(name: string) {
	return tools_web.get_web_param(curParams, name, undefined, 0);
}

/* --- global --- */
const curUserId: number = DEV_MODE ? OptInt("7000000000000000") : OptInt(Request.Session.Env.curUserID);
const curUser: CollaboratorDocumentTopElem = DEV_MODE ? tools.open_doc<CollaboratorDocument>(curUserId).TopElem : Request.Session.Env.curUser;

/* --- logic --- */

function handler(query: object, body: object) {

	const method = tools_web.convert_xss(query.GetOptProperty("method"))

	if (method === undefined) {
		throw HttpError({
			code: 400,
			message: "unknown method"
		});
	}

	if (method === "getSubColls") {
		const subdivision = tools_web.convert_xss(query.GetOptProperty("subdivision"))
		return getSubColls(subdivision)
	}

	if (method === "getColls") {
		const page = tools_web.convert_xss(query.GetOptProperty("page"))
		const limit = tools_web.convert_xss(query.GetOptProperty("limit"))
		return getColls(page, limit)
	}

	if (method === "getComand") {
		return getComand()
	}

	if (method === "getSubs") {
		return getSubs()
	}

	if (method === "getCollInfo") {
		const coll_id = tools_web.convert_xss(query.GetOptProperty("coll_id"))
		return {
			changes: getCollChanges(coll_id), 
			states: getCollStates(coll_id)
		}
	}

	if (method === "addToComand") {
		const person_id = tools_web.convert_xss(body.GetOptProperty("id"))
		return addToComand(person_id)
	}

	if (method === "deleteFromComand") {
		const id = tools_web.convert_xss(body.GetOptProperty("id"))
		return deleteFromComand(id)
	}

}

/* --- start point --- */
function main(req: Request, res: Response) {
	try {
		const query = req.Query;
		const body: object = tools.read_object(req.Body)

		const payload = handler(query, body);
		res.Write(tools.object_to_text(payload, "json"));

	} catch (error) {
		alert(error?.message)
		const errorObject = tools.read_object(error);
		Request.RespContentType = "application/json";
		Request.SetRespStatus(errorObject.GetOptProperty("code", 500), "");
		Response.Write(errorObject.GetOptProperty("message", error));
	}
}

main(Request, Response);

export {}