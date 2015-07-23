// Sudoku Generator Functions
/*
  SUDOKU BOARD
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
1 2 3 4 5 6 7 8 9
*/
var swap = function(array,i,j) {
	var temp = array[i];
	array[i] = array[j];
	array[j] = temp;
	return array;
}

function randomizeArrayElements(array) {
	array.forEach(function(val, index, list){
		var randomIndex = parseInt(Math.random()*list.length,10);
		swap(list,randomIndex,index);
	})
	return array;
}

function generateRandomPair(range1, range2) {
	return [parseInt(Math.random()*range1,10),parseInt(Math.random()*range2,10)];
}

function rotateArray(array) {
	array.push(array.shift())
	return array;
}

function randomizeRows(array) {
	var swapIndices = generateRandomPair(9,9);
	swap(array, swapIndices[0],swapIndices[1]);
	return array;
}

function removeRandomEntries(array, number) {
	for(j = 0; j < number; j++) {
		var randomIndexes = generateRandomPair(9,9);
		array[randomIndexes[0]][randomIndexes[1]] = '?';
	}
	return array;
}

function createSudokuBoard() {
	var seedRow = [1,2,3,4,5,6,7,8,9];
	var offsets = randomizeArrayElements(seedRow.slice());
	var board = [];
	var entry = offsets.slice();
	for(i = 0; i < 9; i ++) {
		board.push(entry);
		entry = rotateArray(entry.slice());
	}
	board = randomizeRows(board);
	board = removeRandomEntries(board, 35);
	return board;
}

function printSudokuBoard(board) {
	board.forEach(function(row){
		console.log('|---+---+---+---+---+---+---+---+---|');
		console.log('| ' + row.join(' | ') + ' |');
	});
	console.log('|---+---+---+---+---+---+---+---+---|');
}

// Sudoku solver functions
function isElementInRow(array,index, element) {
	var row = array[index];
	return (row.indexOf(element) !== -1);
}

function isElementInColumn(array,index, element) {
	var column = array.map(function(row){return row[index]})
	return (column.indexOf(element) !== -1);
}

function isValidSolution(array,location,element) {
	var rowTest = isElementInRow(array,location[0], element);
	var columnTest = isElementInColumn(array, location[1], element);
	if(!rowTest && !columnTest) {
		return true;
	}
	else {
		return false;
	}
}

function pointSolver(array, location, initialPossibleSolution) {
	var possibleSolution = initialPossibleSolution;
	while(!isValidSolution(array, location, possibleSolution) && possibleSolution < 11) {
		possibleSolution ++;
	}
	return {value: possibleSolution, location: location};
}

function getEmptyCellLocations(array) {
	var locations = [];
	array.forEach(function(row, i){
		return row.forEach(function(cell, j){
			if(cell === '?') {
				locations.push([i,j]);
			}
		})
	})
	return locations;
}

function isSolutionWithinBounds(solution) {
	if(solution.value < 10) {
		return true;
	}
	else {
		return false;
	}
}

function solutionIterator(array) {
	var solutionStack = [];
	var emptyCells = getEmptyCellLocations(array);
	var index = 0;
	var recursiveSolver = function(array, cell, value) {
		//console.log(solutionStack.length);
		var currentSolution = pointSolver(array,cell,value);
		if(isSolutionWithinBounds(currentSolution)) {
			solutionStack.push(currentSolution);
			array[currentSolution.location[0]][currentSolution.location[1]] = currentSolution.value;
			if(index+1 < emptyCells.length) {
				return recursiveSolver(array,emptyCells[++index], 1);
			}
			else {
				return 0;
			}
		}
		else {
			--index;
			if(solutionStack.length) {
				var prevSolution = solutionStack.pop();
				array[prevSolution.location[0]][prevSolution.location[1]] = '?';
				return recursiveSolver(array, prevSolution.location, ++prevSolution.value);
			}
			else {
				return 0;
			}
		}
	}
	recursiveSolver(array,emptyCells[index],1);
	return {solvedMatrix: array, solutions: solutionStack}
}

sampleBoard = createSudokuBoard();
console.log('*************Unsolved Sudoku Board**********')
printSudokuBoard(sampleBoard);
var result = solutionIterator(sampleBoard);
console.log("**********Solved Sudoku Board***********")
printSudokuBoard(result.solvedMatrix);
//console.log(result.solutions);
