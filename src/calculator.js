import { Time } from "./time.js";

export class TimeCalculator {
  constructor(minimumBreak, minimumWorkday) {
    this.minimumBreak = Time.fromString(minimumBreak);
    this.minimumWorkday = Time.fromString(minimumWorkday);
  }

  breaks(checkpoints) {
    this.sort(checkpoints);
    if (checkpoints.length < 2) return new Time(0, 0);

    let breakTime = new Time(0, 0);
    let lastCheckoutTime = null;

    for (let i = 1; i < checkpoints.length; i++) {
      if (i % 2 === 1) {
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

    if (checkpoints.length === 0) return new Time(0, 0);

    if (checkpoints.length % 2 === 1) {
      return Time.fromString(checkpoints[0])
        .diff(new Time())
        .diff(this.breaks(checkpoints));
    }

    return Time.fromString(checkpoints[0])
      .diff(Time.fromString(checkpoints[checkpoints.length - 1]))
      .diff(this.breaks(checkpoints));
  }

  timeToGo(checkpoints) {
    const breakTime = this.breaks(checkpoints);
    const timeSpent = this.timeSpent(checkpoints);

    if (this.minimumBreak.compare(breakTime) === 1) {
      return this.minimumWorkday
        .add(this.minimumBreak.diff(breakTime))
        .sub(timeSpent);
    }

    return this.minimumWorkday.sub(timeSpent);
  }

  goTime(checkpoints) {
    return this.timeToGo(checkpoints).isNegative
      ? new Time().sub(this.timeToGo(checkpoints))
      : new Time().add(this.timeToGo(checkpoints));
  }

  sort(checkpoints) {
    checkpoints.sort((a, b) => Time.fromString(a).compare(Time.fromString(b)));
  }
}
