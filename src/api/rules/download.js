import service from "../core";

export const pack = data => {
	return service.post(`/download`, data);
};

export const go = filename => {
	window.open(`http://localhost:5000/download/file/` + filename, "_blank");
};

export const get = account => {
	return service.get("/download/" + account);
};

export default {
	pack,
	go,
	get,
};
