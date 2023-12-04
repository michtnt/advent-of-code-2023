const getWinningPoints = async () => {
  const data = await parseScratchCardsData();
  let total = 0;

  for (let i = 0; i < data.length; i++) {
    let currentPoints = 0;

    data[i].elvesNumbers.map((elvesNumber) => {
      if (elvesNumber !== "" && data[i].winningNumbers.includes(elvesNumber)) {
        currentPoints = currentPoints === 0 ? 1 : (currentPoints *= 2);
      }
    });

    total += currentPoints;
  }

  return total;
};

const getCopiedScratchCardPoints = async () => {
  const data = await parseScratchCardsData();
  const totalCards = data.length;
  const cardsCopies = new Array(totalCards + 1).fill(0);
  cardsCopies[1] = 1;

  let acc = 0;

  for (let i = 1; i <= totalCards; ++i) {
    let duplicates = 0;

    data[i - 1].elvesNumbers.map((elvesNumber) => {
      if (
        elvesNumber !== "" &&
        data[i - 1].winningNumbers.includes(elvesNumber)
      ) {
        duplicates++;
      }
    });

    acc += cardsCopies[i];
    if (i + 1 <= totalCards) cardsCopies[i + 1] += acc;
    if (i + duplicates + 1 <= totalCards)
      cardsCopies[i + duplicates + 1] -= acc;
  }

  for (let i = 1; i <= totalCards; ++i) cardsCopies[i] += cardsCopies[i - 1];
  return cardsCopies.reduce((acc, x) => acc + x);
};

const parseScratchCardsData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  const scratchCardsData: {
    elvesNumbers: Array<string>;
    winningNumbers: Array<string>;
  }[] = [];

  linesArr.map((line, i) => {
    const newLine = line.substring(line.indexOf(":") + 2);
    const separatedLine = newLine.split(" | ");
    const separatedWinningNumbers = separatedLine[0].split(" ");
    const separatedElvesNumbers = separatedLine[1].split(" ");

    scratchCardsData[i] = {
      winningNumbers: separatedWinningNumbers,
      elvesNumbers: separatedElvesNumbers,
    };
  });

  return scratchCardsData;
};

console.log("Part 1: get sum of winning points", await getWinningPoints());
console.log(
  "Part 2: get sum of winning points incl. copied scratch cards",
  await getCopiedScratchCardPoints()
);
