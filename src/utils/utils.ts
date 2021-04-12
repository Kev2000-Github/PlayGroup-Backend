export function tictactoe(arr) {
	arr = arr.map(item => parseInt(item));
	const biArr = [arr.slice(0, 3), arr.slice(3, 6), arr.slice(6, 9)];
	let sums = biArr.map(rows => Math.abs(rows.reduce((a, b) => a + b)));
	if (sums.includes(3)) return true;
	sums = biArr.map((rows, idx) => Math.abs(biArr[0][idx] + biArr[1][idx] + biArr[2][idx]));
	if (sums.includes(3)) return true;
	sums = [Math.abs(biArr[0][0] + biArr[1][1] + biArr[2][2])];
	sums.push(Math.abs(biArr[2][0] + biArr[1][1] + biArr[0][2]));
	if (sums.includes(3)) return true;
	if (!arr.includes(0)) return null;
	return false;
}