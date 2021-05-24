import service from "../core";

export const get = () => {
	return service.get("/option/get");
};

export const insert = data => {
	return service.post("/option/insert", data);
};

export const update = data => {
	return service.put("/option/update", data);
};

export const remove = key => {
	return service.delete("/option/delete" + key);
};

export default {
	get,
	insert,
	update,
	remove,
};
