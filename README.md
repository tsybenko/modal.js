# Modal.js

[Demo](https://tsybenko.github.io/modal.js/)

## Documentation

* [GitHub Wiki](https://github.com/tsybenko/modal.js/wiki)


## Installation and running

First, clone library code and go inside it directory
```shell script
git clone https://github.com/tsybenko/modal.js.git
cd modal.js
```

Second, install library dependencies
```shell script
npm install
```

Third, run webpack development server.
Server will running on **http://127.0.0.1:4000**
```shell script
npm run start:dev
```

## Usage example

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
