import service from "../core";

export const get = id => {
	return service.get(`/comment/get/` + id);
};

export const insert = data => {
	return service.post(`/comment/add`, data);
};

export const remove = data => {
	return service({
		method: "delete",
		url: `/comment/delete`,
		data,
	});
};

export default {
	get,
	insert,
	remove,
};
