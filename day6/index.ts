const getTotalWonRecord = async () => {
  const { timeArray, distanceArray } = await parseData();
  let total = 1;

  for (let i = 0; i < timeArray?.length; i++) {
    let currentRaceWon = 0;

    for (let j = 0; j < timeArray[i]; j++) {
      if (j * (timeArray[i] - j) > distanceArray[i]) {
        currentRaceWon++;
      }
    }

    total *= currentRaceWon;
  }

  return total;
};

const getLongerTotalWonRecord = async () => {
  const { timeArray, distanceArray } = await parseData();
  let total = 0;

  const combinedTime = parseInt(timeArray.join(""));
  const combinedDistance = parseInt(distanceArray.join(""));

  for (let i = 0; i < combinedTime; i++) {
    if (i * (combinedTime - i) > combinedDistance) {
      total++;
    }
  }

  return total;
};

const parseData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");

  const timeArray = linesArr[0].match(/\d+/g)?.map(Number) || [];
  const distanceArray = linesArr[1].match(/\d+/g)?.map(Number) || [];

  return { timeArray, distanceArray };
};

const start = Date.now();

console.log("Part 1: Total of races won", await getTotalWonRecord());
console.log(
  "Part 2: Total of combined races won",
  await getLongerTotalWonRecord()
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
