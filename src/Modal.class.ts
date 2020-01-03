import {
	Trigger,
	ModalOptions
} from "./interfaces/";

import { isFunc } from './utils';

import getHooks from './hooks';
import getEvents from './events';
import pluginsStore from "./plugins";
import { SystemEvent } from "./defaults/system-event";

const defaults: ModalOptions = {
	triggers: [],
	plugins: new Map()
};

export class Modal {
	readonly element: HTMLElement;
	private plugins: {};
	private triggers: Trigger[];
	private hooks;
	private events;
	private pluginsStore;
	private plug: Function;

	private openHandler: Function;
	private closeHandler: Function;

	public  beforeOpen;
	public  onOpen;
	public  opened;
	public  beforeClose;
	public  onClose;
	public  closed;

	constructor(
		element: HTMLElement,
		options: ModalOptions = defaults
	) {
		this.element = element;
		this.plugins = options.plugins;
		this.triggers = options.triggers;
		this.hooks = getHooks(this.element);
		this.events = getEvents();
		this.pluginsStore = pluginsStore(this.plugins);
		this.plug = this.pluginsStore.registerPlugin;

		this.openHandler = (function () {
			this.element.style.visibility = 'visible';

			if (!this.element.classList.contains('opened')) {
				this.element.classList.add('opened');
			}
		}).bind(this);

		this.closeHandler = (function () {
			this.element.style.visibility = 'hidden';

			if (this.element.classList.contains('opened')) {
				this.element.classList.remove('opened');
			}
		}).bind(this);

		for (let [name, handler] of Object.entries(this.hooks)) {
			this[name] = handler;
		}

		/**
		 * Opening hooks
		 */
		// this.beforeOpen = this.hooks.beforeOpen;
		// this.onOpen = this.hooks.onOpen;
		// this.opened = this.hooks.opened;

		/**
		 * Closing hooks
		 */
		// this.beforeClose = this.hooks.beforeClose;
		// this.onClose = this.hooks.onClose;
		// this.closed = this.hooks.closed;

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

		if (this.triggers.length > 0) {
			this.triggers.map(trigger => this.addTrigger(trigger.element, trigger.eventType));
		}

		(this.addTrigger(this.element.querySelector('.btn-close'), 'click'));
		(this.addTrigger(this.element.querySelector('.modal__background'), 'click'));

		this.closeHandler();
	}

	/**
	 * Check is modal hidden
	 *
	 * @returns {boolean}
	 */
	isHidden = (): boolean => this.element.style.visibility === 'hidden';

	/**
	 * Check is modal shows
	 * Based on "isHidden" method, returns reversed result of "isHidden"
	 *
	 * @returns {boolean}
	 */
	isShow = (): boolean => !this.isHidden();

	// /**
	//  * Handler of modal window opening, contains the logic of how it should be
	//  */
	// private openHandler() {
	// 	this.element.style.visibility = 'visible';
	//
	// 	if (!this.element.classList.contains('opened')) {
	// 		this.element.classList.add('opened');
	// 	}
	// }

	// /**
	//  * Handler of modal window closing, contains the logic of how it should be
	//  */
	// private closeHandler() {
	// 	this.element.style.visibility = 'hidden';
	//
	// 	if (this.element.classList.contains('opened')) {
	// 		this.element.classList.remove('opened');
	// 	}
	// }

	/**
	 * Show modal window
	 */
	showModal = ((event = SystemEvent) => {

		// console.log('showModal', event);

		if (this.isHidden()) {
			this.element.dispatchEvent(this.events.beforeOpen(event));
			debugger;

			if (this.element.dispatchEvent(this.events.onOpen(event))) {

				this.openHandler();

				// this.pluginsStore.mapPluginsMethod('showModal', { event, element: this.element });

				this.element.dispatchEvent(this.events.opened(event));
			}
		}

	}).bind(this);

	hideModal = ((event = SystemEvent) => {

		// console.log('hideModal', event);

		if (! this.isHidden()) {

			this.element.dispatchEvent(this.events.beforeClose(event));

			if (this.element.dispatchEvent(this.events.onClose(event))) {

				this.closeHandler();

				// this.pluginsStore.mapPluginsMethod('hideModal', { event, element: this.element });

				this.element.dispatchEvent(this.events.closed(event));
			}
		}

	}).bind(this);

	/**
	 * Opens the modal window
	 *
	 * @param before {function} - callback, will be called before modal window will be opened
	 * @param after {function} - callback, will be called after modal window was opened
	 */
	open(
		before: Function | null = null,
		after: Function| null = null
	): void {

		if (this.isHidden()) {

			this.element.dispatchEvent(this.events.beforeOpen());

			if (typeof before !== null && isFunc(before)) {
				before(this, this.element, this.showModal);
			} else {
				this.showModal();
			}


			if (typeof after !== null && isFunc(after)) {
				after(this, this.element, this.hideModal);
			}
		}

	}

	/**
	 * Closes the modal window
	 *
	 * @param before {function} - callback, will be called before modal window will be closed
	 * @param after {function} - callback, will be called after modal window was closed
	 */
	close(
		before: Function | null = null,
		after: Function| null = null
	): void {

		if (typeof before !== null && isFunc(before)) {
			before(this, this.element, this.hideModal);
		} else {
			this.hideModal();
		}

		if (typeof after !== null && isFunc(after)) {
			after(this, this.element, this.showModal);
		}
	}

	/**
	 * Toggle modal window
	 */
	toggleModal = (function(e): void {

		this.isHidden() === true
			? this.showModal(e)
			: this.hideModal(e);
	});

	/**
	 * Handler that will be assigned to a trigger
	 */
	handleTrigger = (function(e) {
		this.toggleModal(e);
	}).bind(this);

	/**
	 * Sets HTMLDOMElement "el" with event type of eventName as a trigger of toggle method
	 *
	 * @param el {HTMLElement}
	 * @param eventName {String}
	 * @returns {boolean}
	 */
	addTrigger(el: HTMLElement, eventName: string): boolean {
		this.triggers.push({ element: el, eventType: eventName });
		el.addEventListener(eventName, this.handleTrigger);
		return true;
	}

	// /**
	//  * Add plugin into store
	//  *
	//  * @param plugin
	//  */
	// plug = this.pluginsStore.registerPlugin;


}