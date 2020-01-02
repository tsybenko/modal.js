export interface OptionsObject {
	event: CustomEvent | Event,
	element: Element
}

export interface Trigger {
	element: HTMLElement,
	eventType: string
}

export interface ModalOptions {
	triggers: Trigger[],
	plugins?: Map<string, object>
}