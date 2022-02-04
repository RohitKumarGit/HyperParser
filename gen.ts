const t = `| DATE | Calculates a date specified by year, month, day, and displays it in the cell's formatting. | DATE(Year; Month; Day) |
| DATEDIF | Calculates distance between two dates, in provided unit parameter. | DATEDIF(Date1; Date2; Units) |
| DATEVALUE | Interprets string as date. | DATEVALUE(Datestring) |
| DAY | Returns the day of the given date value. | DAY(Number) |
| DAYS | Calculates the difference between two date values. | DAYS(Date2; Date1) |
| DAYS360 | Calculates the difference between two date values in days, in 360-day basis. | DAYS360(Date2; Date1[; Format]) |
| EDATE | Shifts the given startdate by given number of months. | EDATE(Startdate; Months) |
| EOMONTH | Returns the date of the last day of a month which falls months away from the start date. | EOMONTH(Startdate; Months) |
| HOUR | Returns hour component of given time. | HOUR(Time) |
| INTERVAL | Returns interval string from given number of seconds. | INTERVAL(Seconds) |
| ISOWEEKNUM | Returns an ISO week number that corresponds to the week of year. | ISOWEEKNUM(Date) |
| MINUTE | Returns minute component of given time. | MINUTE(Time) |
| MONTH | Returns the month for the given date value. | MONTH(Number) |
| NETWORKDAYS | Returns the number of working days between two given dates. | NETWORKDAYS(Date1; Date2[; Holidays]) | 
| NETWORKDAYS.INTL | Returns the number of working days between two given dates. | NETWORKDAYS.INTL(Date1; Date2[; Mode [; Holidays]]) |
| NOW | Returns current date + time. | NOW() |
| SECOND | Returns second component of given time. | SECOND(Time) |
| TIME | Calculates time from given hour, minute and second. | TIME(Hour; Minute; Second) |
| TIMEVALUE | Interprets string as time. | TIMEVALUE(Timestring) |
| TODAY | Returns current date. | TODAY() |
| WEEKDAY | Computes a number between 1-7 representing the day of week. | WEEKDAY(Date; Type) |
| WEEKNUM | Returns a week number that corresponds to the week of year. | WEEKNUM(Date; Type) |
| WORKDAY | Returns the working day number of days from start day. | WORKDAY(Date, Shift[; Holidays]) |
| WORKDAY.INTL | Returns the working day number of days from start day. | WORKDAY(Date, Shift[; Mode[; Holidays]]) |
| YEAR | Returns the year as a number according to the internal calculation rules. | YEAR(Number) |
| YEARFRAC | Computes the difference between two date values, in fraction of years. |  YEARFRAC(Date2; Date1[; Format]) |`;
const fs = require("fs");
const res = t.split("\n").map((row) =>
  row
    .trim()
    .split("|")
    .map((token) => token.trim())
    .filter((k) => k.length > 0)
);
const errored = [];
const result = [];
res.forEach((def) => {
  const functionName = def[0];
  const description = def[1];
  if (def[2].includes("[;")) {
    result.push({ functionName, description, numberOfParams: def });
    errored.push(functionName);
  } else {
    const t = new RegExp(",", "g");
    let count = 0;
    const context = def[2]
      .replace(t, ";")
      .substring(def[2].lastIndexOf("(") + 1, def[2].lastIndexOf(")"));
    console.log(context);
    if (context.includes(";")) {
      count = context.split(";").length;
    }
    // if (context.length > 0) {
    //   count = (context.match(/;/g) || []).length;
    // }
    result.push({
      functionName,
      description,
      numberOfParams: [count],
    });
  }
});
console.log(errored);
fs.writeFile(
  "src/function-definitions/dateAndTime.json",
  JSON.stringify(result),
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);
const m = "NOW()";

const j = (
  m
    .replace(t, ";")
    .substring(m.lastIndexOf("(") + 1, m.lastIndexOf(")"))
    .match(/;/g) || []
).length;
console.log(j);
