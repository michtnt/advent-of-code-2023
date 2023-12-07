const CARDS_COMBO = [
  [5], // five of a kind
  [1, 4], // four of a kind
  [2, 3], // full house
  [1, 1, 3], // three of a kind
  [1, 2, 2], // two pair
  [1, 1, 1, 2], // one pair
  [1, 1, 1, 1, 1], // high card
];

const CAMEL_CARDS_STRENGTH_ORDER = "AKQJT98765432";
const CAMEL_CARDS_WITH_JOKER_STRENGTH_ORDER = "AKQT98765432J";

const getTotalWinnings = async (includeJoker: boolean = false) => {
  const data = await parseCamelCardsData();
  let rankLength = data.length;
  let totalWinnings = 0;

  // strongest -> weakest
  const strengthOrder: string = includeJoker
    ? CAMEL_CARDS_WITH_JOKER_STRENGTH_ORDER
    : CAMEL_CARDS_STRENGTH_ORDER;

  const winningCardsComboMap: string[][] = CARDS_COMBO.map(() => []);
  const cardToBet: Record<string, number> = {};

  for (let i = 0; i < rankLength; i++) {
    const cardCombo = data[i][0];
    const cardBet = data[i][1];
    const cardComboCharMap: Record<string, number> = {};

    cardToBet[cardCombo] = parseInt(cardBet);

    for (let j = 0; j < cardCombo.length; j++) {
      if (!includeJoker || cardCombo[j] !== "J") {
        cardComboCharMap[cardCombo[j]] =
          (cardComboCharMap[cardCombo[j]] || 0) + 1;
      }
    }

    let winningCardCombo = Object.values(cardComboCharMap).sort();

    // transform joker! any combo that have joker card is promoted!
    let promotedRanks = cardCombo
      .split("")
      .filter((char) => char === "J").length;

    const bestJokerCombinations = [];

    if (includeJoker) {
      if (promotedRanks === 5) {
        // handle JJJJJ
        winningCardCombo = CARDS_COMBO[0];
      } else {
        for (let i = 0; i < winningCardCombo.length; i++) {
          const copiedArray = [...winningCardCombo];
          copiedArray[i] += promotedRanks;
          bestJokerCombinations.push(copiedArray);
        }

        for (let j = 0; j < bestJokerCombinations.length; j++) {
          for (let k = 0; k < CARDS_COMBO.length; k++) {
            if (
              JSON.stringify(bestJokerCombinations[j]) ==
              JSON.stringify(CARDS_COMBO[k])
            ) {
              winningCardCombo = CARDS_COMBO[k];
              break;
            }
          }
        }
      }
    }

    CARDS_COMBO.map((combo, i) => {
      if (JSON.stringify(winningCardCombo) === JSON.stringify(combo)) {
        winningCardsComboMap[i].push(cardCombo);
      }
    });
  }

  winningCardsComboMap.forEach((winningCardCategory) => {
    if (winningCardCategory.length > 0) {
      winningCardCategory.sort((a, b) => {
        for (let j = 0; j < a.length; j++) {
          const indexA = strengthOrder.indexOf(a[j]);
          const indexB = strengthOrder.indexOf(b[j]);

          const indexDiff = indexA - indexB;
          if (indexDiff !== 0) {
            // If characters are different, use custom order
            return indexDiff;
          }
        }
        return 0; // If all characters are the same, no need to change the order
      });

      winningCardCategory.forEach((winningCard) => {
        totalWinnings += rankLength * cardToBet[winningCard];
        rankLength--;
      });
    }
  });

  return totalWinnings;
};

const parseCamelCardsData = async () => {
  const file = Bun.file("./input.txt");
  const linesArr = (await file.text()).split("\n");
  return linesArr.map((line) => line.split(" "));
};

const start = Date.now();

console.log("Part 1: get total winnings:", await getTotalWinnings());
console.log(
  "Part 2: get total winnings with Joker:",
  await getTotalWinnings(true)
);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
