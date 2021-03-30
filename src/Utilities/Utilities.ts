export const provideValidNumber = (num: string): number => {
	if (!num.length) return 0;
	const parseInteger = Number.parseInt(num);
	if (parseInteger) return parseInteger;
	else if (num.length === 1) return 0;
	return Number.parseInt(num.substring(0, num.length - 1));
};
