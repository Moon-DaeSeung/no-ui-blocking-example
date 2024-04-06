export const randomNumbers = Array.from(
	{ length: 10000000 },
	() => Math.floor(Math.random() * 100000) + 1
);
