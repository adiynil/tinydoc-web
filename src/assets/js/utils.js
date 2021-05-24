export const formatDate = function(time) {
	let date = new Date(time),
		now = new Date(Date.now()),
		oneDay = 24 * 60 * 60 * 1000,
		twoDay = oneDay * 2,
		oneWeek = oneDay * 7,
		weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
	// 目标
	let year = date.getFullYear(),
		month = PrefixZero(date.getMonth() + 1, 2), //月份是从0开始的
		day = PrefixZero(date.getDate(), 2),
		weekday = date.getDay(), // 星期是从0开始
		week = weekArray[weekday],
		hour = PrefixZero(date.getHours(), 2),
		min = PrefixZero(date.getMinutes(), 2),
		// sec = date.getSeconds(),
		ttime = date.getTime(),
		// 当前
		todayYear = now.getFullYear(),
		todayMonth = now.getMonth() + 1,
		todayDay = now.getDate(),
		todayTime = new Date(`${todayYear}-${todayMonth}-${todayDay}`).getTime(),
		yesterdayTime = new Date(todayTime - oneDay).getTime(),
		lastYesterdayTime = new Date(todayTime - twoDay).getTime(),
		weekTime = new Date(todayTime - oneWeek).getTime();
	if (ttime >= todayTime + oneDay) return `${year}年${month}月${day}日 ${hour}:${min}`;
	if (ttime >= todayTime) return `今天 ${hour}:${min}`;
	else if (ttime >= yesterdayTime) return `昨天 ${hour}:${min}`;
	else if (ttime >= lastYesterdayTime) return `前天 ${hour}:${min}`;
	else if (ttime >= weekTime) return `${week} ${hour}:${min}`;
	else if (todayYear == year) return `${month}月${day}日`;
	return `${year}年${month}月${day}日`;
};

export const PrefixZero = (num, n) => {
	return (Array(n).join(0) + num).slice(-n);
};

export const copy = data => {
	return new Promise((resolve, reject) => {
		let content = document.createElement("input");
		let body = document.getElementsByTagName("body");
		content.value = data;
		content.style.position = "fixed";
		body[0].appendChild(content);
		content.focus();
		content.select();
		try {
			if (document.execCommand("copy")) {
				resolve();
			} else {
				reject();
			}
		} catch (err) {
			reject(err);
		} finally {
			body[0].removeChild(content);
		}
	});
};

export default {
	formatDate,
	PrefixZero,
	copy,
};
