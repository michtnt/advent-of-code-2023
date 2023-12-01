import { readFileSync } from "fs";
import * as path from "path";

const decodingTextToNumber = (value = "0") => {
  const dictionary: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  return dictionary[value] ? dictionary[value] : value;
};

const getJoinedDigitsFromLine = (line: string): string => {
  const regex = /(?:[0-9]|one|two|three|four|five|six|seven|eight|nine)/g;

  // https://stackoverflow.com/questions/20833295/how-can-i-match-overlapping-strings-with-regex

  let next;
  let digits = [];

  while ((next = regex.exec(line))) {
    digits.push(next[0]);
    regex.lastIndex = next.index + 1;
  }

  let firstAndLastDigits = [
    decodingTextToNumber(digits[0]),
    decodingTextToNumber(digits[digits.length - 1]),
  ];

  return firstAndLastDigits?.join("");
};

const getSumOfAllCalibrationValues = () => {
  const data: Array<string> = parseCalbirationDocumentValue();
  let total = 0;

  data.map((line) => {
    const joinedDigits = getJoinedDigitsFromLine(line);
    total += parseInt(joinedDigits);
  });

  return total;
};

/** utils */
const parseCalbirationDocumentValue = () => {
  return readFileSync(path.join(__dirname, "./input.txt"))
    .toString()
    .split("\n");
};

console.log("sum of all calibration values", getSumOfAllCalibrationValues());
