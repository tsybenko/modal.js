const { MODE_DEV } = require('../constants');
const isDev = options => options.hasOwnProperty('mode') && options.mode === MODE_DEV;

module.exports = (options = {}) => ({
	name: "logger",

	methods: {
		showModal: function (event, element) {
			if (isDev(options)) {
				console.group('showModal');
				console.log('Event:', typeof event.type !== 'undefined' ? event : 'none');
				console.log('Element:', element);
				console.groupEnd();
			}
		},
		hideModal: function (event, element) {
			if (isDev(options)) {
				console.group('hideModal');
				console.log('Event:', typeof event.type !== 'undefined' ? event : 'none');
				console.log('Element:', element);
				console.groupEnd();
			}
		}
	},
});