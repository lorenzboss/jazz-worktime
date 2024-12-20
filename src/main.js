import { injectStyles } from "./style.js";
import { display, readTimes } from "./utils.js";

window.onload = function () {
  setInterval(() => {
    let times = readTimes();
    if (times) display(times);
  }, 1000);

  injectStyles();
};
