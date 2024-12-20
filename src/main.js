const WORKDAY = "8:12";
const MINIMUM_BREAKTIME = "0:30";

class Time {
  constructor(hours = null, minutes = null, isNegative = false) {
    this.isNegative = isNegative;

    if (hours != null && minutes != null) {
      this.hours = parseInt(hours);
      this.minutes = parseInt(minutes);
    } else {
      let date = new Date();
      this.hours = date.getHours();
      this.minutes = date.getMinutes();
    }
  }

  static fromString(time) {
    if (time instanceof Time) {
      return time;
    }

    let hours = time.trim().split(":")[0];
    let minutes = time.trim().split(":")[1];
    let isNegative = hours[0] == "-";

    return new Time(isNegative ? hours.subStr(1) : hours, minutes, isNegative);
  }

  static fromTotalMinutes(totalMinutes) {
    let isNegative = parseInt(totalMinutes) < 0;
    totalMinutes = Math.abs(totalMinutes);
    return new Time(
      Math.floor(totalMinutes / 60),
      totalMinutes % 60,
      isNegative
    );
  }

  getTotalMinutes() {
    let totalMinutes = this.hours * 60 + this.minutes;

    if (this.isNegative) {
      return totalMinutes * -1;
    }

    return totalMinutes;
  }

  diff(hours = null, minutes) {
    let time = this.normalizeArguments(hours, minutes);

    return Time.fromTotalMinutes(
      Math.abs(time.getTotalMinutes() - this.getTotalMinutes())
    );
  }

  add(hours = null, minutes = null) {
    let time = this.normalizeArguments(hours, minutes);

    return Time.fromTotalMinutes(
      time.getTotalMinutes() + this.getTotalMinutes()
    );
  }

  sub(hours, minutes) {
    let time = this.normalizeArguments(hours, minutes);

    time.isNegative = !time.isNegative;

    return this.add(time);
  }

  compare(hours, minutes) {
    let time = this.normalizeArguments(hours, minutes);

    if (time.isNegative != this.isNegative) {
      if (time.isNegative) {
        return 1;
      } else {
        return -1;
      }
    }

    if (this.hours > time.hours) {
      return 1;
    }

    if (this.hours == time.hours && this.minutes > time.minutes) {
      return 1;
    }

    if (this.hours == time.hours && this.minutes == time.minutes) {
      return 0;
    }

    return -1;
  }

  normalizeArguments(hours = null, minutes = null) {
    let time;

    if (hours == null && minutes == null) {
      time = new Time();
    } else if (hours instanceof Time) {
      time = hours;
    } else if (minutes == null) {
      time = Time.fromTotalMinutes(hours);
    } else {
      time = new Time(hours, minutes);
    }

    return time;
  }

  toString() {
    return (
      (this.isNegative ? "-" : "") +
      this.hours +
      ":" +
      ("" + this.minutes).padStart(2, 0)
    );
  }
}

class TimeCalculator {
  constructor(minimumBreak, minimumWorkday) {
    this.minimumBreak = Time.fromString(minimumBreak);
    this.minimumWorkday = Time.fromString(minimumWorkday);
  }

  breaks(checkpoints) {
    this.sort(checkpoints);

    if (checkpoints.length < 2) {
      return new Time(0, 0);
    }

    let breakTime = new Time(0, 0);
    let lastCheckoutTime = null;

    for (let i = 1; i < checkpoints.length; i++) {
      if (i % 2 == 1) {
        lastCheckoutTime = Time.fromString(checkpoints[i]);
      } else {
        breakTime = breakTime.add(
          lastCheckoutTime.diff(Time.fromString(checkpoints[i]))
        );
      }
    }

    return breakTime;
  }

  timeSpent(checkpoints) {
    this.sort(checkpoints);

    if (checkpoints.length === 0) {
      return new Time(0, 0);
    }
    if (checkpoints.length % 2 == 1) {
      return Time.fromString(checkpoints[0])
        .diff(new Time())
        .diff(this.breaks(checkpoints));
    }

    return Time.fromString(checkpoints[0])
      .diff(Time.fromString(checkpoints[checkpoints.length - 1]))
      .diff(this.breaks(checkpoints));
  }

  timeToGo(checkpoints) {
    let breakTime = this.breaks(checkpoints);

    let timeToGo = this.timeSpent(checkpoints);
    if (this.minimumBreak.compare(breakTime) == 1) {
      return this.minimumWorkday
        .add(this.minimumBreak.diff(breakTime))
        .sub(timeToGo);
    }

    return this.minimumWorkday.sub(timeToGo);
  }

  goTime(checkpoints) {
    if (this.timeToGo(checkpoints).isNegative) {
      return new Time();
    }

    return new Time().add(this.timeToGo(checkpoints));
  }

  sort(checkpoints) {
    for (let i = 0; i < checkpoints.length; i++) {
      for (let k = i + 1; k < checkpoints.length; k++) {
        if (
          Time.fromString(checkpoints[k - 1]).compare(
            Time.fromString(checkpoints[k])
          ) === 1
        ) {
          this.swap(checkpoints, k - 1, k);
        }
      }
    }
  }

  swap(list, firstIndex, secondIndex) {
    let temp = list[firstIndex];
    list[firstIndex] = list[secondIndex];
    list[secondIndex] = temp;
  }
}

function displayTime(time, description) {
  return (
    `<span style="flex: 1; text-align: right; padding: 0 2px; font-size: 30px;">` +
    time.toString() +
    "</span><span style='flex: 1; text-align: left; padding: 0 2px;'>" +
    description +
    "</span>"
  );
}

function readTimes() {
  let timeElements = document.querySelectorAll(".today.stempel-day .time");

  if (!timeElements.length) {
    return false;
  }

  let times = [];

  for (let i = 0; i < timeElements.length; i++) {
    if (timeElements[i].textContent != "00:00") {
      times.push(timeElements[i].textContent);
    }
  }

  let calculator = new TimeCalculator(MINIMUM_BREAKTIME, WORKDAY);

  return [
    {
      text: "Time spent",
      value: calculator.timeSpent(times),
    },
    {
      text: "Time to go",
      value: calculator.timeToGo(times),
    },
    {
      text: "Time to go Home!!!",
      value: calculator.goTime(times),
    },
  ];
}

function display(times) {
  var wrapper = document.querySelector(".timing");
  if (!wrapper) {
    let row = document.createElement("DIV");
    row.classList = "row";
    wrapper = document.createElement("DIV");
    wrapper.style =
      "margin: 0 -15px 15px; background: #f4f4f4; padding: 1rem 0;";
    wrapper.classList = "timing";

    let title = document.createElement("P");
    title.classList = "text-uppercase";
    title.style = "text-align: center; font-weight: bolder;";
    title.appendChild(document.createTextNode("Time stats"));

    wrapper.appendChild(title);

    let element;
    for (let i = 0; i < times.length; i++) {
      element = document.createElement("P");
      element.style = "display:flex; align-items: baseline;";
      element.classList = "time-" + i;
      wrapper.appendChild(element);
    }

    row.appendChild(wrapper);

    document
      .querySelector(".stempel-data")
      .parentElement.insertBefore(
        wrapper,
        document.querySelector(".stempel-data")
      );
  }

  let isOvertime = false;

  for (let i = 0; i < times.length; i++) {
    if (times[i].value.isNegative) {
      isOvertime = true;
    }
    document.querySelector(".time-" + i).innerHTML = displayTime(
      times[i].value,
      times[i].text
    );
  }

  if (isOvertime) {
    document.querySelector(".timing").classList = "timing pulse";
  }
}

let displayTimespent = function () {
  let times = readTimes();
  if (!times) {
    return false;
  }

  display(times);
};

window.onload = function () {
  let intervalTimer = window.setInterval(displayTimespent, 1000);
  setTimeout(displayTimespent, 1000);

  let style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
    @-webkit-keyframes pulse {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        
        50% {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }
        
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    
    @keyframes pulse {
        from {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
        
        50% {
            -webkit-transform: scale3d(1.05, 1.05, 1.05);
            transform: scale3d(1.05, 1.05, 1.05);
        }
        
        to {
            -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
        }
    }
    
    .pulse {
    -webkit-animation-name: pulse;
    animation-name: pulse;
    animation-iteration-count: infinite;
    -webkit-animation-duration: 3s;
    animation-duration: 3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    border: 3px solid #84b2a6;

    }`;
  document.head.append(style);
};
