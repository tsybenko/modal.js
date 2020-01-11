import {
	BEFORE_OPEN,
	ON_OPEN, OPENED,
	BEFORE_CLOSE,
	ON_CLOSE,
	CLOSED,
	SYSTEM_DEFAULT_EVENT
} from './constants';

import { SystemEvent } from './defaults/system-event';

export default () => ({
	[BEFORE_OPEN]: (data = SystemEvent): CustomEvent =>
		new CustomEvent(BEFORE_OPEN, {
			detail: data,
			bubbles: true
		}),
	[ON_OPEN]: (data = SystemEvent): CustomEvent =>
		new CustomEvent(ON_OPEN, {
			detail: data,
			cancelable: true,
			bubbles: true
		}),
	[OPENED]: (data = SystemEvent): CustomEvent =>
		new CustomEvent(OPENED, {
			detail: data,
			bubbles: true
		}),
	[BEFORE_CLOSE]: (data = SystemEvent): CustomEvent =>
		new CustomEvent(BEFORE_CLOSE, {
			detail: data,
			bubbles: true
		}),
	[ON_CLOSE]: (data = SystemEvent): CustomEvent =>
		new CustomEvent(ON_CLOSE, {
			detail: data,
			cancelable: true,
			bubbles: true
		}),
	[CLOSED]: (data = SystemEvent): CustomEvent =>
		new CustomEvent(CLOSED, {
			detail: data,
			bubbles: true
		}),
	/** Special events */
	[SYSTEM_DEFAULT_EVENT]: (): CustomEvent =>
		new CustomEvent(SYSTEM_DEFAULT_EVENT, {
			bubbles: true
		}),
});