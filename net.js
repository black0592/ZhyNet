/*
此网络访问模块由Zhy版权所有,支持Promise规范,支持HTTPS和HTTP,支持POST和GET,支持超时
QQ:854185073
 */
var https = require("https");
var http = require("http");
var U = require("url");
var UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36";
var Lang = "zh-CN,zh;q=0.8";
var Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
var ZhyNet = function () {
	this.timeout=10000;
	this.Cookies = [];
	
};
Buffer.prototype.cc = function (b) {
	return Buffer.concat([this, b], this.length + b.length);
}
ZhyNet.prototype.setOutTime = function (outtime){
	this.timeout=outtime;
}
ZhyNet.prototype.setCookie = function (name, value) {
	this.Cookies[name] = value;
}
ZhyNet.prototype.getCookies = function () {
	let res = "";

	for (key in this.Cookies)
		if (key != "domain")
			if (key != "path")
				if (key != "expires")

					res += key + "=" + this.Cookies[key] + "; ";
	//console.log(res.substring(0,res.length-2));
	return res.substring(0, res.length - 2);
}
ZhyNet.prototype.clearCookies = function () {
	this.Cookies = [];
}
ZhyNet.prototype.parseCookies = function (cookiestr) {
	let ar = cookiestr.split(";");

	for (x in ar) {
		let s = ar[x].split('=');
		if (typeof s[0] != "undefined" && typeof s[1] != "undefined")
			if ((s[0] + "").trim() != "" && (s[1] + "").trim() != "")
				this.Cookies[(s[0].trim())] = (s[1].trim());
	}
}
ZhyNet.prototype.parseCookieArr = function (cookiearr) {
	for (c in cookiearr) {
		this.parseCookies(cookiearr[c]);

	}

}
ZhyNet.substr = function (str, start, end) {
	var i = str.indexOf(start) + start.length;
	return str.substring(i, str.indexOf(end, i));
}
ZhyNet.substrarr = function (str, start, end) {

	var results = [];
	var n = 0;
	do {

		var i = str.indexOf(start, n) + start.length;
		if (i <= n)
			break;
		var n = str.indexOf(end, i);

		results.push(str.substring(i, n));
		n += end.length;

	} while (n < str.length && n >= i);
	return results;
}
ZhyNet.prototype.get = function (url, bin, extraheaders) {
	if (url.indexOf("://") == -1)
		return;
	let pro;
	if (url.indexOf("https://") != -1)
		pro = https;
	else
		pro = http;
	
	
	var timeoutID = 0;
	var options = U.parse(url);
	if (!extraheaders || !isArray(extraheaders)) {
		extraheaders = {
		
			"Referer":url
		};

	}

	options.headers = Object.assign({
			"Connection": "keep-alive",
			"Host": options.host,
			"X-Requested-With": "XMLHttpRequest",
			"User-Agent": UA,
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": Accept,
			"Accept-Language": Lang
		}, extraheaders);
	//	console.log(options.headers);
		if(this.getCookies()!="")
		options.headers= Object.assign(options.headers,{"Cookie": this.getCookies()});
	var that = this;
	return new Promise(function (resolve, reject) {
		let req = pro.get(options, (res) => {
			
				let buf = new Buffer(0);
				let end = () => {
					clearTimeout(timeoutID);
					that.parseCookieArr(res.headers['set-cookie']);
					resolve(bin ? buf : (buf.toString()));
					return;
				};
				res.on("data", (c) => {
					
					buf = buf.cc(c)
					
				});
				res.on("error", reject);
				//res.setTimeout(2000,()=>reject());
				res.on("end",end );
			});

		timeoutID = setTimeout(() => {
				req.abort();
				reject("Timeout");
			}, that.timeout);

		req.on("error", (e) => {
			reject(e);
		});
		//req.write(data);
		//req.end();


	});

}
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}
ZhyNet.prototype.post = function (url, data, bin, extraheaders) {
	if (url.indexOf("://") == -1)
		return;
	let pro;
	if (url.indexOf("https://") != -1)
		pro = https;
	else
		pro = http;
	var timeoutID = 0;
	var options = U.parse(url);
	options.method = "POST";
	if (!extraheaders || !isArray(extraheaders)) {
		extraheaders = {
			"Referer":url
	
		};

	}
	options.headers = Object.assign({
			"Connection": "keep-alive",
			"Host": options.host,
			"Content-Length": data.length,
			"X-Requested-With": "XMLHttpRequest",
			"Accept": Accept,
			"Accept-Language": Lang,
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": UA
			
		}, extraheaders);
	if(this.getCookies()!="")
		options.headers= Object.assign(options.headers,{"Cookie": this.getCookies()});
	var that = this;
	return new Promise(function (resolve, reject) {
		let req = pro.request(options, (res) => {
				let buf = new Buffer(0);
				res.on("data", (c) => {
					buf = buf.cc(c);
				});
				res.on("error", reject);
				//res.setTimeout(2000,()=>reject());
				res.on("end", () => {
					clearTimeout(timeoutID);

					that.parseCookieArr(res.headers['set-cookie']);
					resolve(bin ? buf : (buf.toString() + ""));
				});
			});
		timeoutID = setTimeout(() => {
				req.abort();
				reject("Timeout");
			}, that.timeout);

		req.on("error", (e) => {
			reject(e);
		});

		req.end(data);

	});

}
module.exports = ZhyNet;
