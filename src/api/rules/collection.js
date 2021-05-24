import service from "../core";

export const getByAccount = account => {
	return service.get(`/collection/account/${account}`);
};

export const getByCode = code => {
	return service.get(`/collection/code/${code}`);
};

export const insert = data => {
	return service.post(`/collection/insert`, data);
};

export const remove = data => {
	return service({
		method: "delete",
		url: "/collection/delete",
		data,
	});
};

export const update = data => {
	return service.put(`/collection/update`, data);
};

export default {
	getByAccount,
	getByCode,
	insert,
	remove,
	update,
};
