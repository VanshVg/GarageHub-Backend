export const randomNumberGenerator = (digits: number) => {
  let maximum: string = "9",
    minimum = "1";

  while (digits > 1) {
    maximum += "9";
    minimum += "0";
    digits--;
  }

  return Math.floor(Math.random() * (+minimum - +maximum + 1)) + +maximum;
};
