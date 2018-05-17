/*
 * 生成指定范围的随机整数
 * @param lower 下限
 * @param upper 上限
 * @return 返回指定范围的随机整数，上/下限值均可取
 */
function random(lower, upper) {
	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

/*
 * 生成rgb随机颜色值
 * @return 返回生成的rgb字符串："rgb(33,44,55)"
 */
function randomColor() {
	// 随机生成 rgb 十进制值
	var r = random(0, 255),
		g = random(0, 255),
		b = random(0, 255);
	// 串联字符串，并返回
	return "rgb("+ r +","+ g +","+ b +")";
}

/*
 * 将 URL 中查询字符串转换为对象
 * @param ul 待转换的URL字符串
 */
function parseQueryString(url) {
	// 获取 ? 与 # 的索引
	var start = url.indexOf("?"),
		end = url.indexOf("#");

	// 判断是否有 ?
	if (start === -1) // 不存在，则返回 null
		return null;
	// 存在 ?，则起始索引从?后一位置开始
	start += 1;

	// 判断是否有 #
	if (end === -1) // 不存在，则截取到字符串末尾
		end = url.length;

	// 获取查询字符串
	var queryString = url.slice(start, end);

	// 使用 & 符号将查询字符串分割
	queryString = queryString.split("&");
	var result = {}; // 保存解析后的对象
	// 遍历迭代数组中每个元素
	for (var i = 0, len = queryString.length; i < len; i++) {
		// 将当前数组中遍历到的 "key=value" 以 = 分割
		var parts = queryString[i].split("=");
		result[parts.shift()] = parts.shift();
	}

	// 将解析报的对象返回
	return result;
}

/*
 * 将对象转换为查询字符串
 * @param obj 对象
 * @return 查询字符串 key=value&key=value&key=value
 */
function toQueryString(obj) {
	// 定义变量保存转换结果
	var result = [];
	// 遍历迭代对象各属性
	for (var attr in obj) {
		result.push(attr + "=" + obj[attr]);
	}

	// 返回连接后的查询字符串
	return result.join("&");
}

/*
 * 格式化日期时间：yyyy-MM-dd HH:mm:ss
 * @param datetime 待格式化日期时间对象
 * @return 格式化后的字符串：yyyy-MM-dd HH:mm:ss
 */
function format(datetime) {
	var year = datetime.getFullYear(),
		month = ("0" + (datetime.getMonth() + 1)).slice(-2),
		date = ("0" + datetime.getDate()).slice(-2),
		hour = ("0" + datetime.getHours()).slice(-2),
		min = ("0" + datetime.getMinutes()).slice(-2),
		sec = ("0" + datetime.getSeconds()).slice(-2);

	return year + "-"+ month +"-"+ date +" "+ hour +":"+ min +":" + sec;
}

/*
 * 查找元素（根据id，class，tag）
 * @param selector 选择器
 * @param context 查询上下文
 * @return 返回查找到的元素结果
 */
function $(selector, context) { // ".test"
	/*// 没有传递 context 参数，则默认为 document
	if (typeof context === "undefined")
		context = document;*/

	// 没有传递 context 参数，则默认为 document
	context = context || document;

	if (selector.charAt(0) === "#") // id
		return document.getElementById(selector.slice(1));
	if (selector.charAt(0) === ".") // class，解决兼容
		return byClass(selector.slice(1), context);
	// tagname
	return context.getElementsByTagName(selector);
}

/*
 * 解决 document.getElementsByClassName 浏览器兼容问题
 * @param className 类名
 * @param context 查询上下文
 * @return 返回查找到的元素集合
 */
function byClass(className, context) {
	// 默认在整个文档中查询
	context = context || document;
	// 支持使用 getElementsByClassName 方法，则直接调用
	if (context.getElementsByClassName)
		return context.getElementsByClassName(className);
	// 不支持使用 getElementsByClassName 方法，解决兼容
	var result = []; // 保存所有查找到的元素
	// 查找查询上下文环境中所有元素
	var elements = context.getElementsByTagName("*");
	// 遍历所有元素，判断每个元素的类名
	for (var i = 0, len = elements.length; i < len; i++) {
		// 将当前遍历到元素的类名存入数组中
		var classNames = elements[i].className.split(" ");
		// 遍历数组中的元素，判断是否存在待查找的类名
		for (var j = 0, l = classNames.length; j < l; j++) {
			if (classNames[j] === className) {
				result.push(elements[i]);
				break;
			}
		}
	}

	// 返回查找结果
	return result;
}

/*
 * 添加事件监听，事件冒泡
 * @param element 待添加事件监听的DOM元素
 * @param type 事件类型
 * @param callback 事件处理程序，回调函数
 */
function on(element, type, callback) {
	if (element.addEventListener) {
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.addEventListener(type, callback, false);
	} else {
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

/*
 * 删除事件监听，事件冒泡
 * @param element 待删除事件监听的DOM元素
 * @param type 事件类型
 * @param callback 事件处理程序，回调函数
 */
function off(element, type, callback) {
	if (element.removeEventListener) {
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.removeEventListener(type, callback, false);
	} else {
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.detachEvent(type, callback);
	}
}

/*
 * 获取/设置 CSS 样式
 * @param element DOM元素对象
 * @param attr CSS属性名
 * @param value 可选，表示设置的CSS属性值
 * @return 在 element 的CSS样式中 attr 属性的CSS值
 */
function css(element, attr, value) {
	if (typeof attr === "object") {
		// 设置
		for (var i in attr) {
			element.style[i] = attr[i];
		}
		return;
	}

	if (typeof value === "undefined") {
		// 获取
		return window.getComputedStyle
					? window.getComputedStyle(element)[attr]
					: element.currentStyle[attr];		
	}

	// 设置
	element.style[attr] = value;
}

/*
 * 显示元素
 */
function show(element) {
	element.style.display = "block";
}

/*
 * 隐藏元素
 */
function hide(element) {
	element.style.display = "none";
}

/*
 * 获取元素在文档中的定位坐标
 * @param element DOM元素对象
 * @return 返回元素在文档中的坐标对象，该对象有top与left两个属性
 */
function offset(element) {
	var _left = 0, _top = 0;
	while (element !== null) {
		_left += element.offsetLeft;
		_top += element.offsetTop;
		element = element.offsetParent;
	}

	return {
		top : _top,
		left : _left
	}
}

/*
 * 查询/保存cookie
 * @param key cookie名
 * @param value cookie值，可选
 * @param options 可配置项，可选，如：{expires:7, path:"/", domain:"xx", secure:true}
 * @return 返回根据cookie名查询到的 cookie值
 */
function cookie(key, value, options) {
	// writing 
	if (typeof value !== "undefined") {
		// 名值对（键值对），将 key 和 value 都执行编码操作
		var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		// 判断可配置项
		options = options || {};
		// 有失效时间
		if (options.expires) {
			var datetime = new Date();
			datetime.setDate(datetime.getDate() + options.expires);
			cookie += ";expires=" + datetime.toUTCString();
		}
		// 有路径
		if (options.path)
			cookie += ";path=" + options.path;
		// 有域
		if (options.domain)
			cookie += ";domain=" + options.domain;
		// 有安全配置
		if (options.secure)
			cookie += ";secure";
		// 保存cookie
		document.cookie = cookie;
		return;
	}

	// reading
	// 读取域下所有 cookie ("key=value") 放到数组中保存
	var cookies = document.cookie.split("; ");
	// 遍历迭代数组元素
	for (var i = 0, len = cookies.length; i < len; i++) {
		// 当前cookie以 "=" 分割
		var parts = cookies[i].split("=");
		// 第一个=号前的是cookie名，剩余元素以=连接作为cookie值
		var name = decodeURIComponent(parts.shift());
		// cookie名是否为待查找的名称
		if (name === key) {
			// 将value解码
			var value = decodeURIComponent(parts.join("="));
			// 返回查找到的 cookie 值
			return value;
		}
	}
	// 不能查找到，则返回 undefined
	return undefined;
}

/*
 * 删除cookie
 * @param key cookie名
 * @param options 可配置项
 */
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1;
	cookie(key, "", options);
}

/*
 * 多属性运动框架：线性运动
 * @param element 待添加运动动画效果的DOM元素
 * @param options 多属性运动配置对象，如：{width:500, height:300, left:200, top:200}
 * @param speed 运动总时间
 * @param fn 运动结束后要执行的函数(可选)
 */
function animate(element, options, speed, fn) {
	// 停止元素上已有运动
	clearInterval(element.timer);
	// 定义变量保存初值、区间值
	var start = {}, range = {};
	for (var attr in options) {
		start[attr] = parseFloat(css(element, attr));
		range[attr] = options[attr] - start[attr];
	}
	// 定义变量记录运动起始时间
	var startTime = +new Date();
	// 启动运动计时器
	element.timer = setInterval(function(){
		// 计算已运动经过的时间
		var elapsed = Math.min(+new Date() - startTime, speed);
		// 计算当前步各属性走到的值
		for (var attr in options) {
			// 当前遍历属性的值
			var result = elapsed * range[attr] / speed + start[attr];
			// 设置 css 样式
			element.style[attr] = result + (attr === "opacity" ? "" : "px");
		}
		// 判断是否停止计时器
		if (elapsed === speed){
			clearInterval(element.timer);
			// 判断是否有运动结束执行的函数，有则调用
			fn && fn();
		}
	}, 1000/60)
}

/*
 * 淡入
 */
function fadeIn(element, speed, fn) {
	element.style.display = "block";
	element.style.opacity = 0;
	animate(element, {opacity:1}, speed, fn);
}

/*
 * 淡出
 */
function fadeOut(element, speed, fn) {
	animate(element, {opacity:0}, speed, function(){
		element.style.display = "none";
	});
}