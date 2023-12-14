const getSumOfNorthBeamLoad = async () => {
  const data = await parseReflectorDishData();
  const verticalLength = data.length;
  const horizontalLength = data[0].length;

  const discMap = Array(verticalLength);
  const discArrangement = Array(verticalLength).fill(0);

  let sum = 0;

  for (let i = 0; i < horizontalLength; i++) {
    let cubeRockPosition = 0;

    if (!discMap[i]) {
      discMap[i] = [0];
    }

    for (let j = 0; j < verticalLength; j++) {
      const currentPosition = data[j][i];
      const lastElement = discMap[i].length - 1;

      if (currentPosition === "O") {
        discMap[i][lastElement] = {
          value: (discMap[i][lastElement]?.value || 0) + 1,
          cubeRockPosition,
        };
      } else if (currentPosition === "#") {
        discMap[i].push(0);
        cubeRockPosition = j + 1;
      }
    }

    for (const currentDisc of discMap[i]) {
      if (currentDisc) {
        for (let m = 0; m < currentDisc.value; m++) {
          discArrangement[m + currentDisc.cubeRockPosition]++;
        }
      }
    }
  }

  discArrangement.forEach((count, i) => {
    sum += (count || 0) * (verticalLength - i);
  });

  return sum;
};

const parseReflectorDishData = async () => {
  const file = Bun.file("./input.txt");
  const lines = (await file.text()).split("\n");

  return lines;
};

const start = Date.now();

console.log(
  "Part 1: total load of north support beam",
  await getSumOfNorthBeamLoad()
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
