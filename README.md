# Modal.js

##Usage example

**HTML**
```html
<div class="modal">
  <div class="modal_header"></div>
  <div class="modal_body">
    <p>Test</p>
    <button class="btn-close">Close</button>
  </div>
  <div class="modal_footer"></div>
</div>
<button class="btn-modal">Open</button>
```

**JS**
```js
var modalEl = document.querySelector('.modal');
var triggerBtnEl = document.querySelector('.btn-modal');

/**
 * "mw" as modal window
 */
var mw = new Modal(modalEl);

mw.addTrigger(triggerBtnEl, 'click');

mw.beforeClose(function(e) {
	console.log(e.type);
});
```