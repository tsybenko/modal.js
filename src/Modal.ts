import * as utils from './utils';
import getHooks from './hooks';
import getEvents from './events';
import pluginsStore from "./plugins";
import { ModalOptions } from "./interfaces/";
import { defaults } from "./defaults";
import { SYSTEM_DEFAULT_EVENT } from "./constants";
import { Builder } from './ui/builder';

const Modal = function(
	el: HTMLElement,
	options: ModalOptions = defaults
) {
	let extensions = {};

	const handlers = {
		/**
		 * Handler of modal window opening, contains the logic of how it should be
		 */
		open: options.hasOwnProperty('handlers') && options.handlers.hasOwnProperty('open')
			? options.handlers.open(this, el)
			: defaults.handlers.open(this, el),

		/**
		 * Handler of modal window closing, contains the logic of how it should be
		 */
		close: options.hasOwnProperty('handlers') && options.handlers.hasOwnProperty('close')
			? options.handlers.close(this, el)
			: defaults.handlers.close(this, el)
	};

	/**
	 * Triggers
	 */
	const triggers = (options.hasOwnProperty('triggers') && options.triggers.size > 0)
		? options.triggers
		: defaults.triggers;

	/**
	 * Store of plugins
	 *
	 * @type {Map<string, object>}
	 */
	let plugins: Map<string, object> = new Map();

	const pluginsUtils = pluginsStore(plugins);

	this.plug = pluginsUtils.registerPlugin;

	/**
	 * Hooks
	 *
	 * @type {object}
	 */
	const hooks: object = getHooks(el);

	/**
	 * Registers event listeners and it handlers
	 */
	for (let [name, handler] of Object.entries(hooks)) {
		this[name] = handler;
	}

	const events = getEvents();

	/**
	 * Listener of "Escape" keyboard button
	 */
	document.addEventListener('keyup', (event: KeyboardEvent) => ((e: KeyboardEvent): void => {
		if (e.key === "Escape") {
			if (this.isOpen(this, el)) {
				toggleModal(e);
			}
		}
	}).call(this, event));

	/**
	 * Check is modal shows
	 *
	 * @returns {boolean}
	 */
	this.isOpen = (options.hasOwnProperty('handlers') && options.handlers.hasOwnProperty('isOpen'))
		? options.handlers.isOpen(this, el)
		: defaults.handlers.isOpen(this, el);

	/**
	 * Check is modal hidden
	 *
	 * @returns {boolean}
	 */
	this.isClose = (instance, element): boolean => !this.isOpen(instance, element);

	/**
	 * Show modal window
	 */
	this.showModal = (event: CustomEvent = events[SYSTEM_DEFAULT_EVENT]()) => {
		if (this.isClose(this, el)) {
			el.dispatchEvent(events.beforeOpen(event));

			if (el.dispatchEvent(events.onOpen(event))) {
				handlers.open();
				pluginsUtils.mapPluginsMethod('showModal', { event, element: el });
				el.dispatchEvent(events.opened(event));
			}
		}
	};

	/**
	 * Hide modal window
	 */
	this.hideModal = (event: CustomEvent = events[SYSTEM_DEFAULT_EVENT]()) => {
		if (! this.isClose(this, el)) {
			el.dispatchEvent(events.beforeClose(event));

			if (el.dispatchEvent(events.onClose(event))) {
				handlers.close();
				pluginsUtils.mapPluginsMethod('hideModal', { event, element: el });
				el.dispatchEvent(events.closed(event));
			}
		}
	};

	/**
	 * Opens the modal window
	 *
	 * @param before {function} - callback, will be called before modal window will be opened
	 * @param after {function} - callback, will be called after modal window was opened
	 */
	this.open = (
		before: (instance: object, element: HTMLElement, openFn: Function) => void | null,
		after: (instance: object, element: HTMLElement, closeFn: Function) => void | null
	) => {
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
	this.close = (
		before: (instance: object, element: HTMLElement, closeFn: Function) => void | null,
		after: (instance: object, element: HTMLElement, openFn: Function) => void | null
	) => {
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
	const toggleModal = (e: Event | CustomEvent | KeyboardEvent): void => {
		this.isClose(this, el) === true
			? this.showModal(e)
			: this.hideModal(e);
	};

	this.toggle = (e: Event | CustomEvent | KeyboardEvent): void => {
		toggleModal(e);
	};

	/**
	 * Hides modal when instance was initialised
	 */
	handlers.close();

	/**
	 * Handler that will be assigned to a trigger
	 */
	const handleTrigger = (function(e) {
		toggleModal(e);
	}).bind(this);

	/**
	 * Sets HTMLDOMElement "el" with event type of eventName as a trigger of toggle method
	 *
	 * @param el {HTMLElement}
	 * @param eventName {String}
	 * @returns {boolean}
	 */
	this.addTrigger = (el: HTMLElement, eventName: string): boolean => {
		if (! triggers.has(el)) {
			triggers.set(el, eventName);
			el.addEventListener(eventName, handleTrigger);
			return true;
		}

		return false;
	};

	triggers.forEach((eventType, element) => this.addTrigger(element, eventType));

	/** Default trigger */
	this.addTrigger(el.querySelector('.btn-close'), 'click');
	this.addTrigger(el.querySelector('.modal__background'), 'click');

	this.extensions = {
		...extensions,
		UIBuilder:  new Builder(el)
	};

};

export { Modal };

// export { Modal } from './Modal.class';