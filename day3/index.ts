const NUMBER_REGEX = /\d+/;

const getAdjacentNumbers = (nestedArr: string[], index: number) => {
  let currentNumber = "";
  let backwardIndex = index;
  let forwardIndex = index + 1;

  while (nestedArr[backwardIndex]?.match(NUMBER_REGEX)) {
    currentNumber = nestedArr[backwardIndex].concat(currentNumber);
    nestedArr[backwardIndex] = ".";
    backwardIndex--;
  }

  while (nestedArr[forwardIndex]?.match(NUMBER_REGEX)) {
    currentNumber = currentNumber.concat(nestedArr[forwardIndex]);
    nestedArr[forwardIndex] = ".";
    forwardIndex++;
  }

  return currentNumber;
};

const getSumOfAdjacentSymbolNumbers = async () => {
  const data = await parseEngineSchematicData();
  let totalSumOfAdjacent = 0;
  let totalSumOfGearRatio = 0;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      let totalGearRatio = 1;
      let totalAdjacentGear = 0;
      const currentPosition = data[i][j];

      const possiblePositions = [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
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
            totalSumOfAdjacent += parseInt(currentNumber);
            totalGearRatio *= parseInt(currentNumber);
            totalAdjacentGear++;
          }
        });

        if (totalAdjacentGear >= 2) {
          totalSumOfGearRatio += totalGearRatio;
        }
      }
    }
  }

  return { totalSumOfAdjacent, totalSumOfGearRatio };
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

const { totalSumOfAdjacent, totalSumOfGearRatio } =
  await getSumOfAdjacentSymbolNumbers();
console.log(
  "Part 1: sum of any adjacent numbers of symbol",
  totalSumOfAdjacent
);
console.log(
  "Part 2: sum of two adjacent numbers multiplied of gears (*)",
  totalSumOfGearRatio
);
