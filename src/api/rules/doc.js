// eslint-disable-next-line no-unused-vars
import service from "../core";

export const getByAccount = account => {
	return service.get("/doc/" + account);
};

export const getOne = id => {
	return service.get("/doc/id/" + id);
};

export const getByBook = (account, identity) => {
	return service.get(`/doc/${account}/${identity}`);
};

export const getAll = () => {
	return service.get("/doc/all");
};

export const remove = data => {
	return service({
		method: "delete",
		url: "/doc/delete",
		data,
	});
};

export const insert = doc => {
	return service.post("/doc/insert", doc);
};

export const update = doc => {
	return service.put("/doc/update", doc);
};

export default {
	getByAccount,
	getByBook,
	getOne,
	getAll,
	remove,
	insert,
	update,
};
