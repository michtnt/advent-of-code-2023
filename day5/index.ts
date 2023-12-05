const getLowestLocationNumber = async () => {
  const data = await parseAlmanacData();

  let seedNumber: string[] = data[0][0].split(" ");

  for (let i = 1; i < data.length; i++) {
    let sourceMappings: Record<string, number> = {};

    for (let k = 0; k < data[i].length; k++) {
      const lineArr = data[i][k].split(" ");
      const destinationRangeStart = parseInt(lineArr[0]);
      const sourceRangeStart = parseInt(lineArr[1]);
      const rangeLength = parseInt(lineArr[2]);

      seedNumber.map((seed) => {
        const currentSeedNumber = parseInt(seed);

        if (!sourceMappings[seed]) {
          sourceMappings[seed] = currentSeedNumber;
        }

        if (
          currentSeedNumber >= sourceRangeStart &&
          currentSeedNumber < sourceRangeStart + rangeLength
        ) {
          sourceMappings[seed] =
            destinationRangeStart + currentSeedNumber - sourceRangeStart;
        }
      });
    }

    seedNumber = seedNumber.map((seed) => {
      const newSeedValue = sourceMappings[seed];
      return newSeedValue.toString();
    });
  }

  const intArray = seedNumber.map(Number);
  const lowestNumber = Math.min(...intArray);

  return lowestNumber;
};

const parseAlmanacData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n\n");

  const almanacMappings = linesArr.map((line) => {
    const splittedLine = line.substring(line.indexOf(":") + 2).split("\n");

    return splittedLine;
  });

  return almanacMappings;
};

console.log(await getLowestLocationNumber());
