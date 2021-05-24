import service from "../core";
// 需要权限
export const current = () => {
	return service.get("/user/current");
};

export const register = user => {
	return service.post("/user/register", user);
};

export const login = user => {
	return service.post("/user/login", user);
};

export const update = user => {
	return service.put("/user/update", user);
};

export const changeEmail = data => {
	return service.post("/user/changeemail", data);
};

export const validEmail = data => {
	return service.post("/user/validemail", data);
};

export const reValidEmail = data => {
	return service.post("/user/revalidemail", data);
};

export const changePass = data => {
	return service.put("/user/changepassword", data);
};

export const forgetPass = data => {
	return service.post("/user/forgetpassword", data);
};

export const insert = user => {
	return service.post("/user/insert", user);
};

export const remove = list => {
	return service({
		method: "delete",
		url: `/user/delete`,
		data: list,
	});
};

export const getAll = () => {
	return service.get("/user/list");
};

export const getOne = account => {
	return service.get(`/user/${account}`);
};

export default {
	current,
	register,
	login,
	update,
	getAll,
	getOne,
	validEmail,
	reValidEmail,
	changeEmail,
	changePass,
	forgetPass,
	remove,
	insert,
};
