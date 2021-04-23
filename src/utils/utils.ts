const parseToSquareMatrix = (arr: Array<number>) => {
	const matrix: Array<number[]> = [];
	const n = Math.sqrt(arr.length);
	if (n !== Math.floor(n)) return [];
	for (let i = 0; i < n; i++) {
		const counter = i * n;
		matrix.push(arr.slice(counter, n + counter));
	}
	return matrix;
}

const transposeMatrix = (matrix: Array<number[]>) => {
	const n = matrix.length;
	const transMatrix: Array<number[]> = [];

	for (let i = 0; i < n; i++) {
		let row: Array<number> = [];
		for (let j = 0; j < n; j++) {
			row.push(matrix[j][i]);
		}
		transMatrix.push(row);
	}
	return transMatrix;
}

export function processTicTacToeMatrix(arr) {
	arr = arr.map(item => parseInt(item));
	let biArr = parseToSquareMatrix(arr);
	const MATRIX_DIMENSION = 3;

	//Check rows
	biArr = biArr.map(rows => {
		const sums = Math.abs(rows.reduce((a, b) => a + b));
		if (sums === MATRIX_DIMENSION) return Array(MATRIX_DIMENSION).fill(rows[0] * 10);
		else return rows;
	});
	let transMatrix = transposeMatrix(biArr);
	if (transMatrix[0].reduce((a, b) => a + b) > MATRIX_DIMENSION) return biArr.flat();

	//Check columns
	transMatrix = transMatrix.map(rows => {
		const sums = Math.abs(rows.reduce((a, b) => a + b));
		if (sums === MATRIX_DIMENSION) return Array(MATRIX_DIMENSION).fill(rows[0] * 10);
		else return rows;
	});
	biArr = transposeMatrix(transMatrix);
	if (biArr[0].reduce((a, b) => a + b) > MATRIX_DIMENSION) return biArr.flat();

	//Check Diagonal
	let sum = Math.abs(biArr[0][0] + biArr[1][1] + biArr[2][2])
	if (sum === 3) {
		biArr = biArr.map((row, idx) => {
			return row.map((value, i) => i === idx ? value * 10 : value);
		});
		return biArr.flat();
	}

	//Check diagonal reversed
	sum = Math.abs(biArr[2][0] + biArr[1][1] + biArr[0][2]);
	if (sum === 3) {
		biArr = biArr.map((row, idx) => {
			return row.map((value, i) => MATRIX_DIMENSION - 1 - i === idx ? value * 10 : value);
		});
	}

	return biArr.flat();
}

export const playTicTacToe = (play: number, grid: Array<number>, value: number) => {
	return grid.map((element, idx) => {
		if (play === idx) return value;
		else return element;
	})
}

export const range = (start: number, end: number) => {
	if (end < start) return [];
	const length = end - start;
	return Array.from({ length }, (_, i) => start + i);
}

type squareType = {
	value: number,
	pos: string
}
type squareIndexed = {
	square: squareType,
	idx: number
}
type chessBoardType = Array<squareType>


export let createChessPositions = () => {
	const rowPos = range("A".charCodeAt(0), "I".charCodeAt(0)).map(value => String.fromCharCode(value));
	const columnPos = range(1, 9).map(value => value.toString());
	const matrix = rowPos.map(value => {
		return columnPos.map(num => ({ value: 0, pos: value + num }));
	})
	return matrix.flat();
}

export const setupChessBoard = () => {
	const MAX = 64;
	let matrix = createChessPositions();
	const chessPositions = {
		rooks: [0, 7, matrix.length - 1, matrix.length - 8],
		knights: [1, 6, matrix.length - 2, matrix.length - 7],
		bishops: [2, 5, matrix.length - 3, matrix.length - 6],
		kings: [3, matrix.length - 4],
		queens: [4, matrix.length - 5],
		pawns: [range(8, 16), range(matrix.length - 16, matrix.length - 8)].flat()
	}
	matrix = matrix.map((element, idx) => {
		const color = idx < MAX / 2 ? 1 : -1;
		if (chessPositions.pawns.includes(idx)) return { ...element, value: 1 * color }
		else if (chessPositions.rooks.includes(idx)) return { ...element, value: 2 * color }
		else if (chessPositions.knights.includes(idx)) return { ...element, value: 3 * color }
		else if (chessPositions.bishops.includes(idx)) return { ...element, value: 4 * color }
		else if (chessPositions.queens.includes(idx)) return { ...element, value: 5 * color }
		else if (chessPositions.kings.includes(idx)) return { ...element, value: 6 * color }
		else return element;
	});
	return matrix;
}

export const move = (from: squareIndexed, to: squareIndexed, chessBoard: chessBoardType) => {
	chessBoard[from.idx].value = 0;
	chessBoard[to.idx].value = from.square.value;
	return chessBoard;
}

export const checkAvailablePromotion = (chessBoard: chessBoardType) => {
	for (let i = 0; i < 8; i++) {
		if (Math.abs(chessBoard[i].value) === 1) return chessBoard[i];
	}
	for (let i = chessBoard.length - 8; i < chessBoard.length; i++) {
		if (Math.abs(chessBoard[i].value) === 1) return chessBoard[i];
	}
	return null;
}