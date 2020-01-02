import {
	BEFORE_OPEN,
	ON_OPEN, OPENED,
	BEFORE_CLOSE,
	ON_CLOSE,
	CLOSED
} from './constants';

import { LibraryEvent } from "./types";

export default (): LibraryEvent => ({
	[BEFORE_OPEN]: (data): CustomEvent => new CustomEvent(BEFORE_OPEN, { detail: data }),
	[ON_OPEN]: (data): CustomEvent => new CustomEvent(ON_OPEN, { detail: data, cancelable: true }),
	[OPENED]: (data): CustomEvent => new CustomEvent(OPENED, { detail: data }),
	[BEFORE_CLOSE]: (data): CustomEvent => new CustomEvent(BEFORE_CLOSE, { detail: data }),
	[ON_CLOSE]: (data): CustomEvent => new CustomEvent(ON_CLOSE, { detail: data, cancelable: true }),
	[CLOSED]: (data): CustomEvent => new CustomEvent(CLOSED, { detail: data }),
});