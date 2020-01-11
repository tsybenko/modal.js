import {
  BEFORE_OPEN,
  ON_OPEN,
  OPENED,
  BEFORE_CLOSE,
  ON_CLOSE,
  CLOSED
} from './constants';

export default (element: Element): object => ({
  /**
   * Will call handler "handler" before modal window will be opened
   *
   * @param handler {Function}
   */
  [BEFORE_OPEN]: (handler: Function) =>
      element.addEventListener(BEFORE_OPEN, event => handler(event)),

  /**
   * Will call handler "handler" right in moment before modal window will be opened
   *
   * @param handler {Function}
   */
  [ON_OPEN]: (handler: Function) =>
      element.addEventListener(ON_OPEN, event => handler(event)),

  /**
   * Will call handler "handler" after modal window was opened
   *
   * @param handler {Function}
   */
  [OPENED]: (handler: Function) =>
      element.addEventListener(OPENED, event => handler(event)),

  /**
   * Will call handler "handler" calls before modal window will be closed
   *
   * @param handler {Function}
   */
  [BEFORE_CLOSE]: (handler: Function) =>
      element.addEventListener(BEFORE_CLOSE, event => handler(event)),

  /**
   * Will call handler "handler" right in moment before modal window was closed
   *
   * @param handler {Function}
   */
  [ON_CLOSE]: (handler: Function) =>
      element.addEventListener(ON_CLOSE, event => handler(event)),

  /**
   * Will call handler "handler" after modal window was closed
   *
   * @param handler {Function}
   */
  [CLOSED]: (handler: Function) =>
      element.addEventListener(CLOSED, event => handler(event))
});