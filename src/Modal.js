const utils = require('./utils');

const aria = require('./plugins/aria');
const logger = require('./plugins/logger');

const { MODE_DEV } = require('./constants');

module.exports = (document => function(el, options = {}) {

	this.initedHook = function(cb) {cb()};

	/**
	 * Store of plugins
	 *
	 * @type {Map<any, any>}
	 */
	let plugins = new Map();

	/**
	 * Add plugin into store
	 *
	 * @param plugin
	 * @returns {boolean}
	 */
	this.plug = plugin => {

		if (! plugins.has(plugin.name)) {
			plugins.set(plugin.name, plugin);

			return true;
		}

		return false;
	};

	/**
	 * Will call "methodName" inside of methods of plugins
	 *
	 * @param methodName {string}
	 * @param options {Object}
	 */
	const mapPluginsMethod = (methodName, options) => {
		if (plugins.size > 0) {
			for (let plugin of plugins.values()) {
				if (plugin.hasOwnProperty("methods")) {
					if (plugin.methods.hasOwnProperty(methodName)) {
						plugin.methods[methodName](options.event, options.element);
					}
				}
			}
		}
	};

	this.plug(aria);
	this.plug(logger({ mode: MODE_DEV }));

	/**
	 * Hooks
	 *
	 * @type {{"[ON_CLOSE]": (function(*): *), "[ON_OPEN]": (function(*): *), "[BEFORE_CLOSE]": (function(*): *), "[CLOSED]": (function(*): *), "[OPENED]": (function(*): *), "[BEFORE_OPEN]": (function(*): *)}}
	 */
	const hooks = require('./hooks')(el);

	const events = require('./events');

	/**
	 * Handler of "Escape" keyboard button
	 * @param e {KeyboardEvent}
	 */
	let escHandler = (function(e) {
		if (e.key === "Escape") {
			if (this.isShow()) {
				this.toggleModal(e);
			}
		}
	}).bind(this);

	/**
	 * Listener of "Escape" keyboard button
	 */
	document.addEventListener('keyup', event => escHandler.call(this, event));

	/**
	 * Triggers
	 *
	 * @type {Array}
	 */
	this.triggers = (options.hasOwnProperty('triggers'))
		? [...options.triggers]
		: [];

	/**
	 * Check is modal hidden
	 *
	 * @returns {boolean}
	 */
	this.isHidden = function() {
		return el.style.visibility === 'hidden';
	};

	/**
	 * Check is modal shows
	 * Based on "isHidden" method, returns reversed result of "isHidden"
	 *
	 * @returns {boolean}
	 */
	this.isShow = function() {
		return !this.isHidden();
	};

	/**
	 * Handler of modal window opening, contains the logic of how it should be
	 */
	let showModalHanlder = function() {
		el.style.visibility = 'visible';

		if (!el.classList.contains('opened')) {
			el.classList.add('opened');
		}
	};

	/**
	 * Show modal window
	 */
	this.showModal = function showModal(e) {

		if (typeof e === 'undefined') e = {};

		el.dispatchEvent(events.beforeOpen(e));

		if (el.dispatchEvent(events.onOpen(e))) {

			showModalHanlder();

			mapPluginsMethod('showModal', { event: e, element: el });

			el.dispatchEvent(events.opened(e));
		}
	};

	/**
	 * Handler of modal window closing, contains the logic of how it should be
	 */
	let hideModalHandler = function() {
		el.style.visibility = 'hidden';

		if (el.classList.contains('opened')) {
			el.classList.remove('opened');
		}
	};

	/**
	 * Hide modal window
	 */
	this.hideModal = function hideModal(e) {

		if (typeof e === 'undefined') e = {};

		el.dispatchEvent(events.beforeClose(e));

		if (el.dispatchEvent(events.onClose(e))) {

			hideModalHandler();

			mapPluginsMethod('hideModal', { event: e, element: el });

			el.dispatchEvent(events.closed(e));
		}
	};

	/**
	 * Opens the modal window
	 *
	 * @param before {function} - callback, will be called before modal window will be opened
	 * @param after {function} - callback, will be called after modal window will be opened
	 */
	this.open = function open(before, after) {
		if (utils.isFunc(before)) {
			before(this, el, this.showModal);

			if (utils.isFunc(after)) {
				after(this, el, this.hideModal);
			}
		} else {
			this.showModal();
		}
	};

	/**
	 * Toggle modal window
	 */
	this.toggleModal = function toggleModal(e) {
		this.isHidden() === true
			? this.showModal(e)
			: this.hideModal(e);
	};

	/**
	 * Hides modal when instance was initialised
	 */
	this.initedHook((function() {
		hideModalHandler();
	}).bind(this));


	/**
	 * Handler that will be assigned to a trigger
	 */
	this.handleTrigger = (function(e) {
		this.toggleModal(e);
	}).bind(this);

	/**
	 * Sets HTMLDOMElement "el" with event type of eventName as a trigger of toggle method
	 *
	 * @param el {HTMLElement}
	 * @param eventName {String}
	 * @returns {boolean}
	 */
	this.addTrigger = function addTrigger(el, eventName) {
		if (! this.triggers.includes(el)) {
			this.triggers.push({ element: el, eventType: eventName });
			el.addEventListener(eventName, this.handleTrigger);
			return true;
		}
		return false;
	};

	const mapTriggers = (function() {
		this.triggers.map(trigger => this.addTrigger(trigger.element, trigger.eventType));
	}).bind(this);

	mapTriggers();

	/** Default trigger */
	this.addTrigger(el.querySelector('.btn-close'), 'click');
	this.addTrigger(el.querySelector('.modal__background'), 'click');

	// for (let [key] of Object.entries(events)) {
	// 	this[`${key}`] = handler => el.addEventListener('key', event => handler(event));
	// }

	/**
	 * Will call handler "handler" before modal window will be opened
	 *
	 * @param handler {Function}
	 */
	this.beforeOpen = hooks.beforeOpen;

	/**
	 * Will call handler "handler" right in moment before modal window will be opened
	 *
	 * @param handler {Function}
	 */
	this.onOpen = hooks.onOpen;

	/**
	 * Will call handler "handler" after modal window was opened
	 *
	 * @param handler {Function}
	 */
	this.opened = hooks.opened;

	/**
	 * Will call handler "handler" right in moment before modal window was closed
	 *
	 * @param handler {Function}
	 */
	this.onClose = hooks.onClose;

	/**
	 * Will call handler "handler" calls before modal window will be closed
	 *
	 * @param handler {Function}
	 */
	this.beforeClose = hooks.beforeClose;

	/**
	 * Will call handler "handler" after modal window was closed
	 *
	 * @param handler {Function}
	 */
	this.closed = hooks.closed;

})(document);