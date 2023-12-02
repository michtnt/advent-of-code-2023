const POSSIBLE_GAME_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
};

const CUBE_COMBO_REGEX = /(\d+)(red|green|blue)/;

const getSumOfPossibleGameIndex = async () => {
  const data = await parseGameData();
  let total = 0;

  data.map((game) => {
    const isImpossible = game.cubesCombination.some((cubesCombo: string) => {
      let totalRed = 0,
        totalGreen = 0,
        totalBlue = 0;

      const separatedCubes = cubesCombo.split(",");

      separatedCubes.map((cubeValue) => {
        const regexResult = cubeValue.match(CUBE_COMBO_REGEX);
        if (regexResult) {
          if (regexResult[2] === "red") {
            totalRed += parseInt(regexResult[1]);
          } else if (regexResult[2] === "green") {
            totalGreen += parseInt(regexResult[1]);
          } else if (regexResult[2] === "blue") {
            totalBlue += parseInt(regexResult[1]);
          }
        }
      });

      if (
        totalRed > POSSIBLE_GAME_CUBES.red ||
        totalGreen > POSSIBLE_GAME_CUBES.green ||
        totalBlue > POSSIBLE_GAME_CUBES.blue
      ) {
        return true;
      }
    });

    if (!isImpossible) total += game.gameIndex;
  });

  return total;
};

const getMinMultiplyOfCubes = async () => {
  const data = await parseGameData();
  let total = 0;

  data.map((game) => {
    let minRed = -Infinity,
      minGreen = -Infinity,
      minBlue = -Infinity;

    game.cubesCombination.map((value: string) => {
      const separatedCubes = value.split(",");

      separatedCubes.map((cubeValue) => {
        const regexResult = cubeValue.match(CUBE_COMBO_REGEX);

        if (regexResult) {
          const singleCubeValue = parseInt(regexResult[1]);

          if (regexResult[2] === "red" && singleCubeValue > minRed) {
            minRed = parseInt(regexResult[1]);
          } else if (regexResult[2] === "green" && singleCubeValue > minGreen) {
            minGreen = parseInt(regexResult[1]);
          } else if (regexResult[2] === "blue" && singleCubeValue > minBlue) {
            minBlue = parseInt(regexResult[1]);
          }
        }
      });
    });

    total += minRed * minGreen * minBlue;
  });

  return total;
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

console.log(
  "Part 1: sum of possible game index",
  await getSumOfPossibleGameIndex()
);
console.log(
  "Part 2: sum of minimum multiplied cubes",
  await getMinMultiplyOfCubes()
);
