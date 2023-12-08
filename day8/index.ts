const getSteps = async () => {
  const { navigation, networkMap } = await parseNetworkData();

  const breakPoint = "ZZZ";
  let startPoint = "AAA";
  let steps = 0;
  let i = 0;

  while (startPoint !== breakPoint) {
    const curNavElement = i % navigation.length;

    if (navigation[curNavElement] === "R") {
      startPoint = networkMap[startPoint][1];
    } else if (navigation[curNavElement] === "L") {
      startPoint = networkMap[startPoint][0];
    }

    steps++;
    i++;
  }

  return steps;
};

const getParallelSteps = async () => {
  const { navigation, networkMap } = await parseNetworkData();

  const allSteps = [];
  const startPoints = Object.keys(networkMap).filter((key) =>
    key.endsWith("A")
  );

  for (let j = 0; j < startPoints.length; j++) {
    let startPoint = startPoints[j];
    let steps = 0;
    let i = 0;

    while (!startPoint.endsWith("Z")) {
      const currentNode = i % navigation.length;

      if (navigation[currentNode] === "R") {
        startPoint = networkMap[startPoint][1];
      } else if (navigation[currentNode] === "L") {
        startPoint = networkMap[startPoint][0];
      }

      steps++;
      i++;
    }

    allSteps.push(steps);
  }

  return findLCMFromArray(allSteps);
};

/** utils */
const findLCMFromArray = (steps: number[]) => {
  let initialStep = steps[0];

  for (let i = 1; i < steps.length; i++) {
    initialStep = findLCM(initialStep, steps[i]);
  }

  return initialStep;
};

const findLCM = (a: number, b: number) => {
  return (a * b) / findGCD(a, b);
};

const findGCD = (a: number, b: number): number => {
  return b === 0 ? a : findGCD(b, a % b);
};

const parseNetworkData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  const networkMap: Record<string, string[]> = {};

  linesArr.slice(2).map((line) => {
    const splittedLine = line.split(" = ");

    const nodes = splittedLine[1]
      ?.slice(1, -1)
      .split(",")
      .map((item) => item.trim());

    networkMap[splittedLine[0]] = nodes;
  });

  return {
    navigation: linesArr[0],
    networkMap,
  };
};

const start = Date.now();

console.log("Part 1: steps required from AAA -> ZZZ", await getSteps());
console.log(
  "Part 2: parallel steps required from **A -> **Z",
  await getParallelSteps()
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
