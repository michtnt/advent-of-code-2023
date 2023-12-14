const getReflections = async () => {
  const data = await parseMirrorData();
  let sumOfReflection = 0;
  let sumOfSmudgedReflection = 0;

  let grid: string[][] = [];

  for (const line of data) {
    if (line.length === 0) {
      const [reflectionValue, smudgedReflectionValue] = processGrid(grid);
      sumOfReflection += reflectionValue;
      sumOfSmudgedReflection += smudgedReflectionValue;

      grid = []; // empty grid
      continue;
    }

    grid.push(line.split(""));
  }

  const [reflectionValue, smudgedReflectionValue] = processGrid(grid);

  sumOfReflection += reflectionValue;
  sumOfSmudgedReflection += smudgedReflectionValue;

  return { sumOfReflection, sumOfSmudgedReflection };
};

const processGrid = (grid: string[][]) => {
  const originalRow = findHorizontalMirror(grid);
  const originalCol = findVerticalMirror(grid);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col] = grid[row][col] === "#" ? "." : "#";

      let mirrorRow = findHorizontalMirror(grid, originalRow);
      if (mirrorRow !== -1) {
        return [
          originalRow !== -1 ? 100 * originalRow : originalCol,
          100 * mirrorRow,
        ];
      }

      let mirrorCol = findVerticalMirror(grid, originalCol);
      if (mirrorCol !== -1) {
        return [
          originalRow !== -1 ? 100 * originalRow : originalCol,
          mirrorCol,
        ];
      }

      grid[row][col] = grid[row][col] === "#" ? "." : "#";
    }
  }

  return [0, 0];
};

const findHorizontalMirror = (grid: string[][], invalidRow = -1): number => {
  for (let row = 1; row < grid.length; row++) {
    let isValidMirror = true;

    for (
      let mirrorRow = 1;
      row - mirrorRow >= 0 && row + mirrorRow - 1 < grid.length;
      mirrorRow++
    ) {
      if (
        grid[row - mirrorRow].join("") !== grid[row + mirrorRow - 1].join("")
      ) {
        isValidMirror = false;
        break;
      }
    }

    if (isValidMirror && invalidRow !== row) {
      return row;
    }
  }

  return -1;
};

const findVerticalMirror = (grid: string[][], invalidCol = -1): number => {
  for (let col = 1; col < grid[0].length; col++) {
    let isValidMirror = true;

    for (
      let mirrorCol = 1;
      col - mirrorCol >= 0 && col + mirrorCol - 1 < grid[0].length;
      mirrorCol++
    ) {
      let leftCol = "";
      let rightCol = "";

      for (let row = 0; row < grid.length; row++) {
        leftCol += grid[row][col - mirrorCol];
        rightCol += grid[row][col + mirrorCol - 1];
      }

      if (leftCol !== rightCol) {
        isValidMirror = false;
        break;
      }
    }

    if (isValidMirror && invalidCol !== col) {
      return col;
    }
  }

  return -1;
};

const parseMirrorData = async () => {
  const file = Bun.file("./input.txt");
  const contents = await file.text();

  const lines = contents.trim().split(/\n/g);
  return lines;
};

const start = Date.now();

const { sumOfReflection, sumOfSmudgedReflection } = await getReflections();

console.log("Part 1: get sum of reflections", sumOfReflection);
console.log("Part 2: get sum of smudged reflections", sumOfSmudgedReflection);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
