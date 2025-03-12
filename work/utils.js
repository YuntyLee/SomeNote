import {Message} from 'tinper-bee';
import axios from "axios";
import moment from 'moment';
import { domainName, COMMON_SERVICE_projectapply } from 'ucf-common/src/commonConfig'
import { SendMessage } from '@boc/message';
import queryString from "query-string";
import { iSRM_userLoginName, iSRM_locale, iSRM_tenantid } from 'utils/cookies'
let hostname = ['isrm.zte.com.cn', 'iscp.zte.com.cn'];
if (hostname.includes(window.location.hostname)) {
	require('./zteuxp')
}


export const success = (msg,duration = 10) => {
 	//设置默认设置
	Message.create({content: msg, color: 'success', duration: duration, icon: 'uf uf-arrow-c-o-down',style: {width: 'auto'}});
}

export const Error = (msg,duration = 10) => {
	Message.create({content: msg, color: 'danger',  duration: duration,style: {width: 'auto'}});
}

export const Warning = (msg,duration = 10) => {
	Message.create({content: msg, color: 'warning', duration: duration, style: {width: 'auto'}});
}

export const Info = (msg,duration = 10) => {
	Message.create({content: msg, color: 'info', duration: duration, style: {width: 'auto'}});
}
/**
 * 数据返回统一处理函数
 * @param {*} response
 * @param {*} successMsg 成功提示
 * @param {*} bool 默认是false。请求接口不是0000状态时，给错误提示。
 * 									为true时，表示请求接口不是0000状态时，前端不给提示，主要是适用于需要给用户进行二次确认。
 */
export const processData = (response, successMsg, bool) => {
	if (response) {
		let { code, bo, other } = response.data;
		if (code && code.code !== '0000') {
			let message = code.msg;
			if (typeof bo === 'string' && bo) {
				message = bo;
			}
			(!bool) && Error(`${lang.template('UCF_COMMON_HAND_00000036')/*"提示"*/}:${(message)}`, 10);
			throw response.data;
		} else if (code && code.code === '0000') {
			if (successMsg) {
				success(successMsg);
			}
			return bo;
		} else {
			return false;
		}
	} else {
		return false;
	}


}

/**
 * param拼接到url地址上
 * @param {*} url
 * @param {*} params
 * @param {*} prefix
 */
export const paramToUrl = (url, params, prefix) => {
	if (!prefix) prefix = '';
	if (url.indexOf('?') == -1) {
		url += '?r=' + Math.random();
	}
	for (let attr in params) {
		if ((attr == 'pageIndex') || (attr == 'pageSize')) {
			url += '&' + attr + '=' + params[attr];
		} else {
			url += '&' + prefix + attr + '=' + params[attr];
		}
	}
	return url;
}

/**
 * json转换指定的前缀
 * @param {JSON} json
 * @param {JSON} prefix
 */
export const jsonToUrl = (json, prefix = "search_") => {
	let obj = {};
	for (let attr in json) {
		if ((attr == 'pageIndex') || (attr == 'pageSize')) {
			obj[`${attr}`] = json[attr];
		} else {
			obj[`${prefix}${attr}`] = json[attr];
		}
	}
	return obj;
}

// 后台乱码转换
export const convert = (text) => {
	let element = document.createElement("p");
	element.innerHTML = text;
	let output = element.innerText || element.textContent;
	element = null;
	return output;
}

// 删除cookie
// path和domain需要准确。否则删除不成功，可通过F12，查看应用中需要cookie字段的path和domain
export const delCookie = (name, options = {}) => {

	options = Object.assign({ domain: '.zte.com.cn', path: '/' }, options);
	let date = new Date();
	date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
	let expires = '; expires=' + date.toUTCString();
	let path = options.path ? '; path=' + options.path : '';
	let domain = options.domain ? '; domain=' + options.domain : '';
	let secure = options.secure ? '; secure' : '';
	let c = [name, '=', 0].join('');
	let cookie = [c, expires, path, domain, secure].join('')
	document.cookie = cookie;

}

export const setCookie = (name, value, options) => {

	options = options || {};
	if (value === null) {
		value = '';
		options.expires = -1;
	}
	let expires = '';
	if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
		let date;
		if (typeof options.expires == 'number') {
			date = new Date();
			date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
		} else {
			date = options.expires;
		}
		expires = '; expires=' + date.toUTCString();
	}
	let path = options.path ? '; path=' + options.path : '';
	let domain = options.domain ? '; domain=' + options.domain : '';
	let s = [cookie, expires, path, domain, secure].join('');
	let secure = options.secure ? '; secure' : '';
	let c = [name, '=', encodeURIComponent(value)].join('');
	let cookie = [c, expires, path, domain, secure].join('')
	document.cookie = cookie;

}

export const getCookie = (name) => {

	let cookieValue = null;
	if (document.cookie && document.cookie != '') {
		let cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	// 按照总设部规范，调整为下划线
	if (typeof cookieValue != 'undefined' && cookieValue != null) {
		cookieValue = cookieValue.replace(/-/, "_");
	}
	return cookieValue;
}


/**
 * 生成唯一字符串
 */
export function uuid() {
	const s = [];
	const hexDigits = '0123456789abcdef';
	for (let i = 0; i < 36; i += 1) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4';
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = '-';
	s[13] = '-';
	s[18] = '-';
	s[23] = '-';
	return s.join('');
}

// 新增权限功能标识   目前用cookies的tenantid来判断采购方
export const serverType = iSRM_tenantid() === 'ifckxwyk' ? 'ztef_iSRMC_' : 'ztef_iSRMG_'
export const supplier = iSRM_tenantid() && iSRM_tenantid() !== "ifckxwyk";
/**
 * 导出excel封装的新方法，只有一个对象入参
 * @param {*} param 
 */
export function exportExcelPostNew (param = {}) {
	return exportExcelPost(param.url, param.data || {}, param.name || '', param.grayscale || '', param.method || '', param.noKey || '')
}
/**
 * 导出excel 后端导出，通过post方式
 * grayscale 用作灰度引流标识请求头
 */
export function exportExcelPost(url, data,...reset) {
	const readyState = 2;//为了解决魔法值而定义
	let locale = iSRM_locale() ||'zh_CN';
	let  customId= iSRM_userLoginName() ||'';
	let [name, grayscale, method, noKey] = [...reset]
	if(grayscale){
		customId = 'gray_cluster';
	}
	let pageCode = getPageCode()
	return  axios({
		method: method || 'post',
		url: url,
		data: data,
		responseType: 'blob',
		headers:{
			'X-Lang-Id':locale,
			'X-custom-Id':customId,
			'X-ISRM-UPP-RESOURCE': pageCode
		}
	}).then((res) => {
		let { type } = res.data;
		if(type.includes('application/json')){
			let reader = new FileReader();
			reader.readAsText(res.data)
			reader.onload = e => {
				if (e.target.readyState === readyState) {
					let res = JSON.parse(e.target.result)
					let { code, bo, other} = res || {};
					if(code&&code.code!=='0000'){
						let message = code.msg;
						if(typeof bo === 'string'){
							message = bo;
						}
						Error(`${lang.template('UCF_COMMON_00050203')/*"导出"*/}:${(message)}`);
					}else{
						if(typeof bo === 'string' && bo){
							Info(`${lang.template('UCF_COMMON_00050203')/*"导出"*/}:${(bo)}`);
						}else{
							Error(`${lang.template('UCF_COMMON_00050203')/*"导出"*/}:${lang.template('UCF_COMMON_00050014')/*"接口提示成功,但是未正确返回文件流!"*/}`);
						}
					}
				}
			}
		}else{
			fileStreamHandling(res);
		}
		return true
	}).catch((err) => {
		errResponseHandle(err, lang.template('UCF_COMMON_00050058')/*导出:接口报错*/)
		return false;
	})
}
//处理文件流
export const fileStreamHandling = (res)=>{
	if(res){
		const content = res.data;
		let contentDisposition = res.headers['content-disposition']&&res.headers['content-disposition'].split(';')||[];
		let tempFileName = '' ;
		for(let i=0,len=contentDisposition.length;i<len;i++){
			let  temp  = contentDisposition[i]
			if(getType(temp) === 'string'&&temp.split('=')[0].startsWith('filename')){
				let nameValue = temp.split('=')[1];
				if(nameValue.startsWith('utf-8')){
					tempFileName = nameValue&&decodeURIComponent(nameValue.split("'")[2]);
				}else{
					tempFileName = nameValue;
				}
			}
		}
		let tempName = tempFileName || `${moment(new Date()).format('YYYYMMDDHHmmss')}.xls`;
		const blob = new Blob([content]);
		const fileName = tempName;
		const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
		let elink = document.createElement('a');
		if ('download' in elink) {
			elink.download = fileName;
			elink.style.display = 'none';
			elink.href = selfURL['createObjectURL'](blob);
			document.body.appendChild(elink);

			// 触发链接
			elink.click();
			selfURL.revokeObjectURL(elink.href);
			document.body.removeChild(elink)
		} else {
			navigator.msSaveBlob(blob, fileName);
		}
	}
};

/**
 * 上传excel 到后端，通过post方式
 * grayscale 灰度引流的标识请求头，默认为false
 */
export function importExcelPost(url, data,string,grayscale = false, noKey) {//string为error,需要错误的结果，为success需要正确结果
	let locale = iSRM_locale() ||'zh_CN';
	let  customId= iSRM_userLoginName() ||'';
	if(grayscale){
		customId = 'gray_cluster';
	}
	let pageCode = getPageCode()
	return axios({
		method: 'post',
		url: url,
		data: data,
		catch:false,
		processData:false,
		contentType:false,
		headers:{
			'X-Lang-Id':locale,
			'X-custom-Id':customId,
			'X-ISRM-UPP-RESOURCE': pageCode
		}
	}).then((res) => {
		let type = res.headers && res.headers['content-type'];
		if(!type.includes('application/json')){
			fileStreamHandling(res);
		}else{
			let { code, bo, other} = res.data||{};
			if(code&&code.code!=='0000'){
				if(code.code === '0002'){ //运保寻源协议导入时，错误信息要以文件的形式导出
					bo && exportExcelPost(`${COMMON_SERVICE_projectapply}/sourcing/projectapply/file/${bo}`, '' , '', true, 'get');
					return ;//不再往下走
				}
				let message = code.msg;
				if(typeof bo === 'string'){
					message = bo;
				}
				if(string==="error"){
					return res;
				}else{
					Error(`${lang.template('UCF_COMMON_00050125')/*导入*/}:${(message)}`);
					return false;
				}
			}else{
				if(string==="success"){
					return bo;
				}else{
					success(lang.template('UCF_COMMON_00050027')/*导入成功*/);
					return true;
				}
			}
		}
	}).catch((err) => {
		errResponseHandle(err, lang.template('UCF_COMMON_00050029')/*导入:接口报错*/)
		return false
	})
}
const httpCode = [401, 306, 403];

// 对接口报错后的状态码统一处理
export function errResponseHandle (err, errMsg) {
	if (err.response && err.response.status == httpCode[0]) {
		Error(err.response.data && err.response.data.msg || lang.template('UCF_COMMON_HAND_00000144'/* 登录信息失效，系统退出，请重新登录 */));
			setTimeout(() => {
				toLoginOut();
			}, 500)
	} else if (err.response && err.response.status == httpCode[1]) {
		Error(lang.template('UCF_COMMON_HAND_00000076'/*登录时间超过8小时，登录信息已失效，请重新登录*/));
			setTimeout(() => {
				toLoginOut();
			}, 500)
	} else if(err.response && err.response.status == httpCode[2]) {
		Error(lang.template('UCF_COMMON_HAND_00000141'/*无此页面权限，请检查或重新登录*/));
  } else {
		console.log(errMsg, err);
		Error(errMsg);
	}
}
/**
 *
 * @description 树节点添加子数据
 * @export
 * @param {array} [parentArray=[]]
 * @param {array} [childArray=[]]
 * @returns
 */
export function addChild(parentArray = [], childArray = []) {

	let parentLen = parentArray.length;
	if (parentLen == 0 || childArray.length == 0) {
		return [];
	}
	let parentId = childArray[0].parentId;

	for (let i = 0; i < parentLen; i++) {
		let item = parentArray[i];
		if (item.id === parentId) {
			item['isSon'] = 2;
			let newChildren = [];
			if (Array.isArray(item['children'])) {
				let isObtain = item['children'].some(item => {
					return item['id'] == (childArray.length && childArray[0]['id']);
				});

				if (!isObtain) {
					newChildren = deepClone(item['children']).concat(childArray);
				} else {
					newChildren = deepClone(item['children']);
				}

			} else {
				newChildren = childArray;
			}
			/* let newChildren = (typeof item['children'] === 'undefined' && !item['children']) ? childArray : deepClone(item['children']).concat(childArray);
			item['children'] = newChildren; */
			item['children'] = newChildren;
			break;
		} else {
			let temp = item['children'];
			if (typeof temp !== 'undefined' && Array.isArray(temp) && temp.length) {
				console.log("item['children']", item['children']);
				setTimeout(function () {
					addChild(item['children'], childArray);
				}, 0);

			}
		}
	}

	return parentArray;
}

// 处理子节点,type为0 表示查找; type为1 表示删除
export function handleChild(parentArray, child, type) {
	let parentLen = parentArray.length,
		resChild = {};
	// isDelete = false;

	for (let i = 0; i < parentLen; i++) {
		let item = parentArray[i];
		if (item.id == child.id) {
			if (type === 0) {
				resChild = item;
				return resChild;
			} else {
				parentArray.splice(i, 1);
				return true;
			}
		} else {
			if (typeof item['children'] !== 'undefined') {
				resChild = handleChild(item['children'], child, type);

				// 查找节点
				if (type == 0 && (Object.keys(resChild).length > 0)) {
					return resChild;
				}

				if (type === 1 && typeof resChild === 'boolean' && resChild) {
					if (!item['children'].length) {
						item['isSon'] = 1;
					}
				}

			}
		}
	}

	return resChild;
}

//获取数据类型
export function getType(obj){
	var toString = Object.prototype.toString;
	var map = {
		'[object Boolean]'  : 'boolean',
		'[object Number]'   : 'number',
		'[object String]'   : 'string',
		'[object Function]' : 'function',
		'[object Array]'    : 'array',
		'[object Date]'     : 'date',
		'[object RegExp]'   : 'regExp',
		'[object Undefined]': 'undefined',
		'[object Null]'     : 'null',
		'[object Object]'   : 'object'
	};
	return map[toString.call(obj)];
}

//深度合并两个对象，或数组
export function merge(data1, data2){

	if(getType(data1) != getType(data2)){
		return ;
	}
	return Object.assign(data1, data2)
}

// 克隆对象或数组
export function deepClone(data) {
	let type = getType(data);
	var obj;
	if(type === 'array'){
		obj = [];
	} else if(type === 'object'){
		obj = {};
	} else {
		//不再具有下一层次
		return data;
	}
	if(type === 'array'){
		for(var i = 0, len = data.length; i < len; i++){
			obj.push(deepClone(data[i]));
		}
	} else if(type === 'object'){
		for(var key in data){
			obj[key] = deepClone(data[key]);
		}
	}
	return obj;
}

/**
 * 后端数据附加key
 * @param {*} arrayobject
 */
export function resultDataAdditional(arrayobject) {
	if (Array.isArray(arrayobject)) {
		return Array.from(arrayobject, (x, i) => ({...x, key: i}))

	} else {
		return [];
	}
}


/**
 * 深度 obj 合并
 * const a = {a: 1, b: 2, c: 3, d: {key: 2, value: 4}, e: [1, 2, 3]};
 * const b = {a: 3, d: {key:4}, e: [4, 5]};
 * 1. 如果值为{},则覆盖
 * 2. 如果数组全覆盖
 * 3 否则深度
 * @param def
 * @param obj
 * @returns {*}
 */
export function deepAssign(preData, nextData) {
	for (const preKey in preData) {
		const preChildrenKeys = Object.keys(preData[preKey]);
		let nextChildrenKeys = 0;
		if (nextData[preKey] && !Array.isArray(preData[preKey])) {
			nextChildrenKeys = Object.keys(nextData[preKey]);
		}
		if (preChildrenKeys.length > 0 && nextChildrenKeys.length > 0) {
			deepAssign(preData[preKey], nextData[preKey]);
		} else {
			const tempNextValue = nextData[preKey];
			if (tempNextValue !== undefined) {
				preData[preKey] = tempNextValue;
			}
		}
	}
	return preData;
}

/**
 * 对请求回来带有分页的数据 解构，拼装
 * @param obj
 * @param param
 * @returns {{list: *, pageIndex: *, totalPages: *, total: *, pageSize: *}}
 */
export function structureObj(obj, param) {
	const {content, number, totalPages, totalElements, size} = obj;
	let {pageSize} = param;
	if (!pageSize) {
		pageSize = size;
	}
	return {
		list: content,
		pageIndex: number + 1,
		totalPages: totalPages,
		total: totalElements,
		pageSize,// 结构请求的pageSize,
	};

}

/**
 * 初始化 state 里的带有分页的 obj
 * @param obj
 * @returns {{list: Array, pageIndex: number, totalPages: number, total: number, pageSize: *}}
 */
export function initStateObj(obj) {
	const {pageSize} = obj;
	return {
		list: [],
		pageIndex: 0,
		totalPages: 0,
		total: 0,
		pageSize,
	};

}


export function clearTrimObj(data) {
	for (const key in data) {
		const keys = Object.keys(data[key]);
		if (keys.length > 0) {
			if (Array.isArray(data[key])) {
				for (const [index, ele] of data[key].entries()) {
					if (typeof ele === 'object') {
						clearTrimObj(ele);
					} else {
						data[key][index] = ele.trim();
					}
				}
			} else {
				clearTrimObj(data[key]);
			}

		} else {
			data[key] = data[key].trim();
		}
	}
	return data;
}


/**
 * 获得按钮切换状态
 *
 * @param {string} action 按钮类型
 * @param {string} status 按钮状态
 * @returns Object
 */
export function getButtonStatus(action, status) {
	let enabledObj = {};
	switch (status) {
		case 'view':
			enabledObj = {
				add: false,
				edit: false,
				del: false,
				down: false,
				import: false,
				export: false,
				save: true,
				cancel: true
			}

			return enabledObj[action];
		case 'new':
			enabledObj = {
				add: false,
				edit: true,
				del: true,
				down: true,
				import: true,
				export: true,
				save: false,
				cancel: false
			}
			return enabledObj[action];
		case 'edit':
			enabledObj = {
				add: true,
				edit: true,
				del: true,
				down: true,
				import: true,
				export: true,
				save: false,
				cancel: false
			}
			return enabledObj[action];
		default:
			break;
	}
}


/**
 * 过滤脏数据按照|分割的字段
 *
 * @param {object} data
 * @returns
 */
export function filterDataParam(data) {
	let keys = Object.keys(data);
	let values = Object.values(data);
	let arr = [];
	for (let i = 0; i < keys.length; i++) {
		if (keys[i].indexOf('|') > -1) {
			let _key = keys[i].split('|')[0];//字段
			let _index = keys[i].split('|')[1];//当前对象索引
			let _value = values[i];//值
			if (typeof arr[_index] != 'object') {
				arr[_index] = {};
			}
			arr[_index][_key] = _value;
		}
	}
	return arr;
}

/**
 * 删除指定的key数据
 * @param {array} keyData - 选择的数组对象包含key
 * @param {array} res - 系统默认的list数据
 * @returns {array} - 处理后的数组对象数据，用于表数据
 */
export function delArrayByKey(keyData, res) {
	for (let keyItem of keyData) {
		for (let [index, ele] of res.entries()) {
			if (keyItem.key === ele.key) {
				res.splice(index, 1);
				break
			}
		}
	}
	return res;
}


/** 将新数组对象与旧数组相同对象删除
 * @param {array} arrayOld 旧数组对象
 * @param {array} arrayNew 新数组对象
 * @param {string} key  关联字段
 */
export function delListObj(arrayOld, arrayNew, key) {
	if (arrayNew.length === 0) { // 如果新数组为空 直接返回
		return arrayOld;
	}
	for (const eleNew of arrayNew) { // 将新数组对象与旧数组对象合并
		for (const [indexOld, eleOld] of arrayOld.entries()) { //
			if (eleOld[key] === eleNew[key]) {
				arrayOld.splice(indexOld, 1);
				break;
			}
		}
	}
	return arrayOld;

}


/** 将新数组对象与旧数组对象合并
 * @param {array} arrayOld 旧数组对象
 * @param {array} arrayNew 新数组对象
 * @param {string} key  关联字段
 */
export function mergeListObj(arrayOld, arrayNew, key) {
	if (arrayOld.length === 0) { // 如果old数组为空 直接返回
		return arrayNew;
	}
	for (const eleNew of arrayNew) { // 将新数组对象与旧数组对象合并
		let isHas = true;
		for (const [indexOld, eleOld] of arrayOld.entries()) { //
			if (eleOld[key] == eleNew[key]) {
				arrayOld[indexOld] = eleNew;
				isHas = false;
				break;
			}
		}
		if (isHas) {  // 旧数组没有找到
			arrayOld.push(eleNew);
		}

	}
	return arrayOld;
}


/**
 * @description 根据页面视口区域高度计算表格高度，以确定什么时候出滚动条
 * @returns {Number} height表格内容区高度
 */
export function getHeight() {
	let clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight),
		scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	let showHeight = (clientHeight < scrollHeight) && clientHeight || scrollHeight;
	return showHeight;
}


/**
 *
 * @description 排序属性设置
 * @export
 * @param {*} sortParam 排序参数对象数组
 * @returns {Array} 返回排序属性
 */
export function getSortMap(sortParam){
	// 升排序
	const orderSortParam = sortParam.sort((a, b) => {
		return a["orderNum"] - b["orderNum"];
	})
	let sortMap = [];
	sortMap = orderSortParam.map((sortItem, index) => {
		const {order, field} = sortItem,
			tempObj = {}; // order 排序方式，field排序字段
		const direction = (order === 'ascend' ? "ASC" : "DESC"); //  前后端约定
		let property = field;
		if (field.includes("EnumValue")) {
			property = field.replace("EnumValue", ''); //去掉枚举尾标记，前后端约定
		}
		tempObj[property] = direction;
		return tempObj;
	})
	return sortMap;
}

/**
 *@description 获取分页数据
 *
 * @param {*} value
 * @param {*} type type为0标识为pageIndex,为1标识pageSize
 */
export function getPageParam (value, type,pageParams){
	let { pageIndex, pageSize } = pageParams;
	if (type === 0) {
		pageIndex = value - 1;
	} else {
		pageSize = value.toLowerCase() !== 'all' && value || 1;
		pageIndex = 0;
	}
	return { pageIndex, pageSize }

}

/**
 *@description 字符串替换
 *
 * @param {*} str 替换的模板
 * @param {*} data 需要替换的数据
 */
export function stringFormat(str,data) {
	if(!data) return '';
	let keys = Object.keys(data);
	keys.forEach(key=>{
		let reg = new RegExp("({" + key + "})", "g");
		str = str.replace(reg, data[key]);
	});
	return str;
}

/**
 *@description 将类别数组转化成树
 *
 * @param {*} list 类别数组
 */
export function classListToTree(list){
	let first=[],second =[],third=[]
	list.map(i=>{
		i.id=i.classNo
		i.value=i.name
		if(i.smallNo=='00'&& i.subSmallNo=='00'){
			first.push(i)
		}else if(i.smallNo!='00'&& i.subSmallNo=='00'){
			second.push(i)
		}else{
			third.push(i)
		}
	})
	second.map(s=>{
		let children=third.filter(t=>t.masterNo==s.masterNo&&t.smallNo==s.smallNo)
		s.children=children;
		return s;
	})
	first.map(f=>{
		let children=second.filter(t=>t.masterNo==f.masterNo)
		f.children=children;
		return f;
	})
	return first;
}

/**
 * 在平台打开新页签  格式化url
 * @param item
 * @returns {string}
 */
export function formatUrl(item) {// 格式化url format
	let uri = " ";
	if (item.urltype === 'url') {
		uri = item.location;
		if(uri.indexOf('?')!==-1){
			uri+="&modulefrom=sidebar";
		}else{
			uri+="?modulefrom=sidebar"
		}
		return  uri;
	} else if (item.urltype === 'plugin') {
		// uri = item.funcCode ? ('#/' + item.funcCode) : "#/index_plugin";
		// uri = `${GROBAL_WBALONE_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html'+uri));
		// if(uri.indexOf('?')!==-1){
		//     uri+="&modulefrom=sidebar";
		// }else{
		//     uri+="?modulefrom=sidebar"
		// }
		// return  uri;
	} else if (item.urltype === 'view') {
		// uri = item.location;
		// uri= uri.replace("#", "/");
		// if(uri[0]==='/'){
		//     uri = "/sidebar"+uri;
		// }else{
		//     uri = "/sidebar/"+uri;
		// }
		// if(uri.indexOf('?')!==-1){
		//     uri+="&modulefrom=sidebar";
		// }else{
		//     uri+="?modulefrom=sidebar"
		// }
		// return `${GROBAL_WBALONE_HTTP_CTX}/`+'index-view.html#'+uri;
	}else if(item.urltype === undefined){
		item.location = '404';
		return  '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
	}
	else {
		return item.location;
	}
}

/**
 * 打开新的tab页签
 * @param item
 * createTab 这个方法打开时。title的取值情况如下“
 * 中文环境下取title
 * 英文环境下取title2
 * 繁体中文环境下取title3
 */
export function openmenuClick(item){   //打开新页签点击方法
	let url = formatUrl(item); //调用url格式化方法
	window.top.createTab && window.top.createTab({  //window.top.createTab 框架中打开新页签的方法
		title:item.title,
		id: item.id,
		router: url,
		title2: item.enTitle || item.title,//enTitle 是英文标题，当没有英文标题时取中文标题
		title3: item.title,
		title4: item.name4,
		title5: item.name5,
		title6: item.name6,
	})

}

// 判断 字符串 是否为 JSON 字符串
export const isJsonString = (str) => {
	try {
		if (typeof JSON.parse(str) === "object") {
			return true;
		}
	} catch (e) {
	}
	return false;
}

// 在数组arr中 间隔插入元素el --- code by Bulin.zhang(xishuiofchina@163.com)
export const arrIntervalInsert = (arr, el) => {
	if (Array.isArray(arr) && arr.length > 1) {
		const total = arr.length * 2 - 1;
		const arrTemp = [];
		for (let index = 1; index < total; index++) {
			if (index % 2 > 0) arrTemp.push(index)
		};
		arrTemp.forEach(num => arr.splice(num, 0, el));

	}
	return arr;
}

/*根据传入的列信息取出当前显示的列,并且以字符串数组的形式返回*/
export function getCurrentColumns(columns =[]){
	let currentColumns = [];
	for(let i=0,len=columns.length||0;i<len;i++){
		if(columns[i].ifshow !== false){
			currentColumns.push(columns[i].dataIndex);
		}
	}
	return currentColumns;
}


/**
 * 根据屏幕可视区域调整当前列表的垂直高度,或者计算出显示几行
 * @param hasOperationButton  是否有表格操作按钮
 * @returns {Number|number}  返回垂直高度
 */
export const listByViewHieight= (hasOperationButton= false)=>{
	let viewHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);//网页内容可视区域
	let searchAreaHeight = document.getElementById('search-panel') && document.getElementById('search-panel').offsetHeight ;
	if(searchAreaHeight && viewHeight){
		if(hasOperationButton){ //表格有操作按钮
			return (viewHeight - searchAreaHeight - 190) < 300 ? 300 : (viewHeight - searchAreaHeight - 190); // 为了用户能查看更多数据，最小高度300
		}else{
			return (viewHeight - searchAreaHeight - 140) < 300 ? 300 : (viewHeight - searchAreaHeight - 140);// 为了用户能查看更多数据，最小高度300
		}

	}
	return 300;
}

//专用于多语  将ucf-common下的多语和工程本身的多语合并
export const multilingualObj = (proLang={},commonLang={})=>{
	let multilingualObj = {};
	multilingualObj.zhcn = Object.assign(proLang.zhcn,commonLang.zhcn);
	multilingualObj.enus = Object.assign(proLang.enus,commonLang.enus);
	return multilingualObj;
}

/**
 * 处理精度缺失的问题
 * @param number ，要处理精度的数字
 * @param digit  要处理数据的幂，如：5^2
 * @returns {number}
 */
export const formatFloat = function(number,digit = 6) {
	let tempNumber = Number(number);
	let m = Math.pow(10,digit);
	return Math.round(tempNumber*m)/m
}


/**
 * 获取数据，进行前端分页
 * @param pageSize 一页显示几条
 * @param pageIndex 第几页
 * @param data 原始数据
 */
export const frontendPaging = function (pageSize = 10,pageIndex = 1,data = []){
	let pageData = [];
	let total = data.length||0;
	let pages = pageSize>0?Math.ceil(total/pageSize):0;//向上取整
	let start = (pageSize * pageIndex) - pageSize; //从第几条开发
	let end = pageSize * pageIndex; //到第几条结束
	end = end > total?total:end;
	for(let i = start;i < end;i++){
		pageData.push(data[i]);
	}
	return {pageSize,pageIndex,pageData,total,pages}
}


/**
 * 前台数值保留位数（默认为空）
 * @param text 要处理的数值
 * @param num  要保留的位数
 * @returns {number}
 */
export const amountToFixedEmpty = function(text='',num=0) {
	return (text&&Number(text).toFixed(num)) || (text==0?Number(0).toFixed(num):'')
}


/**
 * 批量代码查询条件校验
 * 位数
 * 替换空格和中文逗号
 * @param 字段名称
 * @param value 输入的值
 * @param len 代码长度位数
 * 返回数组
 */
export const batchCodeCheck = function(colName,value,len){
	let tempValue = value&&value.trim().replace(/\s+/g,",");//替换空格为逗号
	tempValue = tempValue.replace(/，/ig,',');//中文逗号转英文逗号
	let items =  tempValue&&tempValue.split(',')||[];
	items = Array.from(new Set(items));
	items = items.filter((item)=> item.length>0);
	let itemArr = [];//保存正确的代码
	let errorArr = [];//保存错误的代码
	if(items && items.length>0){
		items.forEach((item)=>{
			if(item.length == len){
				itemArr.push(item);
			}else{
				errorArr.push(item);
			}
		});
	}
	if(errorArr.length>0){
		Error(`${colName} ${lang.template('UCF_COMMON_HAND_00000095')/*输入错误*/}. 
		${lang.template('UCF_COMMON_HAND_00000096')/*请输入*/}${len}${lang.template('UCF_COMMON_HAND_00000097')/*位*/}${colName}. 
		${lang.template('UCF_COMMON_HAND_00000098')/*如有多个请使用英文逗号分隔*/}`
		,10);
		return false;
	}
	return itemArr;
}


const message = SendMessage.create({
	// 消息来源域校验
	originCheck(origin) {
		return origin && origin.indexOf('zte.com.cn') > -1 && origin !== window.location.origin;
	}
});
export function getMessage() {
	return message;
}

/**
 *  判断是否在门户中打开
 */
export function isBoBase() {
	return window.location.search.includes('serviceName=boBase') || window.parent[0]?.location?.search.includes('serviceName=boBase') || window.location.hash.includes('serviceName=boBase');
}

/**
 * openmenuClick---历史方法
 * openMenu---打开新的tab页签-菜单
 * openTabClick---打开新的tab页签-绝对地址
 * params.appCode 应用编码，为空默认为当前应用
 * params.pageCode 表单编码
 * params.query 路由参数
 * params.url 门户的入参需要打开的绝对地址（一般为外系统链接）
 * params.location 系统的相对地址（采购系统页面地址）
 * params.iSRM_type 判断是跳详情（info）还是菜单（menu）
 * params.iSRM_cover 上一个页面是否需要重新加载，true为需要
 * 
 */
export function iSRM_openPage(params = {}){
	if (isBoBase()) {
		// 门户打开新页签的方法
		const locale = iSRM_locale();
		// 跳详情
		if(params.iSRM_type === 'info'){
			const origin = window.location.origin
			message.emit('open', {
				type: 'link',
				appCode: supplier? 'ztea_iSRMW_external':'ztea_iSRM',
				code: params.code||"",//'唯一编码，非必须，有值的话先判断是否已经打开过，如果已经打开，则切换到打开的页签，否则打开url对应页面',
				name: locale === 'zh_CN' ? params.title : params.enTitle || params.title,
				cover: typeof (params.iSRM_cover) === 'boolean'? params.iSRM_cover: true,//非必须，iSRM_cover为true时且指定了code，会自动替换原打开的code页签并切换刷新
				url: params.url||`${origin}${params.location}`,
			})
		} else {
			message.emit('open', {
				type: 'page',
				appCode: supplier? 'ztea_iSRMW_external':'ztea_iSRM',
				pageCode: supplier? 'ztef_iSRMG_'+params.pageCode:'ztef_iSRMC_'+params.pageCode,
				cover: typeof (params.iSRM_cover) === 'boolean'? params.iSRM_cover: true, // 非必须，iSRM_cover为true时，相同应用、页面编码，会自动替换并刷新原页签
				query: params.query || {} // 路由参数，会加到地址后面，跟vue-router的query一致
			})
		}
	} else {
		// iuap门户打开新页面的方法
		let url = formatUrl(params); //调用url格式化方法
		window.top.createTab && window.top.createTab({  //window.top.createTab 框架中打开新页签的方法
			title:params.title,
			id: params.id,
			router: url,
			title2: params.enTitle || params.title,//enTitle 是英文标题，当没有英文标题时取中文标题
			title3: params.title,
			title4: params.name4,
			title5: params.name5,
			title6: params.name6,
		})
	}
}
/**
 * 打开新的tab页签-菜单
 * @param openmenu
 * appCode 应用编码，为空默认为当前应用
 * pageCode 表单编码
 * query 路由参数
 */
export function openMenu(openmenu) {   //打开新页签-菜单
	message.emit('open', {
		type: 'page',
		appCode: supplier? 'ztea_iSRMW_external':'ztea_iSRM',
		pageCode: supplier? 'ztef_iSRMG_'+openmenu.pageCode:'ztef_iSRMC_'+openmenu.pageCode,
		cover: typeof (openmenu.cover) === 'boolean'? openmenu.cover: true, // 非必须，cover为true时，相同应用、页面编码，会自动替换并刷新原页签
		query: openmenu.query || {} // 路由参数，会加到地址后面，跟vue-router的query一致
	})
}
/**
 * 打开新的tab页签-绝对地址
 * @param opentab
 * name 页签名称取值情况如下
 *  英文环境下取enTitle
 *  英文环境下取enTitle
 * url 要打开的绝对地址
 */
export function openTabClick(opentab) {   //打开新页签-绝对地址
	const locale = iSRM_locale();
	const origin = window.location.origin
	const pageCode = opentab.pageCode || getPageCode()
	let uri = opentab.url || `${origin}${opentab.location}`
	if(uri.indexOf('?')!==-1){
		uri+=`&pageCode=${pageCode}`;
	}else{
		uri+=`?pageCode=${pageCode}`
	}
	message.emit('open', {
		type: 'link',
		appCode: supplier? 'ztea_iSRMW_external':'ztea_iSRM',
		code: opentab.code || opentab.id || "",//'唯一编码，非必须，有值的话先判断是否已经打开过，如果已经打开，则切换到打开的页签，否则打开url对应页面',
		name: locale === 'zh_CN' ? opentab.title : opentab.enTitle || opentab.title,
		cover: typeof (opentab.cover) === 'boolean'? opentab.cover: true,//非必须，cover为true时且指定了code，会自动替换原打开的code页签并切换刷新
		url: uri,
	})
}
/**
 * 关闭当前页面
 * @param 
 */
export function closeTab() {   //关闭当前页面
	message.emit('close')
}

/**
 * 获取当前页面的表单编码
 * @param
 */
export function getPageCode() {
	try{
		if (!isBoBase() && window.document.referrer.indexOf('wbalone') === -1) {
			return 'iSRM';//单点登录
		}
	  let search = "?" +  window.location.hash.split("?")[1]
		let searchObj = queryString.parse(search)
		return searchObj.pageCode || "iSRM"
	} catch (e) {
		console.log("pageCode error", e)
		return 'iSRM'
	}
}


export const checkCookies = () => {
	const uacAuth = getCookie('UCSLoginName') || getCookie('PORTALSSOUser') || getCookie('ZTEDPGSSOUser') || '';
	const ucsAuth = getCookie('UCSSSOToken') || getCookie('PORTALSSOCookie') || getCookie('ZTEDPGSSOCookie') || '';
	// , 'i18next', 'sessionid'  过几分钟会消失
	// let iuapCookies = ['_A_P_integration', '_A_P_userAvator', '_A_P_userId', '_A_P_userLoginName', '_A_P_userName', '_A_P_userType', '_TH_',
	// 	'default_serial', 'iscpToSccToken', 'locale_serial', 'loginChannel', 'tenantid', 'typeAlias', 'u_locale',
	// 	'u_logints', 'u_usercode', 'userId', 'userType'
	// ];
	let iuapCookies = ['_A_P_integration', '_A_P_userAvator', '_A_P_userId', '_A_P_userLoginName', '_A_P_userName', '_A_P_userType'];
	// 通过document.cookie获取不到以下两个值
	// ,'portalid' ,'token'
	let iuapCookieFlag = true;//默认有友互通的相关cookie
	let errorType = "";
	if (document.cookie && document.cookie !== '') {
		let cookies = document.cookie.split(';');
		if (cookies.length < iuapCookies.length) {//cookie 个数不够
			iuapCookieFlag = false;
			errorType = 1;
		} else {
			//问题在于，cookie 里的name 也要一一和iuapCookies 对的上才可以
			let documentCookie = [];
			for (let i = 0; i < cookies.length; i++) {
				let cookie = cookies[i].trim();
				let cookieArr = cookie && cookie.split('=') || [];
				if (cookieArr && cookieArr.length > 0) {
					documentCookie.push(cookieArr[0]);
				}
			}
			// iuapCokkies单个判断是否存在cookie中
			for (let i = 0, len = iuapCookies.length; i < len; i++) {
				if (!documentCookie.includes(iuapCookies[i])) {
					iuapCookieFlag = false;
					errorType = 2;
					break;
				}
			}
			// cookie的key存在，判断浏览器中cookie值是否为空
			if (iuapCookieFlag) {
				for (let i = 0; i < cookies.length; i++) {
					let cookie = cookies[i].trim();
					let cookieArr = cookie && cookie.split('=') || [];
					if (cookieArr && cookieArr.length > 0 && iuapCookies.includes(cookieArr[0]) && !cookieArr[1]) {
						iuapCookieFlag = false;
						errorType = 3;
						break;
					}
				}
			}
		}
	}
	let hostname = ['iscp.zte.com.cn', 'isrm.zte.com.cn'];
	if(hostname.includes(window.location.hostname) && !iuapCookieFlag){
			window.TINGYUN.ty_track_event('100000452129', 'iSRM_Fe_Error_Event', {
					empNo: iSRM_userLoginName(),
					productname: 'CookieInfo',
					optime: new Date(),
					event_path: window.document.cookie + 'AND' +errorType
			})
	}
	return iuapCookieFlag && Boolean(uacAuth) && Boolean(ucsAuth);
};

export const checkUac = () => {
	const user = getCookie('ZTEDPGSSOUser') || getCookie('PORTALSSOUser') || getCookie('UCSLoginName') || '';
	const token =  getCookie('ZTEDPGSSOCookie') || getCookie('PORTALSSOCookie') || getCookie('UCSSSOToken') || '';
	return Boolean(user) && Boolean(token);
}
export const checkIuap = () => {
	// const user = getCookie('ZTEDPGSSOUser') || getCookie('PORTALSSOUser') || getCookie('UCSLoginName') || '';
	// const token =  getCookie('ZTEDPGSSOCookie') || getCookie('PORTALSSOCookie') || getCookie('UCSSSOToken') || '';
	// let iuapCookies = ['_A_P_integration', '_A_P_userAvator', '_A_P_userId', '_A_P_userLoginName', '_A_P_userName', '_A_P_userType', '_TH_',
	// 	'default_serial', 'i18next', 'iscpToSccToken', 'locale_serial', 'loginChannel', 'sessionid', 'tenantid', 'typeAlias', 'u_locale',
	// 	'u_logints', 'u_usercode', 'userId', 'userType'
	// ];
	let iuapCookies = ['_A_P_integration', '_A_P_userAvator', '_A_P_userId', '_A_P_userLoginName', '_A_P_userName', '_A_P_userType'];
	// 通过document.cookie获取不到以下两个值
	// ,'portalid' ,'token'
	let iuapCookieFlag = true;//默认有友互通的相关cookie
	if (document.cookie && document.cookie !== '') {
		let cookies = document.cookie.split(';');
		if (cookies.length < iuapCookies.length) {//cookie 个数不够
			iuapCookieFlag = false;
		} else {
			//问题在于，cookie 里的name 也要一一和iuapCookies 对的上才可以
			let documentCookie = [];
			for (let i = 0; i < cookies.length; i++) {
				let cookie = cookies[i].trim();
				let cookieArr = cookie && cookie.split('=') || [];
				if (cookieArr && cookieArr.length > 0) {
					documentCookie.push(cookieArr[0]);
				}
			}
			// iuapCokkies单个判断是否存在cookie中
			for (let i = 0, len = iuapCookies.length; i < len; i++) {
				if (!documentCookie.includes(iuapCookies[i])) {
					iuapCookieFlag = false;
					break;
				}
			}
			// cookie的key存在，判断浏览器中cookie值是否为空
			if (iuapCookieFlag) {
				for (let i = 0; i < cookies.length; i++) {
					let cookie = cookies[i].trim();
					let cookieArr = cookie && cookie.split('=') || [];
					if (cookieArr && cookieArr.length > 0 && iuapCookies.includes(cookieArr[0]) && !cookieArr[1]) {
						iuapCookieFlag = false;
						break;
					}
				}
			}
		}
	}
	let hostname = ['iscp.zte.com.cn', 'isrm.zte.com.cn'];
	if(hostname.includes(window.location.hostname) && !iuapCookieFlag){
		window.TINGYUN.ty_track_event('100000452129', 'iSRM_Fe_Error_Event', {
			empNo: iSRM_userLoginName(),
			productname: 'CookieInfo',
			optime: new Date(),
			event_path: window.document.cookie
		})
	}
	return iuapCookieFlag;
};

/**
 * 检查cookie并判断应该跳转到哪个页面
 * 1.判断相关cookie 有没有，没有的话就跳转到登录页面，有的话留在当前页面
 * 2.再判断用户访问的是不是当个页面（排除掉app页面，即既不是wbalone 也不是app页面）,不是单个页面不用操作
 */
 export const routerRedirect = async () => {
	let host = window.location.hostname;
	if (host === 'iscp.zte.com.cn') {
		routerRedirectWithProd();
	} else {
		routerRedirectWithUat();
	}
};

export const routerRedirectWithProd = async () => {
	let host = window.location.hostname;//获取主机名，不含端口号
	let href = window.location.href;
	let pathname = window.location.pathname;
	let hash = window.location.hash || '';
	if (href.indexOf('wbalone') === -1 && !(isBoBase() || window.top.closeWin) && href.indexOf('zte-scm-iscp-base-fe/app') === -1) {  //访问单个页面且未登录 并且访问的不是开发环境和本地环境
		if (checkUac()) {
			if (!checkIuap()) {
				window.location.href = `${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=uac&toiSRMUrl=${pathname}${hash}`;
				return false;
			} else {
				window.location.href = `${pathname}${hash}`;
				return false;
			}
		} else {
			// 增加是否供应商判断
			let isSupplier = iSRM_tenantid() && iSRM_tenantid() !== "ifckxwyk";
			if (isSupplier) {
				window.top.location.href = `${domainName.sccUrl}`;
			} else {
				window.location.href = `${domainName.Uac}/portal/login.html?businessSystemCode=100000452129&url=${encodeURIComponent(`${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=uac&toiSRMUrl=${pathname}${hash}`)}`;
			}
		}
		return false;

	}
	return true;
};
export const routerRedirectWithUat = async () => {
	let flag = checkCookies();
	let host = window.location.hostname;//获取主机名，不含端口号
	let href = window.location.href;
	let hostArr = ['iscp.zte.com.cn', 'uat.iscp.zte.com.cn', 'test.iscp.zte.com.cn'];
	if (href.indexOf('wbalone') === -1 && hostArr.includes(host) && !(isBoBase() || window.top.closeWin) && !flag) {  //访问单个页面且未登录 并且访问的不是开发环境和本地环境
		if (href.indexOf('zte-scm-iscp-base-fe/app') === -1) { //访问的是非首页
			//在此清空 cookie?
			let UCSCookie = [
				'UCSLoginName',
				'UCSLoginTime',
				'UCSSSOAccount',
				'UCSSSOInfo',
				'UCSSSOLanguage',
				'UCSSSOToken',
				'UCSSSOUser'
			]
			for (let i = 0; i < UCSCookie.length; i++) {
				if (getCookie(UCSCookie[i])) {
					delCookie(UCSCookie[i])
				}
			}
			let pathname = window.location.pathname;
			let hash = window.location.hash || '';
			switch (host) {
				case 'iscp.zte.com.cn':
					window.location.href = `${domainName.Ucs}/uc/10001/login?source=10008&backurl=${encodeURIComponent(`${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=zteuser&toiSRMUrl=${pathname}${hash}`)}`;
					break;
				case 'uat.iscp.zte.com.cn':
					window.location.href = `${domainName.uatUcs}/uc/10001/login?source=10058&backurl=${encodeURIComponent(`${domainName.uatIscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=zteuser&toiSRMUrl=${pathname}${hash}`)}`;
					break;
				case 'test.iscp.zte.com.cn':
					window.location.href = `${domainName.testUcs}/uc/10001/login?source=10058&backurl=${encodeURIComponent(`${domainName.testIscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=zteuser&toiSRMUrl=${pathname}${hash}`)}`;
					break;
			}
			return false;
		}

	}
	return true;
}
// 获取门户id(portalId) 
export function getPortalId() {
	let parentUrl = window.document.referrer
	console.log('埋点parentUrl', parentUrl)
    let portalId = '7665419869850600514'
    // 生产环境采方
    if (parentUrl && (parentUrl.indexOf('/iscp.zte.com.cn') > -1)) {
	  portalId = '7791533280263963061'
    }
    // 生产环境供方
    if (parentUrl && (parentUrl.indexOf('/isrm.zte.com.cn') > -1)) {
	  portalId = '6548569287267448304'
    }
    // 验收环境采方
    if (parentUrl && (parentUrl.indexOf('/iscp.uat.zte.com.cn') > -1)) {
	  portalId = '828995132871614899'
    }
    // 验收环境供方
    if (parentUrl && (parentUrl.indexOf('/isrm.uat.zte.com.cn') > -1)) {
		portalId = '1720674371309031589'
    }
    // 测试环境
    if (parentUrl && (parentUrl.indexOf('/isrm.test.zte.com.cn') > -1)) {
		portalId = '6728678515646009381'
    }
    // 开发环境
    if (parentUrl && (parentUrl.indexOf('/isrm.dev.zte.com.cn') > -1)) {
		portalId = '7665419869850600514'
	}
	return portalId
}
// UAC3.0 应用ID 接入评审中心
export function getReviewId () {
	const hostname = window.location.hostname
	let reviewId = ''
	switch (hostname) {
	  case 'iscp.zte.com.cn':
		// 生产环境
		reviewId = '10008'
		break
	  case 'uat.iscp.zte.com.cn':
		// 验收环境
		reviewId = '830129071712'
		break
	  case 'test.iscp.zte.com.cn':
		// 测试环境
		reviewId = 'iSRM'
		break
	  default:
		reviewId = 'iSRM'
	}
	return reviewId
  }
// 退出登录
export const logOut = () => {
	let UCSCookie = [
		'UCSLoginName',
		'UCSLoginTime',
		'UCSSSOAccount',
		'UCSSSOInfo',
		'UCSSSOLanguage',
		'UCSSSOToken',
		'UCSSSOUser'
	]
	for (let i = 0; i < UCSCookie.length; i++) {
		if (getCookie(UCSCookie[i])) {
			delCookie(UCSCookie[i])
		}
	}
	window.top.location.href = '/wbalone/user/beflogout';
}

export const logOutWithUac = () => {
	let host = window.location.hostname;
	// 生产环境接入UAC
	if (host === 'iscp.zte.com.cn') {
		window.TINGYUN.ty_track_event('100000452129', 'iSRM_Fe_Error_Event', {
				empNo: iSRM_userLoginName(),
				productname: 'iSRM_LogOutUAC',
				optime: new Date(),
				event_path: window.document.cookie
		})
		let isSupplier = iSRM_tenantid() && iSRM_tenantid() !== "ifckxwyk";
		if (isSupplier) {
			//供应商用户，清除iuap cookie，跳转至scc登录页面
			let iuapCookies = ['_A_P_integration', '_A_P_userAvator', '_A_P_userId', '_A_P_userLoginName', '_A_P_userName', '_A_P_userType', '_TH_',
			'default_serial', 'i18next', 'iscpToSccToken', 'locale_serial', 'loginChannel', 'sessionid', 'tenantid', 'typeAlias', 'u_locale',
			'u_logints', 'u_usercode', 'userId', 'userType'];
			for(let i = 0; i < iuapCookies.length; i++) {
				if(getCookie(iuapCookies[i])){
					delCookie(iuapCookies[i], { domain: 'iscp.zte.com.cn' })
				}
			}
			window.top.location.href = `${domainName.sccUrl}`;
		} else {
			// 区分是详情页还是其他
			let href = window.location.href;
			// 详情页面校验失效，登录后返回详情页
			if (href.indexOf('wbalone') === -1 && !(isBoBase() || window.top.closeWin) && href.indexOf('zte-scm-iscp-base-fe/app') === -1) {
				console.log('401-111')
				let pathname = window.location.pathname;
				let hash = window.location.hash || '';
				window.location.href = `${domainName.Uac}/portal/login.html?businessSystemCode=100000452129&url=${encodeURIComponent(`${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=uac&toiSRMUrl=${pathname}${hash}`)}`;
			} else {
				// 其他登录后返回首页
				// window.top.location.href = '/wbalone/user/beflogout';
				window.top.location.href = `${domainName.Uac}/portal/login.html?businessSystemCode=100000452129&url=${encodeURIComponent(`${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=uac`)}`;
			}
		}
	} else {
		if (isBoBase()) {
			// message.emit('logout')
		} else {
			logOut();
		}
	}
}
export const logOutWithIuap = () => {
	let host = window.location.hostname;
	// 生产环境接入UAC
	if (host === 'iscp.zte.com.cn') {
		window.TINGYUN.ty_track_event('100000452129', 'iSRM_Fe_Error_Event', {
				empNo: iSRM_userLoginName(),
				productname: 'iSRM_LogOutIuap',
				optime: new Date(),
				event_path: window.document.cookie
		})
		let isSupplier = iSRM_tenantid() && iSRM_tenantid() !== "ifckxwyk";
		if (isSupplier) {
			//供应商用户，清除iuap cookie，跳转至scc登录页面
			let iuapCookies = ['_A_P_integration', '_A_P_userAvator', '_A_P_userId', '_A_P_userLoginName', '_A_P_userName', '_A_P_userType', '_TH_',
			'default_serial', 'i18next', 'iscpToSccToken', 'locale_serial', 'loginChannel', 'sessionid', 'tenantid', 'typeAlias', 'u_locale',
			'u_logints', 'u_usercode', 'userId', 'userType'];
			for(let i = 0; i < iuapCookies.length; i++) {
				if(getCookie(iuapCookies[i])){
					delCookie(iuapCookies[i], { domain: 'iscp.zte.com.cn' })
				}
			}
			window.top.location.href = `${domainName.sccUrl}`;
		} else {
			// 区分是详情页还是其他
			let href = window.location.href;
			// 详情页面校验失效，登录后返回详情页
			if (href.indexOf('wbalone') === -1 && !(isBoBase() || window.top.closeWin) && href.indexOf('zte-scm-iscp-base-fe/app') === -1) {
				console.log('306-111')
				let pathname = window.location.pathname;
				let hash = window.location.hash || '';
				window.location.href = `${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=uac&toiSRMUrl=${pathname}${hash}`;
			} else {
				// 其他登录后返回首页
				// window.top.location.href = '/wbalone/user/beflogout';
				window.top.location.href = `${domainName.iscp}/wbalone/platform/cas/login?r=L3diYWxvbmUv&disabledlang=true&zteLoginType=uac`;
			}
		}
	} else {
		if (isBoBase()) {
			// message.emit('logout')
		} else {
			logOut();
		}
	}
}
// 单页面登录
export function singlePageLogin() {
	let hostname = window.location.hostname;
	let loginUrl = '';
	switch (hostname) {
		case 'iscp.zte.com.cn':
			loginUrl = `${domainName.Uac}/portal/login.html?businessSystemCode=100000452129&url=${encodeURIComponent(`${window.location.href}`)}`;
			break;
		case 'uat.iscp.zte.com.cn':
			loginUrl = `${domainName.uatUcs}/uc/10001/login?source=10058&backurl=${encodeURIComponent(`${window.location.href}`)}`;
			break;
		default:
			loginUrl = `${domainName.testUcs}/uc/10001/login?source=10058&backurl=${encodeURIComponent(`${window.location.href}`)}`;
	}
	window.location.href = loginUrl;
}

// 退出登录的新逻辑
export function toLoginOut() {
	let ifckxwyk = 'ifckxwyk'
	let cookieArrs = [
		"iSRM_tenantid",
		"iSRM_userId",
		"iSRM_userName",
		"iSRM_userLoginName"
	]

	for (let i = 0; i < cookieArrs.length; i++) {
		if(getCookie(cookieArrs[i])){
			delCookie(cookieArrs[i])
		}
	}
	if(!iSRM_tenantid() || iSRM_tenantid() === ifckxwyk ){
			message.emit('logout')
	}else{
		if(window.document.referrer.indexOf('/isrm.zte.com.cn') > -1){
			window.open(
				domainName.sccUrl
			)
		}else{
			message.emit('logout')
		}
	}
}

/* 项目规模默认审批人数与提交时审批人数核对不一致校验函数
 * @param {*} list 会签审批人信息
 * @param {*} proScale 项目规模字段
 * 函数返回 true 时数量不一致,返回 false 时数量一致
 * 此方法仅用于寻源协议模块
 * 
*/
export const checkGroupInfoNotEqual = (list = [], proScale) => {
	let flag = false, info = `${lang.template("UCF_COMMON_HAND_00000142")/* "缺失审批人信息，请联系HR维护领导层级汇报关系" */}`;
	// 过滤出审批人数据
	list = list.filter(ele => ele.nokey === 'approve');
	let lens = list.length;
	switch (proScale) {
		// 采购小组默认2人
		case 'procurement':
			flag = lens < 2;
			break;
		// PB1 PB3 默认3人
		case 'PB1':
		case 'PB3':
			flag = lens < 3;
			break;
		// PB2默认4人
		case 'PB2':
			flag = lens < 4;
			break;
		default:
			break;
	}
	// 数量不一致时,直接抛出错误信息
	flag && Error(info);

	return flag;
}
