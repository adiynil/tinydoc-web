import service from "../core";

export const getById = id => {
	return service.get(`/collectdoc/id/${id}`);
};

export const insert = data => {
	return service.post(`/collectdoc/insert`, data);
};

export const remove = data => {
	return service({
		method: "delete",
		url: "/collectdoc/delete",
		data,
	});
};

export const update = data => {
	return service.put(`/collectdoc/update`, data);
};

export default {
	getById,
	insert,
	remove,
	update,
};
