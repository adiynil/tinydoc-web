import userapi from "./rules/user";
import bookapi from "./rules/book";
import docapi from "./rules/doc";
import commentapi from "./rules/comment";
import feedbackapi from "./rules/feedback";
import downloadapi from "./rules/download";
import collectionapi from "./rules/collection";
import collectdocapi from "./rules/collectdoc";
import optionapi from "./rules/option";

export const user = userapi;
export const book = bookapi;
export const doc = docapi;
export const comment = commentapi;
export const feedback = feedbackapi;
export const download = downloadapi;
export const collection = collectionapi;
export const collectdoc = collectdocapi;
export const option = optionapi;

export default {
	user,
	book,
	doc,
	comment,
	feedback,
	download,
	collection,
	collectdoc,
	option,
};
