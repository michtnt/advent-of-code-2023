type Point = [number, number];

const getLoopMaxSteps = async () => {
  const { grid, startingPointPosition } = await parseMazeData();
  const path = traverse(grid, startingPointPosition);
  return path.length / 2;
};

export function traverse(
  grid: string[][],
  startingPointPosition: Point,
  lastPointPosition?: Point
): Point[] {
  const current = grid[startingPointPosition[0]][startingPointPosition[1]];

  if (lastPointPosition) {
    if (current === "S") return [];
    const n = route(
      [
        startingPointPosition[0] - lastPointPosition[0],
        startingPointPosition[1] - lastPointPosition[1],
      ],
      current
    );

    const newStartingPointPosition: Point = [
      startingPointPosition[0] + n![0],
      startingPointPosition[1] + n![1],
    ];

    return [
      startingPointPosition,
      ...traverse(grid, newStartingPointPosition, startingPointPosition),
    ];
  } else {
    const currentAdjacent = [
      [-1, 0], // TOP
      [1, 0], // BOTTOM
      [0, -1], // LEFT
      [0, 1], // RIGHT
    ];

    for (const adj of currentAdjacent) {
      const a = grid
        .at(startingPointPosition[0] + adj[0])
        ?.at(startingPointPosition[1] + adj[1]);
      if (!a) continue;

      const n = route(adj, a);
      if (!n) continue;

      const newStartingPointPosition: Point = [
        startingPointPosition[0] + adj[0],
        startingPointPosition[1] + adj[1],
      ];

      return [
        startingPointPosition,
        ...traverse(grid, newStartingPointPosition, startingPointPosition),
      ];
    }
  }

  return [[-1, -1]]; // no path
}

function route([y, x]: number[], current: string): number[] | undefined {
  switch (current) {
    case `|`:
      return y === 1 && x === 0
        ? [1, 0]
        : y === -1 && x === 0
        ? [-1, 0]
        : undefined;
    case `-`:
      return y === 0 && x === 1
        ? [0, 1]
        : y === 0 && x === -1
        ? [0, -1]
        : undefined;
    case `L`:
      return y === 1 && x === 0
        ? [0, 1]
        : y === 0 && x === -1
        ? [-1, 0]
        : undefined;
    case `J`:
      return y === 1 && x === 0
        ? [0, -1]
        : y === 0 && x === 1
        ? [-1, 0]
        : undefined;
    case `7`:
      return y === -1 && x === 0
        ? [0, -1]
        : y === 0 && x === 1
        ? [1, 0]
        : undefined;
    case `F`:
      return y === -1 && x === 0
        ? [0, 1]
        : y === 0 && x === -1
        ? [1, 0]
        : undefined;
    default:
      return undefined;
  }
}

const parseMazeData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  const grid: string[][] = [];
  let startingPointPosition: Point = [-1, -1];

  for (let i = 0; i < linesArr.length; i++) {
    if (!grid[i]) {
      grid[i] = [];
    }

    grid[i] = linesArr[i].split("");

    const foundS = grid[i].indexOf("S");
    if (foundS !== -1) {
      startingPointPosition = [i, foundS];
    }
  }

  return { grid, startingPointPosition };
};

console.log(await getLoopMaxSteps());
