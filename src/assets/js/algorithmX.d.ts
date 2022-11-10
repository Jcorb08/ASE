class Shape{
    constructor(id,coords,arrayLength){
        // the letter A-L
        this.id = id;
        // represented as 0-11 for the algorithmX array

        // change to take x and y as inputs
        this.arrayID = arrayLength + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        // define coords here how you said rob, the pattern in a 1d array
        // represented as 11110001
        // a list of them rotated clockwise
        this.coords = coords;
    }
}

class Node {

    //Connected Nodes
    protected left: Node;
    protected right: Node;
    protected top: Node;
    protected bottom: Node;
    protected column: Node;

    //Activated
    protected activated: boolean;

    //IDs
    protected rowID: number;
    protected columnID: number;

    //Setters
    public setLeft(left: Node){
        this.left = left;
    }
    public setRight(right: Node){
        this.right = right;
    }
    public setTop(top: Node){
        this.top = top;
    }
    public setBottom(bottom: Node){
        this.bottom = bottom;
    }
    public setColumn(column: Node){
        this.column = column;
    }
    public setActivated(activated: boolean){
        this.activated = activated;
    }
    //Getters
    public getLeft(): Node{
        return this.left;
    }
    public getRight(): Node{
        return this.right;
    }
    public getTop(): Node{
        return this.top;
    }
    public getBottom(): Node{
        return this.bottom;
    }
    public getColumn(): Node{
        return this.column;
    }
    public getActivated(): boolean{
        return this.activated;
    }
    public getColumnID(): number{
        return this.columnID;
    }
    public getRowID(): number{
        return this.rowID;
    }

    //Construct
    constructor(activated: boolean, rowID: number, columnID: number){
        this.activated = activated;
        this.rowID = rowID;
        this.columnID = columnID;
    }

    //cover a given node
    public cover(targetNode: Node){
        //pointer to header column
        var columnNode: ColumnHeader = targetNode.getColumn();

        //unlink column header from its neighbours
        columnNode.getLeft().setRight(columnNode.getRight());
        columnNode.getRight().setLeft(columnNode.getLeft());

        //move down column and remove each row
        //by traversing right
        for (let row = columnNode.getBottom(); row != columnNode; row = row.getBottom()) {
            for (let rightNode = row.getRight(); rightNode != row; rightNode = rightNode.getRight()) {
                rightNode.getTop().setBottom(rightNode.getBottom());
                rightNode.getBottom().setTop(rightNode.getTop());
                //get column and decrease nodeCount
                rightNode.getColumn().setNodeCount(rightNode.getColumn().getNodeCount()-1);
            }
            
        }
    }

    //uncover a given node
    public uncover(targetNode: Node){

    }

}

class ColumnHeader extends Node {
    private nodeCount: number;

    constructor(activated: boolean, rowID: number, columnID: number){
        super(activated,rowID,columnID);
        this.nodeCount = 0;
    }
    //Setters
    public setNodeCount(nodeCount: number){
        this.nodeCount = nodeCount;
    }
    //Getters
    public getNodeCount(): number{
        return this.nodeCount;
    }

    //get min Column
    public getMinColumn(): ColumnHeader{
        var minColumn: ColumnHeader = this.getRight();
        var currentColumn: ColumnHeader = this.getRight().getRight();
        do {
            if(currentColumn.getNodeCount() < minColumn.getNodeCount()){
                minColumn = currentColumn;
            }
            currentColumn = currentColumn.getRight();
        } while(currentColumn != this);

        return minColumn;
    }
}

//test
export class Board {
    constructor(x,y){
        // 5 * 11
        this.x = x;
        this.y = y;
        // all the shapes to iterate through when making the board
        this.shapes = [];
        //add shapes to the array
        this.createShapes();
        this.numOfIDColumns = this.shapes.length;
        // 0-54 array of counts to keep track of num of 1s
        // column count to come
        // this.colCount = [] array of length 55
        this.colIDs = [...Array((this.x * this.y) + this.numOfIDColumns).keys()];
        //console.log(this.colIDs);
        //build basic board and store in full board, this doesn't change so we can rapid reset
        this.fullBoard = this.buildBoard();
        //console.log('Full Board');
        //console.log(this.fullBoard);
        // the board we will change
        this.board = this.fullBoard;

    }

    createShapes(){
        //create the objects

        // needs more rotations/flips...
        this.shapes.push(new Shape('A',[[0,1,2,11,13],[0,1,11,22,23]],this.x * this.y));

        this.shapes.push(new Shape('B',[[2,3,11,12,13],[0,11,12,23,34]],this.x * this.y));

        // this.shapes.push(new Shape('A',[[1,1,1,0,0,0,0,0,0,0,0,1,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1],
        //                                [1,0,1,0,0,0,0,0,0,0,0,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1]],this.x * this.y));

        // this.shapes.push(new Shape('B',[[0,0,1,1,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                [0,1,1,1,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));

        // this.shapes.push(new Shape('C',[[0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1],[0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));

        // this.shapes.push(new Shape('D',[[0,1,0,0,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,1,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));

        // this.shapes.push(new Shape('E',[[0,1,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,1,1,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));

        // this.shapes.push(new Shape('F',[[0,1,1,0,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1],
        //                                 [1,1,1,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));

        // this.shapes.push(new Shape('G',[[0,1,1,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]
        //                                 ],this.x * this.y));

        // this.shapes.push(new Shape('H',[[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                 [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,1]],this.x * this.y));

        // this.shapes.push(new Shape('I',[[1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1],
        //                                 [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));

        // this.shapes.push(new Shape('J',[[1,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1]],this.x * this.y));

        // this.shapes.push(new Shape('K',[[1,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,0,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,1,1]],this.x * this.y));

        // this.shapes.push(new Shape('L',[[1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1],
        //                                 [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1],[0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1]],this.x * this.y));


        
    }


    buildLinkedBoard(){
        var matrix = new Array();
        var tempColRow = new Array((this.x * this.y) + this.numOfIDColumns);
        //columns
        tempColRow.forEach((element,index) => {
            element = new ColumnHeader(index);
        });
        //shapes
        this.shape.forEach(element => {
            var allPlaced = false;
            var rotationCount = 0;
            var colCount = 0;
            while(!allPlaced){
                // check we can add shape in
                if((colCount + shape.coords[rotationCount].length - 1) < (this.x * this.y)){
                    const tempRow = new Array((this.x * this.y) + this.numOfIDColumns);
                    shape.coords[rotationCount].forEach(element => {
                        //create Nodes for that row
                    });
                    // go along once
                    colCount++;
                } else {
                    //when hits 55
                    colCount = 0;
                    rotationCount++;
                    if(rotationCount > shape.coords.length-1){
                        // next shape
                        //console.log('colCount',colCount);
                        //console.log('rotationCount',rotationCount);
                        allPlaced = true;
                    }
                }
            }
        });


    }

    buildBoard(){
        //build the board i.e. al x matrix
        // 5 * 11 + 12 = 55 + 12 = 67 columns
        var matrix = new Array();
        //board: number[][];
        //console.log('Shapes',this.shapes);
        this.shapes.forEach(shape => {
            var allPlaced = false;
            var rotationCount = 0;
            var colCount = 0;
            while(!allPlaced){
                // check we can add shape in
                if((colCount + shape.coords[rotationCount].length - 1) < (this.x * this.y)){
                    const tempRow = new Array((this.x * this.y) + this.numOfIDColumns).fill(0);
                    // add in shape id
                    tempRow[shape.arrayID] = 1;
                    // concat shape into matrix
                    Array.prototype.splice.apply(tempRow,[colCount,shape.coords[rotationCount].length].concat(shape.coords[rotationCount]));
                    //tempRow = tempRow.splice(colCount,shape.coords[rotationCount].length,shape.coords[rotationCount]).flat();
                    //console.log(colCount, rotationCount, tempRow);
                    //push
                    matrix.push([...tempRow]); //push to the matrix
                    // go along once
                    colCount++;
                } else {
                    //when hits 55
                    colCount = 0;
                    rotationCount++;
                    if(rotationCount > shape.coords.length-1){
                        // next shape
                        //console.log('colCount',colCount);
                        //console.log('rotationCount',rotationCount);
                        allPlaced = true;
                    }
                }
            }
           // console.table(matrix)
        });
        return matrix;
    }

    prePlace(prePlace){
        // accept input from frontend - 5 * 11 0 or A-L

        //use .flat(); https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat 

        // 5*11 -> 1d length 55 A-L or 0
        var setOfVars = new Set(prePlace.flat());
        setOfVars.delete(0); //remove 0s
        var shapesToBePrePlaced = Array.from(setOfVars); //['A','B'...]
        //console.log('shapesToBePrePlaced',shapesToBePrePlaced);
        var buildShapeRows = new Array();
        shapesToBePrePlaced.forEach(shape => {
            var shapeRowTemp = [...new Array()];
            // push id
            shapeRowTemp.push((shape.charCodeAt(0) - 65) + 55);
            //push shape placements
            prePlace.flat().forEach((element,index) => {
                if(typeof element === 'string'){
                    shapeRowTemp.push(index);
                }
           });
           buildShapeRows.push([...shapeRowTemp]);
        });
        //console.log('shapeRows',buildShapeRows);
       // convert to 1s so we can check the rows don't conflict with this and add idColumns
       //console.log('flat',prePlace.flat());
       const tempSolution = new Array();
       buildShapeRows.forEach((columnsToRemove)=>{
            //filterboard
            const filteredBoard = [];
            boardObject.board.forEach((row) => {
                // if one of columnsToRemove = 1 in row then remove
                if (!columnsToRemove.some((element) => row[element] === 1)) {
                    //remove columns
                    //console.log(index,row);
                    filteredBoard.push(row.filter((columns, index) => !columnsToRemove.includes(index)));
                };
                //console.log(row[columnsToRemove[0]]);
            });
            this.board = [...filteredBoard];
            // remove cols
            const filteredIDs = [];
            const selectedIDs = [];
            this.colIDs.forEach((element,index) => {
                if (columnsToRemove.includes(index)) {
                    //console.log(element,true);
                    selectedIDs.push(element);
                } else {
                    filteredIDs.push(element);
                }
            });
            //push to temp
            tempSolution.push([...selectedIDs]);
            this.colIDs = [...filteredIDs];
        });
        // edits this.board
        return tempSolution;
    }

    getBlankSolutions() {
        var solutions = new Array();
        solutions.info = {
                ranOutOfTime: false,
                foundMaxSolutions: false,
                dfs: 0
        };
        return solutions;
    }

    // run when solve clicked
    solve(prePlace,maxSolutions,maxRunTime){
        // run prePlace if set
        var tempSolution = [];
        if (prePlace !== undefined){
            tempSolution = [...this.prePlace(prePlace)];
        }
        //run algoritmX return solutions
        return this.convertOutput(alogrithmX(this, maxSolutions ? maxSolutions : null, this.getBlankSolutions(),tempSolution, maxRunTime ? new Date().getTime() + maxRunTime : undefined));
    }

    getLetterFromRow(row){
        //55 + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        // slice row to get id part, find 1 and add 65 (A)
        return String.fromCharCode((row.slice(this.x * this.y).indexOf(1)) + 65);
    }

    getLetterFromArrayID(arrayID){
        return String.fromCharCode((arrayID - 55) + 65);
    }

    convert1Dto2D(array){
        var newArray = [];
        // 1d length 55
        // 2d length 11 * 5
        while(array.length) newArray.push([...array.splice(0,this.y)]);
        return newArray;
    }

    convertOutput(solutions){
        //take board and change to frontend output

        // one solution is 12 rows one for each shape
        // those rows all cover the entirelist

        // A 

        // map 1s to A etc. once figured out what letter it corrosponds to
        var output = new Array();
        solutions.forEach(solution => {
            //fill temp with 0s and set to length 55
            var tempSolution = [...new Array(this.x * this.y).fill(0)];
            for (let index = 0; index < solution.length; index++) {
                const row = [...solution[index]];
                //last in row is always the arrayID
                const id = this.getLetterFromArrayID(row.pop());
                //console.log(typeof id, id,row);
                // set each place in row in tempsolution
                // 0 -> current shape ID
                row.forEach((element)=>{
                    tempSolution[element] = id;
                });
            }

            //convert 1d to 2d array and push
            output.push(this.convert1Dto2D(tempSolution));
        });
        return output;
    }

    reset(){
        // needs to be a way to stop algorithmX if a reset is clicked
        // allow this to enable recursive play without refresh
        this.board = this.fullBoard;

    }

    calculateColCount(colLength){
        //current board is just board
        //console.log(colLength);
        var columns = new Array((colLength)).fill(0);
        this.board.forEach(row => {
            //var tempRow = [...row.slice(0,(colLength))];
            //console.log(row.length);
            row.forEach((column, index) => {
                if (column == 1){
                    columns[index]++;
                }
            });
        });
        return columns;
    }

    // look at again
    returnSmallestColumns(colOfLowestSum){
        var rowsWithSmallestCol = new Array();
        this.board.forEach((row,index) => {
            // finds row of lowest
            if (row[colOfLowestSum] == 1){
                rowsWithSmallestCol.push(index);
            }
        });
        return rowsWithSmallestCol;
    }

}

// our recursive alogrithmX function
// takes the current board, the max solutions to find, the current found solutions, and max time it can take
function alogrithmX(boardObject, maxSolutions, solutions, tempSolution, latestTime){
    // if taken two long or solutions.length-1 = maxSolutions return solutions i.e. exit out

    //  row col-> 0 1 2 ... 54 55 - 67
    //   0            0            
    //   1            1
    //   2            1
    //  ...

    //1. board -> changedboard1
    //2. algorthx -> board
    //3. board -> changeboard2
    //3. algorthmx -> board
    //4. board -> changeboard3
    //5. nope
    //6. back up 
    //7. changeboard2
    //8. backup
    console.warn('currentDFS',solutions.info.dfs);          
    //1. ran out of time!
    if (solutions.info.ranOutOfTime && latestTime != null && latestTime < new Date().getTime()) {
        console.error('ranOutOfTime');
        solutions.info.ranOutOfTime = true;
    }
    else if (solutions.info.foundMaxSolutions){
        //return solutions below break out
        console.error('maxSolutions Found');
    }
    // 2. if matrix no columns at all success!
    // return board

    // change to if IDColumns.length = 0
    // boardObject.board.every((element) => {element.length == 0}) || tempSolution.length >= 12
    else if (boardObject.colIDs.length == 0){
        console.warn('push to temp');
        solutions.push([...tempSolution]);
    }
    // if there are columns!
    // check failure
    // check column has lowest ones -> has 0 1s
    else {
        //proceed!
        // inner workings of alogrithmX
        // 2. choose a column with the lowest sum - least amount of ones 
        //console.log('currentBoard',boardObject.board);
        //boardObject.board[0].length
        var colCounts = [...boardObject.calculateColCount(boardObject.colIDs.length).sort()];
        console.log('colCounts',colCounts);
        var colOfLowestSum = colCounts[0];
        //console.log('colOfLowestSum',colOfLowestSum);

        if (colOfLowestSum === 0 ){
            //fail :(
            // update solution matrix to what it was last
            // go back to previous board state
            //solutions[solutions.length-1].pop();
            console.error('colOfLowestSum = 0');

            //change dfs?
        } else {
            // col count > 0
            // 3. select any of those rows with lowest sum column - push to temp solution
            const rowsWithSmallestCol = [...boardObject.returnSmallestColumns(colCounts.indexOf(colOfLowestSum))];
            for (let index = 0; index < rowsWithSmallestCol.length; index++) {
                const tempBoard = [...boardObject.board];  
                const tempCols = [...boardObject.colIDs];
                console.log('colIDs-first', boardObject.colIDs); 
                //console.log('RowsWithSmallestCol',rowsWithSmallestCol);
                //console.log('ChoosenRowIndex',rowsWithSmallestCol[index],'indexOfRowsOfSmallesCol',index);
                console.log('board-first',boardObject.board);
                const choosenRow = [...boardObject.board[rowsWithSmallestCol[index]]];
                //console.log('choosenRow',choosenRow);
                const columnsToRemove = new Array();
                choosenRow.forEach((element,index) => {
                    if(element == 1){
                        columnsToRemove.push(index);
                    }
                });
                //console.log('columnsToRemove',columnsToRemove);
                

                // remove cols
                const filteredIDs = [];
                const selectedIDs = [];
                boardObject.colIDs.forEach((element,index) => {
                    if (columnsToRemove.includes(index)) {
                        //console.log(element,true);
                        selectedIDs.push(element);
                    } else {
                        filteredIDs.push(element);
                    }
                });
                //var filteredIDs = boardObject.colIDs.filter((element,index) => {!columnsToRemove.includes(element)});
                //push to temp
                tempSolution.push([...selectedIDs]);
                console.info('tempSolution',tempSolution);  
                boardObject.colIDs = [...filteredIDs];
                console.log('colIDs-afterremoval', boardObject.colIDs);      

                solutions.info.dfs++;
                // remove whole row if column is 1
                // if 0 remove just that column
                const filteredBoard = [];

                boardObject.board.forEach((row,index) => {
                    // if one of columnsToRemove = 1 in row then remove
                    if (!columnsToRemove.some((element) => row[element] === 1)) {
                        //remove columns
                        //console.log(index,row);
                        filteredBoard.push(row.filter((columns, index) => !columnsToRemove.includes(index)));
                    };
                    //console.log(row[columnsToRemove[0]]);
                });
                //console.log('filtered',filteredBoard);
                boardObject.board = [...filteredBoard];
                console.log('board after removal', boardObject.board);
                solutions = alogrithmX(boardObject, maxSolutions, solutions,tempSolution,latestTime);
                console.info('solutions',solutions);
                //reset board to last state
                boardObject.board = [...tempBoard];
                boardObject.colIDs = [...tempCols];
                //remove last from tempSolution
                var popped = tempSolution.pop();
                //console.info('popped',popped,index, rowsWithSmallestCol.length);
                solutions.info.dfs--;

                //console.log('resettotempboard',boardObject.Board);
                //
                if (maxSolutions != null && solutions.length >= maxSolutions) {
                    console.error('MaxSolutions FOund');
                    solutions.info.foundMaxSolutions = true;
                    break;
                }
            }
        }
    }
    //final return
    return solutions;
}


// main for now
// export function solveX (prePlace,maxSolutions,maxRunTime){
//     boardObject = new Board(5,11);                
//     return boardObject.solve(prePlace,maxSolutions,maxRunTime);
// }