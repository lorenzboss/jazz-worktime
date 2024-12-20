import { TimeCalculator } from "./calculator.js";

export function displayTime(time, description) {
  return `
    <span style="flex: 1; text-align: right; padding: 0 2px; font-size: 30px;">
      ${time.toString()}
    </span>
    <span style='flex: 1; text-align: left; padding: 0 2px;'>${description}</span>
  `;
}

export function readTimes() {
  const timeElements = document.querySelectorAll(".today.stempel-day .time");

  if (!timeElements.length) return false;

  const times = [];

  timeElements.forEach((element) => {
    if (element.textContent !== "00:00") {
      times.push(element.textContent);
    }
  });

  const calculator = new TimeCalculator("0:30", "8:12");

  return [
    { text: "Time spent", value: calculator.timeSpent(times) },
    { text: "Time to go", value: calculator.timeToGo(times) },
    { text: "Go Home!", value: calculator.goTime(times) },
  ];
}

export function display(times) {
  let wrapper = document.querySelector(".timing");
  if (!wrapper) {
    wrapper = createWrapper();
  }

  let isOvertime = times.some((time) => time.value.isNegative);

  times.forEach((time, index) => {
    document.querySelector(`.time-${index}`).innerHTML = displayTime(
      time.value,
      time.text
    );
  });

  if (isOvertime) {
    document.querySelector(".timing").classList.add("pulse");
  }
}

function createWrapper() {
  const row = document.createElement("DIV");
  row.classList.add("row");

  const wrapper = document.createElement("DIV");
  wrapper.style = "margin: 0 -15px 15px; background: #f4f4f4; padding: 1rem 0;";
  wrapper.classList.add("timing");

  const title = document.createElement("P");
  title.classList.add("text-uppercase");
  title.style = "text-align: center; font-weight: bolder;";
  title.appendChild(document.createTextNode("Time stats"));

  wrapper.appendChild(title);

  for (let i = 0; i < 3; i++) {
    const element = document.createElement("P");
    element.style = "display:flex; align-items: baseline;";
    element.classList.add(`time-${i}`);
    wrapper.appendChild(element);
  }

  row.appendChild(wrapper);
  document
    .querySelector(".stempel-data")
    .parentElement.insertBefore(
      wrapper,
      document.querySelector(".stempel-data")
    );

  return wrapper;
}
