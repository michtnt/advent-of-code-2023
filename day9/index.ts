const getSumOfExtrapolatedValues = async (type = "forward") => {
  const data = await parseHistoryReportData();
  let total = 0;

  for (let i = 0; i < data.length; i++) {
    const currentHistoryLine = data[i];
    const historyLineMap: number[][] = [data[i]];

    extrapolate(currentHistoryLine, historyLineMap);

    const sum =
      type === "forward"
        ? historyLineMap.reduce((acc, array) => {
            const lastDigit = array[array.length - 1];
            return acc + lastDigit;
          }, 0)
        : historyLineMap.reduceRight((currentX, nextSequence) => {
            // formula: x = -z + y
            const newCurrentX = -currentX + nextSequence[0];
            return newCurrentX;
          }, 0);

    total += sum;
  }

  return total;
};

const extrapolate = (
  currentHistoryLine: number[],
  historyLineMap: number[][],
  i = 1
) => {
  if (!historyLineMap[i]) {
    historyLineMap[i] = [];
  }

  for (let j = 0; j < currentHistoryLine.length - 1; j++) {
    historyLineMap[i].push(currentHistoryLine[j + 1] - currentHistoryLine[j]);
  }

  if (historyLineMap[i].every((value) => value === 0)) {
    return;
  } else {
    i++;
    extrapolate(historyLineMap[i - 1], historyLineMap, i);
  }
};

const parseHistoryReportData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  const historyMaps: number[][] = [];

  linesArr.map((line) => {
    historyMaps.push(line.split(" ").map(Number));
  });

  return historyMaps;
};

const start = Date.now();

console.log(
  "Part 1: get sum of forward extrapolated values",
  await getSumOfExtrapolatedValues("forward")
);
console.log(
  "Part 2: get sum of backward extrapolated values",
  await getSumOfExtrapolatedValues("backward")
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
