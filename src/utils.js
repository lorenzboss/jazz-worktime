import { TimeCalculator } from "./calculator.js";
import { Time } from "./time.js";

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
  const absenceElements = document.querySelectorAll(
    ".today.stempel-day .absence-type"
  );

  if (!timeElements.length) return false;

  const times = [];

  timeElements.forEach((element) => {
    if (element.textContent !== "00:00") {
      times.push(element.textContent);
    }
  });

  const absenceTime = getAbsenceTime(absenceElements);

  let calculator;

  // It's allowed to work for 5 hours 30 minutes without a break
  // 8:12 - 5:30 = 2:42 => If your absence time is more than 2:42, you don't have to take a break
  // 2:42 = 162 minutes
  if (absenceTime.getTotalMinutes() > 162) {
    calculator = new TimeCalculator("0:00", "8:12");
  } else {
    calculator = new TimeCalculator("0:30", "8:12");
  }

  const timeSpent = calculator.timeSpent(times).add(absenceTime);
  const timeToGo = calculator.timeToGo(times).sub(absenceTime);
  const goHomeTime = calculator.goTime(times).sub(absenceTime);

  return [
    { text: "Time spent", value: timeSpent },
    { text: "Time to go", value: timeToGo },
    { text: "Go Home!", value: goHomeTime },
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
    document.querySelector(".timing").classList.add("unique-light-pulse");
  } else {
    document.querySelector(".timing").classList.remove("unique-light-pulse");
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

function getAbsenceTime(absenceElements) {
  let totalAbsenceMinutes = 0;

  absenceElements.forEach((absenceElement) => {
    const timeText = absenceElement.textContent.trim();
    const timeMatch = timeText.match(/(\d+):(\d+) Std./);

    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      totalAbsenceMinutes += hours * 60 + minutes;
    }
  });

  return Time.fromTotalMinutes(totalAbsenceMinutes);
}
