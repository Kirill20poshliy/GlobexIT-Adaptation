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

function handler(body: object) {

	const method = tools_web.convert_xss(body.GetOptProperty("method"))

	if (method === undefined) {
		throw HttpError({
			code: 400,
			message: "unknown method"
		});
	}

	if (method === "getColls") {
		const subdivision = tools_web.convert_xss(body.GetOptProperty("subdivision"))
		return getColls(subdivision)
	}

	if (method === "getSubs")
		return getSubs()

}

/* --- start point --- */
function main(req: Request, res: Response) {
	try {
		const body = req.Query;

		const payload = handler(body);

		res.Write(tools.object_to_text(payload, "json"));

	} catch (error) {
		const errorObject = tools.read_object(error);
		Request.RespContentType = "application/json";
		Request.SetRespStatus(errorObject.GetOptProperty("code", 500), "");
		Response.Write(errorObject.GetOptProperty("message", error));
	}
}

main(Request, Response);

export {}