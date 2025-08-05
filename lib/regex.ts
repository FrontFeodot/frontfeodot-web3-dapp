const numericStringRegex = /^(?:$|[0-9]+(?:\.[0-9]*)?)$/;
const nonZeroRegex = /[1-9]/;

export const isNumericString = (str: string) => numericStringRegex.test(str);
export const isNonZero = (str: string) => nonZeroRegex.test(str);
