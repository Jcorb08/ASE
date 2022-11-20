import { Shape } from './shape';
import { SearchObject } from './search';
import { Node, ColumnHeader } from './node';

//test
export class Board {

    private boardLength:number;
    private layers:number;
    private layersStart:number[];
    private shapes: Shape[];
    private numOfIDColumns: number;
    //private colIDs: ColumnHeader[];
    private fullBoard: Node[][];
    private board: Node[][];

    constructor(boardLength,layers){
        // 5 * 11
        this.boardLength = boardLength;
        // level 5 etc.
        this.layers = layers;
        // 0 25 41 50 54 55
        this.layersStart = this.createLayerStarts(this.layers+1);
        // all the shapes to iterate through when making the board
        this.shapes = this.createShapes();
        //add shapes to the array

        this.numOfIDColumns = this.shapes.length;
        // 0-54 array of counts to keep track of num of 1s
        // column count to come
        // this.colCount = [] array of length 55
        //this.colIDs = [...Array((this.boardLength * this.y) + this.numOfIDColumns).keys()];
        //console.log(this.colIDs);
        //build basic board and store in full board, this doesn't change so we can rapid reset
        this.fullBoard = this.buildBoard();
        //console.log('Full Board');
        //console.log(this.fullBoard);
        // the board we will change
        this.board = this.fullBoard;

    }

    createLayerStarts(layers:number): number[]{
        var array = new Array(layers);
        array.forEach((value,index,arr) => {
            if (index == this.layers) {
                // set to one more than last element
                value = this.boardLength
            } else if (index > 0) {
                // 0 + 5 * 5
                // 25 + 4 * 4
                // 41 + 3 * 3
                // 50 + 2 * 2
                value = arr[index-1] + ((layers+1-index) * (layers+1-index))
            } else {
                // 0 
                value = index
            }
        });
        return array;
    }

    createShapes(): Shape[]{
        //create the objects
        var shapes: Shape[] = [];
        // needs more rotations/flips...
        shapes.push(new Shape(1,[[0,1,2,11,13],[0,1,11,22,23]],this.boardLength));

        shapes.push(new Shape(2,[[2,3,11,12,13],[0,11,12,23,34]],this.boardLength));

        // this.shapes.push(new Shape('A',[[1,1,1,0,0,0,0,0,0,0,0,1,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1],
        //                                [1,0,1,0,0,0,0,0,0,0,0,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('B',[[0,0,1,1,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                [0,1,1,1,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('C',[[0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1],[0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('D',[[0,1,0,0,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,1,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('E',[[0,1,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,1,1,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('F',[[0,1,1,0,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1],
        //                                 [1,1,1,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('G',[[0,1,1,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1]
        //                                 ],this.boardLength * this.y));

        // this.shapes.push(new Shape('H',[[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                 [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('I',[[1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1],
        //                                 [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('J',[[1,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('K',[[1,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1],
        //                                 [1,1,0,0,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,0,0,0,0,1,1]],this.boardLength * this.y));

        // this.shapes.push(new Shape('L',[[1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1],
        //                                 [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1],[0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1]],this.boardLength * this.y));


        return shapes;
    }

    buildBoard(): Node[][]{
        //build the board i.e. al x matrix
        // 5 * 11 + 12 = 55 + 12 = 67 columns
        var matrix = new Array();
        const tempColRow = new Array(this.boardLength + this.numOfIDColumns);
        //make columns and push to first row
        tempColRow.forEach((element,index,array) => {
            //activated,row,column
            element = new ColumnHeader(true,0,index);
            element.setColumn(element);
            if (index == 0) {
                //initialise horizontal linkedlists
                element.setLeft(element);
                element.setRight(element);
            } else {
                //add to horizontal linkedlist
                element.setLeft(array[index-1]); //last element
                element.setRight(array[0]); //header
                //update current ones
                array[index-1].setRight(element);
                array[0].setLeft(element);
            }
            //initalise vertical linkedlists
            element.setTop(element);
            element.setBottom(element);
        });
        matrix.push([...tempColRow]);
        //shapes
        // row then starts from 1
        var row = 1;
        this.shapes.forEach(element => {
            var allPlaced = false;
            var rotationCount = 0;
            var colCount = 0;
            var layer = this.layers;
            var layerCounter = 0;
            while(!allPlaced){
                // check we can add shape in if not move to next rotation of shape
                if((colCount + element.getCoords()[rotationCount].length - 1) < (this.boardLength)){
                    //check layer
                    //if the last element in the shape array is = to an element in the layer horisontal issue array. 
                    // might get array out of bounds here
                    if(element.getCoords()[rotationCount][element.getCoords()[rotationCount].length-1] < this.layersStart[this.layersStart.length - layer+1] ){
                        //check horizontal
                        //if the first element in the shape array is > the last position in the current layer, 
                        // move to start point of next layer
                        // first element < next 
                        if(element.getCoords()[rotationCount][0] < this.layersStart[this.layersStart.length - layer] + (layer * layerCounter+1)){
                            const tempRow = new Array((this.boardLength) + this.numOfIDColumns);
                            //create Nodes for that row only in the spaces needed
                            element.getCoords()[rotationCount].forEach((element,index,array) => {
                                //colCount increases each time so the placement of these will slowly move across the array
                                tempRow[colCount+element] = new Node(true,row,colCount+element);
                                //set column
                                tempRow[colCount+element].setColumn(matrix[0][colCount+element]);
                                //increase NodeCount
                                matrix[0][colCount+element].setNodeCount(matrix[0][colCount+element].getNodeCount()+1);
                                if (index == 0) {
                                    //initialise horizontal linkedlists
                                    tempRow[colCount+element].setLeft(tempRow[colCount+element]);
                                    tempRow[colCount+element].setRight(tempRow[colCount+element]);
                                } else {
                                    //add to horizontal linkedlist
                                    tempRow[colCount+element].setLeft(tempRow[colCount+array[index-1]]); //last element
                                    tempRow[colCount+element].setRight(tempRow[colCount+array[0]]); //header
                                    //update current ones
                                    tempRow[colCount+array[index-1]].setRight(tempRow[colCount+element]);
                                    tempRow[colCount+array[0]].setLeft(tempRow[colCount+element]);
                                }
                                //Vertical linkedlist - already init by colHeaders
                                //set top to be the last currently in list i.e. header's top element
                                tempRow[colCount+element].setTop(matrix[0][colCount+element].getTop());
                                //set last element to point to the current element
                                (matrix[0][colCount+element].getTop()).setBottom(tempRow[colCount+element]);
                                //set header's top to be this element
                                matrix[0][colCount+element].setTop(tempRow[colCount+element]);
                                //set current to point to header
                                tempRow[colCount+element].setBottom(matrix[0][colCount+element]);

                            });
                            matrix.push([...tempRow]);
                            // go along once
                            colCount++;
                            row++;
                        } else {
                            // go to next horizontal i.e go one down to 5
                            // 0 1 2 3 4
                            // 5 6 7 8 9
                            layerCounter++;
                            colCount = this.layersStart[this.layersStart.length - layer] + (layer * layerCounter);
                        }
                    } else {
                        // move to next layer up 5 -> 4
                        layer = layer - 1;
                        colCount = this.layersStart[this.layersStart.length - layer];
                        layerCounter = 0;
                    }
                } else {
                    //when hits 55
                    layer = this.layers;
                    layerCounter = 0;
                    colCount = 0;
                    rotationCount++;
                    if(rotationCount > element.getCoords().length-1){
                        // next shape
                        //console.log('colCount',colCount);
                        //console.log('rotationCount',rotationCount);
                        allPlaced = true;
                    }
                }
            }
        });
        return matrix;
    }


    // convert to take 1-12 instead of A-L
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
            shapeRowTemp.push(((shape as String).charCodeAt(0) - 65) + 55);
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
    //    buildShapeRows.forEach((columnsToRemove)=>{
    //         //filterboard
    //         const filteredBoard = [];
    //         this.board.forEach((row) => {
    //             // if one of columnsToRemove = 1 in row then remove
    //             if (!columnsToRemove.some((element) => row[element] === 1)) {
    //                 //remove columns
    //                 //console.log(index,row);
    //                 filteredBoard.push(row.filter((columns, index) => !columnsToRemove.includes(index)));
    //             };
    //             //console.log(row[columnsToRemove[0]]);
    //         });
    //         this.board = [...filteredBoard];
    //         // remove cols
    //         const filteredIDs = [];
    //         const selectedIDs = [];
    //         this.colIDs.forEach((element,index) => {
    //             if (columnsToRemove.includes(index)) {
    //                 //console.log(element,true);
    //                 selectedIDs.push(element);
    //             } else {
    //                 filteredIDs.push(element);
    //             }
    //         });
    //         //push to temp
    //         tempSolution.push([...selectedIDs]);
    //         this.colIDs = [...filteredIDs];
    //     });
        // edits this.board
        return tempSolution;
    }

    // getBlankSolutions():Object {
    //     return {
    //             array: Array(),
    //             ranOutOfTime: false,
    //             foundMaxSolutions: false,
    //             dfs: 0
    //     };
        
    // }

    // run when solve clicked
    solve(prePlace:number[][],maxSolutions:number = 0,maxRunTime:number){
        // run prePlace if set
        var tempSolution: Node[] = [];
        if (prePlace !== undefined){
            tempSolution = [...this.prePlace(prePlace)];
        }
        //run algoritmX return solutions
        //return this.convertOutput(alogrithmX(this, maxSolutions ? maxSolutions : null, [],tempSolution, maxRunTime ? new Date().getTime() + maxRunTime : undefined,false));
        return this.convertOutput(dancingLinks(this,new SearchObject(maxSolutions != 0 ? maxSolutions : 0, maxRunTime != 0 ? new Date().getTime() + maxRunTime : 0),new Array()));
    }


    // convert to numbers
    getLetterFromRow(row){
        //55 + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        // slice row to get id part, find 1 and add 65 (A)
        return String.fromCharCode((row.slice(this.boardLength).indexOf(1)) + 65);
    }

    getLetterFromArrayID(arrayID){
        return String.fromCharCode((arrayID - 55) + 65);
    }

    //fix
    // convert to represent a 2D pyramid
    convert1Dto2D(array:number[]){
        var newArray:number[] = [];
        // 1d length 55
        // 2d length 11 * 5
        while(array.length) newArray.push(array.splice(0,this.y));
        return newArray;
    }

    //convert to change output to be 5*11 of 1-12
    convertOutput(solutions){
        //take board and change to frontend output

        // one solution is 12 rows one for each shape
        // those rows all cover the entirelist

        // A 

        // map 1s to A etc. once figured out what letter it corrosponds to
        var output = new Array();
        solutions.forEach(solution => {
            //fill temp with 0s and set to length 55
            var tempSolution = [...new Array(this.boardLength).fill(0)];
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

    //cover a given node
    public cover(targetNode: Node){
        //pointer to header column
        var columnNode: ColumnHeader = (targetNode.getColumn() as ColumnHeader);

        //unlink column header from its neighbours
        columnNode.getLeft().setRight(columnNode.getRight());
        columnNode.getRight().setLeft(columnNode.getLeft());
        columnNode.setActivated(false);

        //move down column and remove each row
        //by traversing right
        for (let row = columnNode.getBottom(); row != columnNode; row = row.getBottom()) {
            for (let rightNode = row.getRight(); rightNode != row; rightNode = rightNode.getRight()) {
                rightNode.getTop().setBottom(rightNode.getBottom());
                rightNode.getBottom().setTop(rightNode.getTop());
                //get column and decrease nodeCount
                (rightNode.getColumn() as ColumnHeader).setNodeCount((rightNode.getColumn() as ColumnHeader).getNodeCount()-1 );
            }
            
        }
    }

    //uncover a given node
    public uncover(targetNode: Node){
        //pointer to header column
        var columnNode: ColumnHeader = (targetNode.getColumn() as ColumnHeader);

        //move down column and relink each row
        //by traversing left
        for (let row = columnNode.getTop(); row != columnNode; row = row.getTop()) {
            for (let leftNode = row.getLeft(); leftNode != row; leftNode = leftNode.getLeft()) {
                leftNode.getTop().setBottom(leftNode);
                leftNode.getBottom().setTop(leftNode);
                //get column and decrease nodeCount
                (leftNode.getColumn() as ColumnHeader).setNodeCount((leftNode.getColumn() as ColumnHeader).getNodeCount()+1 );
            }
            
        }
        //link column header to its neighbours
        columnNode.getLeft().setRight(columnNode);
        columnNode.getRight().setLeft(columnNode);
        columnNode.setActivated(true);
    }

    //get min Column
    public getMinColumn(): ColumnHeader{
        var minColumn: ColumnHeader = (this.board[0][0] as ColumnHeader);
        var currentColumn: ColumnHeader = (this.board[0][0].getRight() as ColumnHeader);
        do {
            if(currentColumn.getNodeCount() < minColumn.getNodeCount() && currentColumn.getActivated()){
                minColumn = currentColumn;
            }
            currentColumn = (currentColumn.getRight() as ColumnHeader);
        } while(currentColumn != this.board[0][0]);

        return minColumn;
    }


    //need converting?
    // calculateColCount(colLength){
    //     //current board is just board
    //     //console.log(colLength);
    //     var columns = new Array((colLength)).fill(0);
    //     this.board.forEach(row => {
    //         //var tempRow = [...row.slice(0,(colLength))];
    //         //console.log(row.length);
    //         row.forEach((column, index) => {
    //             if (column == 1){
    //                 columns[index]++;
    //             }
    //         });
    //     });
    //     return columns;
    // }

    // look at again
    // returnSmallestColumns(colOfLowestSum){
    //     var rowsWithSmallestCol = new Array();
    //     this.board.forEach((row,index) => {
    //         // finds row of lowest
    //         if (row[colOfLowestSum] == 1){
    //             rowsWithSmallestCol.push(index);
    //         }
    //     });
    //     return rowsWithSmallestCol;
    // }

}

//Takes board,searchObject,and an empty tempsolution
//Returns SearchObject that has the solutions attached
function dancingLinks(boardObject:Board, searchObject:SearchObject,tempSolution:number[][]):SearchObject{
    //1. ran out of time!
    if (searchObject.checkTime()){
        //return solutions below break out
        console.error('ranOutOfTime');
    }
    //2. max Solutions found!
    else if(searchObject.checkMaxSolutions()){
        //return solutions below break out
        console.error('maxSolutions Found');
    }
    else {
        // 3. choose a column with the lowest sum - least amount of ones 
        var minColumn:ColumnHeader = boardObject.getMinColumn();
        //4. if no columns success!
        if(!minColumn.getActivated){
            console.warn('push to temp');
            //returns empty array
            searchObject.addToSolutions([...tempSolution]);
        } 
        //5. proceed!
        else {
            //6. does the mincolumn have no rows?
            if (minColumn.getNodeCount() === 0 ){
                //fail :(
                console.error('colOfLowestSum = 0');
            } 
            else {
                //7. columns > 0 - working on a row in this column
                //Select first in column
                var currentRow: Node = (minColumn.getBottom() as Node);
                // while row is not a column
                do {
                    // cover that conflicting rows
                    // cover the column
                    // cover the working row
                    boardObject.cover(currentRow);
                    // put row into partial
                    tempSolution = searchObject.addToTempSolution(tempSolution,currentRow);

                    //recurse call search
                    searchObject = dancingLinks(boardObject,searchObject,tempSolution);

                    // remove row from partial solution
                    tempSolution.pop();
                    // uncover row
                    // uncover conflicts 
                    // uncover column
                    boardObject.uncover(currentRow);

                    if(searchObject.checkMaxSolutions()){
                        console.error('Max Solutions Found');
                        break;
                    } else {
                        currentRow = currentRow.getBottom();
                    }
                } while(currentRow != minColumn);
            }
        }
    }
    //return solutions and our other vars
    return searchObject;
}
