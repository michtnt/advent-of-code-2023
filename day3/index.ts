const NUMBER_REGEX = /\d+/;

const getAdjacentNumbers = (adjacentRowArr: string[], index: number) => {
  let currentNumber = "";
  let backwardIndex = index;
  let forwardIndex = index + 1;

  while (adjacentRowArr[backwardIndex]?.match(NUMBER_REGEX)) {
    currentNumber = adjacentRowArr[backwardIndex].concat(currentNumber);
    adjacentRowArr[backwardIndex] = ".";
    backwardIndex--;
  }

  while (adjacentRowArr[forwardIndex]?.match(NUMBER_REGEX)) {
    currentNumber = currentNumber.concat(adjacentRowArr[forwardIndex]);
    adjacentRowArr[forwardIndex] = ".";
    forwardIndex++;
  }

  return currentNumber;
};

const getSumOfAdjacentSymbolNumbers = async () => {
  const data = await parseEngineSchematicData();

  let totalSumOfAdjacentNumbers = 0; // part 1: any number adjacent to a symbol
  let totalSumOfGearRatioNumbers = 0; // part 2: any * symbol that is adjacent to exactly two part numbers

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      // part 2
      let totalGearRatio = 1;
      let totalAdjacentGear = 0;

      const currentPosition = data[i][j];

      const possiblePositions = [
        // row below
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        // row current
        [i, j - 1],
        [i, j + 1],
        // row after
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];

      if (!currentPosition.match(NUMBER_REGEX) && currentPosition !== ".") {
        possiblePositions.map((position) => {
          if (data[position[0]][position[1]].match(NUMBER_REGEX)) {
            const currentNumber = getAdjacentNumbers(
              data[position[0]],
              position[1]
            );

            totalSumOfAdjacentNumbers += parseInt(currentNumber);

            if (currentPosition === "*") {
              totalGearRatio *= parseInt(currentNumber);
              totalAdjacentGear++;
            }
          }
        });

        if (totalAdjacentGear >= 2) {
          totalSumOfGearRatioNumbers += totalGearRatio;
        }
      }
    }
  }

  return { totalSumOfAdjacentNumbers, totalSumOfGearRatioNumbers };
};

/** utils */
const parseEngineSchematicData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  const schematicMatrixArr: string[][] = [];

  for (let i = 0; i < linesArr.length; i++) {
    for (let j = 0; j < linesArr[i].length; j++) {
      if (!schematicMatrixArr[i]) {
        schematicMatrixArr[i] = [];
      }

      schematicMatrixArr[i][j] = linesArr[i][j];
    }
  }

  return schematicMatrixArr;
};

const start = Date.now();

const { totalSumOfAdjacentNumbers, totalSumOfGearRatioNumbers } =
  await getSumOfAdjacentSymbolNumbers();

console.log(
  "Part 1: sum of any adjacent numbers of symbol",
  totalSumOfAdjacentNumbers
);
console.log(
  "Part 2: sum of two adjacent numbers multiplied of gears (*)",
  totalSumOfGearRatioNumbers
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
