interface Lens {
  label: string;
  focalLength: number;
}

const getSumOfSequence = async () => {
  const sequence = await parseSequenceData();
  return getHashValue(sequence);
};

const getSumOfFocusingPower = async () => {
  const sequence = await parseSequenceData();
  const boxes: Lens[][] = Array(256)
    .fill(null)
    .map(() => []);

  for (const s of sequence) {
    if (s.endsWith("-")) {
      // remove lens
      const label = s.slice(0, -1);
      const hash = getHashValue([label]);
      boxes[hash] = boxes[hash].filter((lens) => lens.label !== label);
    } else {
      const [label, focalString] = s.split("=");
      const focalLength = Number(focalString);
      const hash = getHashValue([label]);
      const index = boxes[hash].findIndex((lens) => lens.label === label);

      if (index === -1) {
        // not found: add the lens to the box immediately behind any lenses already in the box
        boxes[hash].push({ label, focalLength });
      } else {
        // found: replace old lens
        boxes[hash][index].focalLength = focalLength;
      }
    }
  }

  const focusingPowers = boxes.flatMap((box, hash) => {
    return box.map(
      ({ focalLength }, index) => (1 + hash) * (1 + index) * focalLength
    );
  });

  return focusingPowers.reduce((acc, currentVal) => acc + currentVal, 0);
};

const getHashValue = (sequence: string[]) => {
  return sequence.reduce((sum, s) => {
    const value = s
      .split("")
      .reduce((acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256, 0);
    return sum + value;
  }, 0);
};

const parseSequenceData = async () => {
  const file = Bun.file("./input.txt");
  const lines = (await file.text()).split(",");

  return lines;
};

const start = Date.now();

console.log("Part 1: sum of initialization sequence", await getSumOfSequence());
console.log("Part 2: sum of focusing powers", await getSumOfFocusingPower());

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
