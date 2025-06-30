import { Time } from "./time.js";

export class TimeCalculator {
  constructor(minimumBreak, minimumWorkday) {
    this.minimumBreak = Time.fromString(minimumBreak);
    this.minimumWorkday = Time.fromString(minimumWorkday);
  }

  getSortedCheckpoints(checkpoints) {
    return [...checkpoints].sort((a, b) =>
      Time.fromString(a).compare(Time.fromString(b))
    );
  }

  breaks(checkpoints) {
    const sortedCheckpoints = this.getSortedCheckpoints(checkpoints);
    if (sortedCheckpoints.length < 2) return new Time(0, 0);

    let breakTime = new Time(0, 0);
    let lastCheckoutTime = null;

    for (let i = 1; i < sortedCheckpoints.length; i++) {
      if (i % 2 === 1) {
        lastCheckoutTime = Time.fromString(sortedCheckpoints[i]);
      } else {
        breakTime = breakTime.add(
          lastCheckoutTime.diff(Time.fromString(sortedCheckpoints[i]))
        );
      }
    }

    return breakTime;
  }

  timeSpent(checkpoints) {
    const sortedCheckpoints = this.getSortedCheckpoints(checkpoints);

    if (sortedCheckpoints.length === 0) return new Time(0, 0);

    if (sortedCheckpoints.length % 2 === 1) {
      return Time.fromString(sortedCheckpoints[0])
        .diff(new Time())
        .diff(this.breaks(sortedCheckpoints));
    }

    return Time.fromString(sortedCheckpoints[0])
      .diff(Time.fromString(sortedCheckpoints[sortedCheckpoints.length - 1]))
      .diff(this.breaks(sortedCheckpoints));
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
    return new Time().add(this.timeToGo(checkpoints));
  }
}
