const getSumOfSequence = async () => {
  const data = await parseSequenceData();
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const currentLine = data[i];
    let value = 0;

    for (let j = 0; j < currentLine.length; j++) {
      value = ((value + currentLine[j].charCodeAt(0)) * 17) % 256;
    }

    sum += value;
  }

  return sum;
};

const parseSequenceData = async () => {
  const file = Bun.file("./input.txt");
  const lines = (await file.text()).split(",");

  return lines;
};

const start = Date.now();

console.log("Part 1: sum of initialization sequence", await getSumOfSequence());

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
