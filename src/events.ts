import { BEFORE_OPEN, ON_OPEN, OPENED, BEFORE_CLOSE, ON_CLOSE, CLOSED } from './constants.ts';

export default (): object => ({
	[BEFORE_OPEN]: data => new CustomEvent(BEFORE_OPEN, { detail: data }),
	[ON_OPEN]: data => new CustomEvent(ON_OPEN, { detail: data, cancelable: true }),
	[OPENED]: data => new CustomEvent(OPENED, { detail: data }),
	[BEFORE_CLOSE]: data => new CustomEvent(BEFORE_CLOSE, { detail: data }),
	[ON_CLOSE]: data => new CustomEvent(ON_CLOSE, { detail: data, cancelable: true }),
	[CLOSED]: data => new CustomEvent(CLOSED, { detail: data }),
	onToggle: data => new CustomEvent('onToggle', { detail: data }),
});