const isFunc = v => typeof v === 'function';
const isPromise = v => typeof v === 'object' && v.__proto__.hasOwnProperty('then');

module.exports = {
	isFunc,
	isPromise
};