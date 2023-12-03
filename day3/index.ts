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

  return {
    nestedArr,
    currentNumber,
  };
};

const getSumOfAdjacentSymbolNumbers = async () => {
  const data = await parseEngineSchematicData();
  let total = 0;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      // only for symbols
      if (!data[i][j].match(NUMBER_REGEX) && data[i][j] !== ".") {
        // adjacent logic
        // row before
        if (data[i - 1][j - 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i - 1],
            j - 1
          );
          data[i - 1] = nestedArr;
          total += parseInt(currentNumber);
        }

        if (data[i - 1][j].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i - 1],
            j
          );
          data[i - 1] = nestedArr;
          total += parseInt(currentNumber);
        }

        if (data[i - 1][j + 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i - 1],
            j + 1
          );
          data[i - 1] = nestedArr;
          total += parseInt(currentNumber);
        }

        // current row
        if (data[i][j - 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i],
            j - 1
          );
          data[i] = nestedArr;
          total += parseInt(currentNumber);
        }

        if (data[i][j + 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i],
            j + 1
          );
          data[i] = nestedArr;
          total += parseInt(currentNumber);
        }

        // row after
        if (data[i + 1][j - 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i + 1],
            j - 1
          );
          data[i + 1] = nestedArr;
          total += parseInt(currentNumber);
        }

        if (data[i + 1][j].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i + 1],
            j
          );
          data[i + 1] = nestedArr;
          total += parseInt(currentNumber);
        }

        if (data[i + 1][j + 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i + 1],
            j + 1
          );
          data[i + 1] = nestedArr;
          total += parseInt(currentNumber);
        }
      }
    }
  }

  return total;
};

const getGearRatio = async () => {
  const data = await parseEngineSchematicData();
  let total = 0;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      let totalAdjacent = 0;
      let currentCalc = 1;

      // only for symbols
      if (!data[i][j].match(NUMBER_REGEX) && data[i][j] === "*") {
        // adjacent logic
        // row before

        if (data[i - 1][j - 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i - 1],
            j - 1
          );
          data[i - 1] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        if (data[i - 1][j].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i - 1],
            j
          );
          data[i - 1] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        if (data[i - 1][j + 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i - 1],
            j + 1
          );
          data[i - 1] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        // current row
        if (data[i][j - 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i],
            j - 1
          );
          data[i] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        if (data[i][j + 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i],
            j + 1
          );
          data[i] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        // row after
        if (data[i + 1][j - 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i + 1],
            j - 1
          );
          data[i + 1] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        if (data[i + 1][j].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i + 1],
            j
          );
          data[i + 1] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        if (data[i + 1][j + 1].match(NUMBER_REGEX)) {
          const { currentNumber, nestedArr } = getAdjacentNumbers(
            data[i + 1],
            j + 1
          );
          data[i + 1] = nestedArr;
          currentCalc *= parseInt(currentNumber);
          totalAdjacent++;
        }

        if (totalAdjacent >= 2) {
          total += currentCalc;
        }
      }
    }
  }

  return total;
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

console.log(
  "Part 1: sum of any adjacent numbers of symbol",
  await getSumOfAdjacentSymbolNumbers()
);
console.log(
  "Part 1: sum of two adjacent numbers multiplied of gears (*)",
  await getGearRatio()
);
