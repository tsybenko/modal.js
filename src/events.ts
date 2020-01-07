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
	[BEFORE_OPEN]: (data = SystemEvent): CustomEvent => new CustomEvent(BEFORE_OPEN, { detail: data }),
	[ON_OPEN]: (data = SystemEvent): CustomEvent => new CustomEvent(ON_OPEN, { detail: data, cancelable: true }),
	[OPENED]: (data = SystemEvent): CustomEvent => new CustomEvent(OPENED, { detail: data }),
	[BEFORE_CLOSE]: (data = SystemEvent): CustomEvent => new CustomEvent(BEFORE_CLOSE, { detail: data }),
	[ON_CLOSE]: (data = SystemEvent): CustomEvent => new CustomEvent(ON_CLOSE, { detail: data, cancelable: true }),
	[CLOSED]: (data = SystemEvent): CustomEvent => new CustomEvent(CLOSED, { detail: data }),
	/** Special events */
	[SYSTEM_DEFAULT_EVENT]: (data = SystemEvent): CustomEvent => new CustomEvent(SYSTEM_DEFAULT_EVENT),
});