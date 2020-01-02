import { Trigger } from "./Trigger";

export interface ModalOptions {
	triggers: Trigger[],
	plugins?: Map<string, object>
}