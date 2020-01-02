"use strict";

import * as utils from './utils';

// const aria = require('./plugins/aria');
// const logger = require('./plugins/logger');
// const history = require('./plugins/history');

// import { MODE_DEV } from './constants.ts';

import { LibraryEvent } from "./types";

/**
 * Registers event listeners and it handlers
 *
 * @param context {Object}
 * @param hooks {Object}
 */
const registerHooks = (context: object, hooks: object) => {
	for (let [name, handler] of Object.entries(hooks)) {
		context[name] = handler;
	}
};

import getHooks from './hooks';
import getEvents from './events';
import pluginsStore from "./plugins";
import { ModalOptions } from "./interfaces";


const defaults: ModalOptions = {
	triggers: [],
};

export const Modal = function(el: HTMLElement, options: ModalOptions = defaults) {

	this.initedHook = function(cb) {cb()};

	/**
	 * Store of plugins
	 *
	 * @type {Map<any, any>}
	 */
	let plugins = new Map();

	const pluginsUtils = pluginsStore(plugins);

	this.listPlugins = function () {
		return Array.from(plugins.keys());
	};

	/**
	 * Add plugin into store
	 *
	 * @param plugin
	 * @returns {boolean}
	 */
	this.plug = pluginsUtils.registerPlugin;

	/**
	 * Will call "methodName" inside of methods of plugins
	 *
	 * @param methodName {string}
	 * @param options {Object}
	 */
	const mapPluginsMethod = pluginsUtils.mapPluginsMethod;

	// this.plug(aria);
	this.plug(history);
	// this.plug(logger({ mode: MODE_DEV }));

	/**
	 * Hooks
	 *
	 * @type {object}
	 */
	const hooks: object = getHooks(el);

	const events: LibraryEvent = getEvents();

	/**
	 * Handler of "Escape" keyboard button
	 * @param e {KeyboardEvent}
	 */
	let escHandler = (function(e: KeyboardEvent) {
		if (e.key === "Escape") {
			if (this.isShow()) {
				this.toggleModal(e);
			}
		}
	}).bind(this);

	/**
	 * Listener of "Escape" keyboard button
	 */
	document.addEventListener('keyup', (event: KeyboardEvent) => escHandler.call(this, event));

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
	this.isHidden = (): boolean => el.style.visibility === 'hidden';

	/**
	 * Check is modal shows
	 * Based on "isHidden" method, returns reversed result of "isHidden"
	 *
	 * @returns {boolean}
	 */
	this.isShow = (): boolean => !this.isHidden();

	/**
	 * Handler of modal window opening, contains the logic of how it should be
	 */
	let showModalHanlder = function(): void {
		el.style.visibility = 'visible';

		if (!el.classList.contains('opened')) {
			el.classList.add('opened');
		}
	};

	/**
	 * Show modal window
	 */
	this.showModal = (function showModal(e) {

		if (typeof e === 'undefined') e = {};

		if (this.isHidden()) {
			el.dispatchEvent(events.beforeOpen(e));

			if (el.dispatchEvent(events.onOpen(e))) {

				showModalHanlder();

				mapPluginsMethod('showModal', { event: e, element: el });

				el.dispatchEvent(events.opened(e));
			}
		}

	}).bind(this);

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
	this.hideModal = (function hideModal(e) {

		if (typeof e === 'undefined') e = {};

		if (! this.isHidden()) {
			el.dispatchEvent(events.beforeClose(e));

			if (el.dispatchEvent(events.onClose(e))) {

				hideModalHandler();

				mapPluginsMethod('hideModal', { event: e, element: el });

				el.dispatchEvent(events.closed(e));
			}
		}

	}).bind(this);

	/**
	 * Opens the modal window
	 *
	 * @param before {function} - callback, will be called before modal window will be opened
	 * @param after {function} - callback, will be called after modal window was opened
	 */
	this.open = function open(before: Function | null, after: Function | null) {
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
	 * Closes the modal window
	 *
	 * @param before {function} - callback, will be called before modal window will be closed
	 * @param after {function} - callback, will be called after modal window was closed
	 */
	this.close = function close(before: Function | null, after: Function | null) {
		if (utils.isFunc(before)) {
			before(this, el, this.hideModal);

			if (utils.isFunc(after)) {
				after(this, el, this.showModal);
			}
		} else {
			this.hideModal();
		}
	};

	/**
	 * Toggle modal window
	 */
	this.toggleModal = function toggleModal(e: Event | CustomEvent | KeyboardEvent): void {
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
	const handleTrigger = (function(e) {
		this.toggleModal(e);
	}).bind(this);

	/**
	 * Sets HTMLDOMElement "el" with event type of eventName as a trigger of toggle method
	 *
	 * @param el {HTMLElement}
	 * @param eventName {String}
	 * @returns {boolean}
	 */
	this.addTrigger = function addTrigger(el: HTMLElement, eventName: string): boolean {
		if (! this.triggers.includes(el)) {
			this.triggers.push({ element: el, eventType: eventName });
			el.addEventListener(eventName, handleTrigger);
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

	registerHooks(this, hooks);

};