import {
  Trigger,
  ModalOptions,
  Plugin
} from "./interfaces/";

import { isFunc } from './utils';

import getHooks from './hooks';
import getEvents from './events';
import pluginsStore from "./plugins";
import { SystemEvent } from "./defaults/system-event";

const defaults: ModalOptions = {
  triggers: new Map<HTMLElement, string>(),
  plugins: new Map()
};

export class Modal {
  readonly element: HTMLElement;
  private plugins: Map<string, Plugin>;
  private triggers: Map<HTMLElement, string>;
  private hooks: Record<string, (handler: Function) => void>;
  private events: Record<string, (data?: any) => CustomEvent>;
  private pluginsStore: ReturnType<typeof pluginsStore>;
  private plug: Function;

  private openHandler: Function;
  private closeHandler: Function;

  public beforeOpen!: (handler: Function) => void;
  public onOpen!: (handler: Function) => void;
  public opened!: (handler: Function) => void;
  public beforeClose!: (handler: Function) => void;
  public onClose!: (handler: Function) => void;
  public closed!: (handler: Function) => void;

  constructor(
      element: HTMLElement,
      options: ModalOptions = defaults
  ) {
    this.element = element;
    this.plugins = options.plugins ?? new Map();
    this.triggers = options.triggers ?? new Map();
    this.hooks = getHooks(this.element) as Record<string, (handler: Function) => void>;
    this.events = getEvents() as Record<string, (data?: any) => CustomEvent>;
    this.pluginsStore = pluginsStore(this.plugins);
    this.plug = this.pluginsStore.registerPlugin;

    this.openHandler = () => {
      this.element.style.visibility = 'visible';

      if (!this.element.classList.contains('opened')) {
        this.element.classList.add('opened');
      }
    };

    this.closeHandler = () => {
      this.element.style.visibility = 'hidden';

      if (this.element.classList.contains('opened')) {
        this.element.classList.remove('opened');
      }
    };

    for (let [name, handler] of Object.entries(this.hooks)) {
      (this as any)[name] = handler;
    }

    /**
     * Handler of "Escape" keyboard button
     * @param e {KeyboardEvent}
     */
    const escHandler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        if (this.isShow()) {
          this.toggleModal(e);
        }
      }
    };

    /**
     * Listener of "Escape" keyboard button
     */
    document.addEventListener('keyup', (event: KeyboardEvent) => escHandler(event));

    if (this.triggers.size > 0) {
      this.triggers.forEach((eventType, element) => this.addTrigger(element, eventType));
    }

    const btnClose = this.element.querySelector<HTMLElement>('.btn-close');
    const bgElement = this.element.querySelector<HTMLElement>('.modal__background');
    if (btnClose) this.addTrigger(btnClose, 'click');
    if (bgElement) this.addTrigger(bgElement, 'click');

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

  /**
   * Show modal window
   */
  showModal = ((event = SystemEvent) => {

    if (this.isHidden()) {
      this.element.dispatchEvent(this.events.beforeOpen(event));

      if (this.element.dispatchEvent(this.events.onOpen(event))) {

        this.openHandler();

        this.element.dispatchEvent(this.events.opened(event));
      }
    }

  }).bind(this);

  hideModal = ((event = SystemEvent) => {

    if (!this.isHidden()) {

      this.element.dispatchEvent(this.events.beforeClose(event));

      if (this.element.dispatchEvent(this.events.onClose(event))) {

        this.closeHandler();

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
      after: Function | null = null
  ): void {

    if (this.isHidden()) {

      this.element.dispatchEvent(this.events.beforeOpen());

      if (before !== null && isFunc(before)) {
        before(this, this.element, this.showModal);
      } else {
        this.showModal();
      }


      if (after !== null && isFunc(after)) {
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
      after: Function | null = null
  ): void {

    if (before !== null && isFunc(before)) {
      before(this, this.element, this.hideModal);
    } else {
      this.hideModal();
    }

    if (after !== null && isFunc(after)) {
      after(this, this.element, this.showModal);
    }
  }

  /**
   * Toggle modal window
   */
  toggleModal = (e: Event): void => {
    this.isHidden() === true ? this.showModal(e) : this.hideModal(e);
  };

  /**
   * Handler that will be assigned to a trigger
   */
  handleTrigger = (e: Event): void => {
    this.toggleModal(e);
  };

  /**
   * Sets HTMLDOMElement "el" with event type of eventName as a trigger of toggle method
   *
   * @param el {HTMLElement}
   * @param eventName {String}
   * @returns {boolean}
   */
  addTrigger(el: HTMLElement, eventName: string): boolean {
    if (!this.triggers.has(el)) {
      this.triggers.set(el, eventName);
      el.addEventListener(eventName, this.handleTrigger);
      return true;
    }

    return false;
  }

}
