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
function arrayRandomizer(array) {
	var swap = function(array,i,j) {
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
		return array;
	}
	array.forEach(function(val, index, list){
		var randomIndex = parseInt(Math.random()*list.length,10);
		swap(list,randomIndex,index);
	})
	return array;
}

function generateRandomPair(range1, range2) {
	return [parseInt(Math.random()*range1,10),parseInt(Math.random()*range2,10)];
}

function createSudokuBoard() {
	var seedRow = [1,2,3,4,5,6,7,8,9];
	var board = [];
	for (i = 0; i < 9; i ++) {
		board[i] = arrayRandomizer(seedRow.slice());// new instance of array needs to be passed since passing same array will modify the seedRow itself resulting in same row being repeated.
	}
	for(j = 0; j < 9; j++) {
		var randomIndexes = generateRandomPair(9,9);
		board[randomIndexes[0]][randomIndexes[1]] = '?';
	}
	return board;
}



// Sudoku solver functions
function isElementInRow(array,index, element) {
	var row = array[index];
	console.log('element '+ element +' in row' + row);
	return (row.indexOf(element) !== -1);
}

function isElementInColumn(array,index, element) {
	var column = array.map(function(row){return row[index]})
	console.log('element '+ element +' in column' + column);
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
	return {currentSolution: possibleSolution, location: location};
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

function solutionIterator(array) {
	var solutionStack = [];
	var emptyCells = getEmptyCellLocations(array);
	emptyCells.forEach(function(cell){
		solutionStack.push(pointSolver(array,cell,1));
	})
	console.log(solutionStack);
}

sampleBoard = createSudokuBoard();
console.log(sampleBoard);
solutionIterator(sampleBoard);
