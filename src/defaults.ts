import { ModalOptions } from "./interfaces";

export const defaults: ModalOptions = {
  handlers: {
    open: (instance, element) => (): void => {
      element.style.visibility = 'visible';

      if (!element.classList.contains('opened')) {
        element.classList.add('opened');
      }
    },
    close: (instance, element) => (): void => {
      element.style.visibility = 'hidden';

      if (element.classList.contains('opened')) {
        element.classList.remove('opened');
      }
    },
    isOpen: (instance, element) => (): boolean => {
      return !(element.style.visibility === 'hidden');
    },
  },
  triggers: new Map(),
  plugins: new Map(),
  config: {
    autoOpen: {
      enabled: false,
      timeout: 2000
    },
    autoClose: {
      enabled: false,
      timeout: 2000
    }
  }
};