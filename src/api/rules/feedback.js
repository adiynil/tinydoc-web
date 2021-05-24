import service from "../core";

export const send = data => {
	return service.post(`/feedback`, data);
};

export default {
	send,
};
