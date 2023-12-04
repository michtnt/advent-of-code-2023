const POSSIBLE_GAME_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
};

const CUBE_COMBO_REGEX = /(\d+)(red|green|blue)/;

const getGameOfCubesValue = async () => {
  const data = await parseGameData();

  let sumOfPossibleGameIndex = 0; // part 1
  let sumOfMinMultiplyOfCubes = 0; // part 2

  data.map((game) => {
    let isImpossible = false;

    let minRed = -1,
      minGreen = -1,
      minBlue = -1;

    game.cubesCombination.map((cubesCombo: string) => {
      let totalRed = 0,
        totalGreen = 0,
        totalBlue = 0;

      const separatedCubes = cubesCombo.split(",");

      separatedCubes.map((cubeValue) => {
        const regexResult = cubeValue.match(CUBE_COMBO_REGEX);

        if (regexResult) {
          const singleCubeNumber = parseInt(regexResult[1]);
          const singleCubeColor = regexResult[2];

          if (singleCubeColor === "red") {
            totalRed += singleCubeNumber;

            if (singleCubeNumber > minRed) {
              minRed = singleCubeNumber;
            }
          } else if (singleCubeColor === "green") {
            totalGreen += singleCubeNumber;

            if (singleCubeNumber > minGreen) {
              minGreen = singleCubeNumber;
            }
          } else if (singleCubeColor === "blue") {
            totalBlue += singleCubeNumber;

            if (singleCubeNumber > minBlue) {
              minBlue = singleCubeNumber;
            }
          }
        }
      });

      if (
        totalRed > POSSIBLE_GAME_CUBES.red ||
        totalGreen > POSSIBLE_GAME_CUBES.green ||
        totalBlue > POSSIBLE_GAME_CUBES.blue
      ) {
        isImpossible = true;
      }
    });

    if (!isImpossible) sumOfPossibleGameIndex += game.gameIndex;

    sumOfMinMultiplyOfCubes += minRed * minGreen * minBlue;
  });

  return { sumOfPossibleGameIndex, sumOfMinMultiplyOfCubes };
};

/** utils */
const parseGameData = async () => {
  const file = Bun.file("./input.txt");
  const text = await file.text();

  let gameArr: { gameIndex: number; cubesCombination: Array<string> }[] = [];

  text.split("\n").map((line, i) => {
    // remove "Game X:" prefix and remove space
    const newLine = line.substring(line.indexOf(":") + 1).replace(/\s/g, "");

    gameArr[i] = {
      gameIndex: i + 1,
      cubesCombination: newLine.split(";"),
    };
  });

  return gameArr;
};

const start = Date.now();

const { sumOfPossibleGameIndex, sumOfMinMultiplyOfCubes } =
  await getGameOfCubesValue();

console.log("Part 1: sum of possible game index", sumOfPossibleGameIndex);
console.log("Part 2: sum of minimum multiplied cubes", sumOfMinMultiplyOfCubes);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
