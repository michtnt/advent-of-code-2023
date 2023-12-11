type Galaxy = string[][];

const getShortestPathForGalaxyPair = async () => {
  const data = await parseGalaxyData();
  const hashIndices = findHashIndices(data);
  let total = 0;

  for (let i = 0; i < hashIndices.length; i++) {
    for (let j = i + 1; j < hashIndices.length; j++) {
      const currentHash = hashIndices[i];
      const compareHash = hashIndices[j];

      total +=
        Math.abs(currentHash[1] - compareHash[1]) +
        Math.abs(currentHash[0] - compareHash[0]);
    }
  }

  return total;
};

const findHashIndices = (matrix: Galaxy) => {
  const indices = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === "#") {
        indices.push([i, j]);
      }
    }
  }

  return indices;
};

const parseGalaxyData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  const galaxyMap: Galaxy = [];

  for (let i = 0; i < linesArr.length; i++) {
    const line = linesArr[i].split("");
    if (!galaxyMap[i]) {
      galaxyMap[i] = [];
    }
    galaxyMap[i] = line;
  }

  // handle horizontal expansion
  for (let i = 0; i < galaxyMap.length; i++) {
    const line = galaxyMap[i];
    if (!line.includes("#")) {
      galaxyMap.splice(i + 1, 0, Array(line.length).fill("."));
      i++;
    }
  }

  // handle vertical expansion
  for (let col = 0; col < galaxyMap[0].length; col++) {
    let hasHash = false;

    for (let row = 0; row < galaxyMap.length; row++) {
      if (galaxyMap[row][col] === "#") {
        hasHash = true;
        break;
      }
    }

    if (!hasHash) {
      for (let row = 0; row < galaxyMap.length; row++) {
        galaxyMap[row].splice(col, 0, ".");
      }
      col++;
    }
  }

  return galaxyMap;
};

const start = Date.now();

console.log(
  "Part 1: get sum of shortest path of galaxy pair",
  await getShortestPathForGalaxyPair()
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
