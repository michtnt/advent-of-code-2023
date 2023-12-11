type Galaxy = string[][];

const getShortestPathForGalaxyPair = async () => {
  const data = await parseGalaxyData();
  const hashIndices = findHashIndices(data);
  let total = 0;

  for (let i = 0; i < hashIndices.length; i++) {
    for (let j = i + 1; j < hashIndices.length; j++) {
      const currentHash = hashIndices[i];
      const compareHash = hashIndices[j];

      const shortestPathLength = findShortestPath(
        data,
        currentHash,
        compareHash
      );
      total += shortestPathLength;
    }
  }

  return total;
};

const findShortestPath = (matrix: Galaxy, start: number[], end: number[]) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Create a visited matrix to keep track of visited cells
  const visited = new Array(rows)
    .fill(false)
    .map(() => new Array(cols).fill(false));

  // Define possible moves (up, down, left, right)
  const moves = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Queue for BFS
  const queue = [{ row: start[0], col: start[1], distance: 0 }];

  while (queue.length > 0) {
    const { row, col, distance } = queue.shift();

    // Check if the current cell is the destination
    if (row === end[0] && col === end[1]) {
      return distance;
    }

    // Mark the current cell as visited
    visited[row][col] = true;

    // Explore all possible moves
    for (const [dx, dy] of moves) {
      const newRow = row + dx;
      const newCol = col + dy;

      // Check if the new position is within bounds and has not been visited
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol]
      ) {
        queue.push({ row: newRow, col: newCol, distance: distance + 1 });
        visited[newRow][newCol] = true;
      }
    }
  }

  return -1; // no path found
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
