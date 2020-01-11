export interface ModalOptions {
  triggers?: Map<HTMLElement, string>,
  plugins?: Map<string, object>,
  handlers?: {
    open?: (instance: object, element: HTMLElement) => (() => void),
    close?: (instance: object, element: HTMLElement) => (() => void),
    isOpen?: (instance: object, element: HTMLElement) => (() => boolean),
  },
  config?: {
    autoOpen?: {
      enabled?: boolean,
      timeout?: number
    },
    autoClose?: {
      enabled?: boolean,
      timeout?: number
    }
  }
}