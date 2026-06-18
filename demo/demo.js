import "./demo.css";

import { formatDate, formatTime } from "./utils.ts";
import { Modal } from "../src/Modal.ts";

var modalContainerElement = document.querySelector(".modal");
var triggerButtonElement = document.querySelector(".btn_open");
var logsContainerElement = document.querySelector("#logs");

var modalBodyElement = modalContainerElement.querySelector(".modal__body");

var modalWindow = new Modal(modalContainerElement);

modalWindow.addTrigger(triggerButtonElement, "click");

let logEvent = (e) => {
  let now = new Date();
  let date = formatDate(now);
  let time = formatTime(now);
  let paragraphElement = document.createElement("p");
  paragraphElement.classList.add("log__item");
  paragraphElement.title = `Event type "${e.type}" happen because of "${e.detail.type}"`;
  paragraphElement.innerHTML = `[${date} ${time}] <b>${e.type}</b>`;

  console.log(e);
  logsContainerElement.prepend(paragraphElement);
};

modalWindow.beforeOpen(logEvent);
modalWindow.onOpen(logEvent);
modalWindow.opened(function (e) {
  logEvent(e);
  modalBodyElement.innerHTML = logsContainerElement.innerHTML;
});
modalWindow.beforeClose(function (e) {
  logEvent(e);
  modalBodyElement.innerHTML = logsContainerElement.innerHTML;
});
modalWindow.onClose(logEvent);
modalWindow.closed(logEvent);

modalWindow.open(
  function (modal, el, open) {
    setTimeout(function () {
      open();
    }, 500);
  },
  function (modal, el, close) {
    setTimeout(function () {
      close();
    }, 2000);
  },
);
