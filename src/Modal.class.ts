import { Trigger, ModalOptions } from "./interfaces";
import { isFunc } from './utils';

import getHooks from './hooks';
import getEvents from './events';

const defaults: ModalOptions = {
	triggers: [],
	plugins: {}
};

class Modal {
	readonly element: HTMLElement;
	private plugins: {};
	private triggers: Trigger[];
	private hooks;
	private events;

	constructor(
		element: HTMLElement,
		options: ModalOptions = defaults
	) {
		this.element = element;
		this.plugins = options.plugins;
		this.triggers = options.triggers;
		this.hooks = getHooks(this.element);
		this.events = getEvents();
	}

	private openHandler() {}
	private closeHandler() {}

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

		if (typeof before !== null && isFunc(before)) {
			before(this.openHandler);
		} else {
			this.openHandler();
		}

		if (typeof after !== null && isFunc(after)) {
			after(this.closeHandler);
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
			before(this.closeHandler);
		} else {
			this.closeHandler();
		}

		if (typeof after !== null && isFunc(after)) {
			after(this.openHandler);
		}
	}

	/**
	 * Add plugin into store
	 *
	 * @param plugin
	 */
	plug(plugin): void {

	}
}

export = Modal;