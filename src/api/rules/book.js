import service from "../core";

export const getAll = () => {
	return service.get(`/book/all`);
};

export const getByAccount = account => {
	return service.get(`/book/${account}`);
};

export const getOne = (account, identity) => {
	return service.get(`/book/${account}/${identity}`);
};

export const getById = id => {
	return service.get(`/book/get/` + id);
};

export const insertOne = (account, identity, data) => {
	return service.post(`/book/${account}/${identity}`, data);
};

export const deleteOne = id => {
	return service.delete(`/book/${id}`);
};

export const updateOne = (id, data) => {
	return service.put(`/book/${id}`, data);
};

export default {
	getAll,
	getByAccount,
	getOne,
	getById,
	insertOne,
	deleteOne,
	updateOne,
};
