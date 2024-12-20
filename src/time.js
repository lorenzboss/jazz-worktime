export class Time {
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
    if (time instanceof Time) return time;

    const [hours, minutes] = time.trim().split(":");
    const isNegative = hours[0] === "-";
    return new Time(
      isNegative ? hours.substring(1) : hours,
      minutes,
      isNegative
    );
  }

  static fromTotalMinutes(totalMinutes) {
    const isNegative = totalMinutes < 0;
    totalMinutes = Math.abs(totalMinutes);
    return new Time(
      Math.floor(totalMinutes / 60),
      totalMinutes % 60,
      isNegative
    );
  }

  getTotalMinutes() {
    let totalMinutes = this.hours * 60 + this.minutes;
    return this.isNegative ? -totalMinutes : totalMinutes;
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

  add(hours = null, minutes = null) {
    let time = this.normalizeArguments(hours, minutes);
    return Time.fromTotalMinutes(
      time.getTotalMinutes() + this.getTotalMinutes()
    );
  }

  sub(hours, minutes) {
    let time = this.normalizeArguments(hours, minutes);
    if (time instanceof Time) {
      time.isNegative = !time.isNegative;
    }
    return this.add(time);
  }

  compare(hours, minutes) {
    let time = this.normalizeArguments(hours, minutes);

    if (time.isNegative !== this.isNegative) {
      return time.isNegative ? 1 : -1;
    }

    if (
      this.hours > time.hours ||
      (this.hours === time.hours && this.minutes > time.minutes)
    ) {
      return 1;
    }
    if (this.hours === time.hours && this.minutes === time.minutes) {
      return 0;
    }
    return -1;
  }

  normalizeArguments(hours = null, minutes = null) {
    if (hours == null && minutes == null) return new Time();
    if (hours instanceof Time) return hours;
    if (minutes == null) return Time.fromTotalMinutes(hours);
    return new Time(hours, minutes);
  }

  toString() {
    return `${this.isNegative ? "-" : ""}${this.hours}:${String(
      this.minutes
    ).padStart(2, "0")}`;
  }
}
