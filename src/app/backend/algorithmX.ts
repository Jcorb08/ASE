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

    //Getters
    public getBoardLength(): number{
        return this.boardLength;
    }
    public getLayers(): number{
        return this.layers;
    }
    public getLayersStart(): number[]{
        return this.layersStart;
    }
    public getShapeID(arrayID:number): number{
        return (arrayID + 1) - this.boardLength;
    }
    public getBoard(): Node[][]{
        return this.board;
    }
    public getFullBoard(): Node[][]{
        return this.fullBoard;
    }
    //Setters
    //build basic board and store in full board, this doesn't change so we can rapid reset
    public setBoard(board: Node[][]){
        this.board = board;
        this.fullBoard = board;
    }

    constructor(boardLength:number,layers:number){
        // 5 * 11
        this.boardLength = boardLength;
        console.log('boardLength-aggggggggg',this.boardLength);
        // level 5 etc.
        this.layers = layers;
        console.log('layers',this.layers);
        
        // 0 25 41 50 54 55
        this.layersStart = this.createLayerStarts(this.layers+1);
        console.log('layersStart',this.layersStart);
        
        // all the shapes to iterate through when making the board
        this.shapes = this.createShapes();
        console.log('shapes',this.shapes);
        
        //add shapes to the array

        this.numOfIDColumns = this.shapes.length;
        console.log('numOfIDCols',this.numOfIDColumns);
        
        //this.fullBoard = this.buildBoard();
        //console.log('fullBoard',this.fullBoard);
        //console.log('Full Board');
        //console.log(this.fullBoard);
        // the board we will change
        //this.board = this.fullBoard;

    }

    private createLayerStarts(layers:number): number[]{
        const array = new Array();
        for (let index = 0; index < layers; index++) {
            if (index == this.layers) {
                // set to one more than last element
                array.push(this.boardLength);
            } else if (index > 0) {
                // 0 + 5 * 5
                // 25 + 4 * 4
                // 41 + 3 * 3
                // 50 + 2 * 2
                array.push(array[index-1] + ((layers-index) * (layers-index)))
            } else {
                // 0 
                array.push(index);
            }
            
        }
        return array;
    }

    private createShapes(): Shape[]{
        //create the objects
        var shapes: Shape[] = [];
        // needs more rotations/flips...
        shapes.push(new Shape(1,[[5,1,7,0,2],[10,0,6,11,1],[10,0,5,11,1],[5,0,6,7,2]],[[6,25,41,45,50],[8,28,43,45,51],[18,40,49,45,53],[16,37,47,45,52]],this.boardLength));

        shapes.push(new Shape(2,[[5,2,6,7,3],[16,0,5,10,11],[5,1,2,6,3],[16,0,5,11,6]],[],this.boardLength));
      
        shapes.push(new Shape(3,[[11,1,5,6,12],[10,1,5,6,7],[11,0,1,6,7],[11,5,6,7,2],[10,1,6,11,7],[11,0,5,6,7],[11,1,5,6,2],[12,1,5,6,7]],[],this.boardLength));
      
        shapes.push(new Shape(4,[[5,1,6,7],[10,0,5,6],[6,0,1,2],[11,5,6,1]],[],this.boardLength));
      
        shapes.push(new Shape(5,[[5,1,6,7,8],[15,0,5,10,6],[7,0,1,2,3],[16,6,10,11,1],[5,2,6,7,8],[15,0,5,10,11],[6,0,1,2,3],[16,5,6,11,1]],[],this.boardLength));
      
        shapes.push(new Shape(6,[[5,1,6,7,2],[10,0,5,11,6],[5,0,1,6,2],[11,0,5,6,1],[5,0,1,6,7],[10,0,5,6,1],[6,0,1,7,2],[10,5,6,11,1]],[],this.boardLength));
        
        shapes.push(new Shape(7,[[5,1,6,2],[11,0,5,6],[6,0,1,7],[10,6,5,1]],[[33,30,44,42]],this.boardLength));
      
        shapes.push(new Shape(8,[[10,0,5,1],[7,0,1,2],[10,6,11,1],[5,0,6,7],[10,0,5,11],[11,0,6,1],[5,6,7,2],[5,0,1,2]],[],this.boardLength));
      
        shapes.push(new Shape(9,[[12,0,1,7,2],[10,7,11,12,2],[10,0,5,11,12],[10,0,1,5,2]],[],this.boardLength));
      
        shapes.push(new Shape(10,[[5,0,6,7,8],[15,0,5,10,1],[8,0,1,2,3],[15,6,11,16,1],[5,0,1,2,3],[16,0,6,11,1],[5,6,7,8,3],[15,0,5,10,16]],[],this.boardLength));
      
        shapes.push(new Shape(11,[[5,0,6],[5,0,1],[6,0,1],[5,6,1]],[],this.boardLength));
      
        shapes.push(new Shape(12,[[7,0,1,6,12],[10,6,7,11,2],[11,0,5,6,12],[10,1,5,6,2]],[[41,45,49,50,53]],this.boardLength));

        return shapes;
    }

    public buildBoard(): Node[][]{
        //build the board i.e. al x matrix
        // 5 * 11 + 12 = 55 + 12 = 67 columns
        var matrix = new Array();
        //make columns and push to first row

        const tempColRow = new Array();
        for (let index = 0; index < this.boardLength + this.numOfIDColumns; index++) {
            //activated,row,column
            const colHeader = new ColumnHeader(true,0,index);
            //console.log('colheader',colHeader);
            
            colHeader.setColumn(tempColRow[index]);
            if (index == 0) {
                //initialise horizontal linkedlists
                colHeader.setLeft(colHeader);
                colHeader.setRight(colHeader);
            } else {
                //add to horizontal linkedlist
                colHeader.setLeft(tempColRow[index-1]); //last element
                colHeader.setRight(tempColRow[0]); //header
                //update current ones
                tempColRow[index-1].setRight(colHeader);
                tempColRow[0].setLeft(colHeader);
            }
            //initalise vertical linkedlists
            colHeader.setTop(colHeader);
            colHeader.setBottom(colHeader);
            tempColRow[index] = colHeader;
        }

        //console.log('tempColRow',tempColRow);
        
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
            //horizontals
            while(!allPlaced){
                // check we can add shape in if not move to next rotation of shape
                if((colCount + Math.max(...element.getCoords()[rotationCount])) < (this.boardLength)){
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
                                tempRow[colCount+element] = new Node(row,colCount+element);
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
                            //Set ARRAY ID Element
                            tempRow[element.getArrayID()] = new Node(row,element.getArrayID());
                            //set column
                            tempRow[element.getArrayID()].setColumn(matrix[0][element.getArrayID()]);
                            //increase NodeCount
                            matrix[0][element.getArrayID()].setNodeCount(matrix[0][element.getArrayID()].getNodeCount()+1);
                            //add to horizontal linkedlist
                            tempRow[element.getArrayID()].setLeft(tempRow[colCount+element.getCoords()[rotationCount][element.getCoords()[rotationCount].length-1]]); //last element
                            tempRow[element.getArrayID()].setRight(tempRow[colCount+element.getCoords()[rotationCount][0]]); //header
                            //update current ones
                            tempRow[colCount+element.getCoords()[rotationCount][element.getCoords()[rotationCount].length-1]].setRight(tempRow[element.getArrayID()]);
                            tempRow[colCount+element.getCoords()[rotationCount][0]].setLeft(tempRow[element.getArrayID()]);
                            //Vertical linkedlist - already init by colHeaders
                            //set top to be the last currently in list i.e. header's top element
                            tempRow[element.getArrayID()].setTop(matrix[0][element.getArrayID()].getTop());
                            //set last element to point to the current element
                            (matrix[0][element.getArrayID()].getTop()).setBottom(tempRow[element.getArrayID()]);
                            //set header's top to be this element
                            matrix[0][element.getArrayID()].setTop(tempRow[element.getArrayID()]);
                            //set current to point to header
                            tempRow[element.getArrayID()].setBottom(matrix[0][element.getArrayID()]);

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
            //verticals for now
            //console.log('matrix before vertical',matrix);

            /*
      // var name, type = value
                var left2right: number[] = [4,9,14,19,24,28,32,36,40,43,46,49,51,53,54];
                var right2left: number[] = [0,5,10,15,20,25,29,33,37,41,44,47,50,52,54];
                var left2left: number[] = [20,21,22,23,24,37,38,39,40,47,48,49,52,53,54];
                var lright2right: number[] = [0,1,2,3,4,25,26,27,28,41,42,43,50,51,54];
                var startcorner = 1;
                var startPlace = rowArray;
                var workPlace = rowArray
                if (startcorner = 1){
                    
                    //push workPlace
                    //while any in workplace not in left2right
                        //workplace ++, push workPlace
                    //workPlace = startPlace
                    //while any in workplace not in left2left
                        //left2left transform, push workPlace
                    //workplace = startPlace
                    //moveInTransform
                    //ifworkplace not present in left2right or left2left push workplace
                    //startplace = workplace

                }
            */
            
            element.getVerticals().forEach((rowArray) => {
                const tempRow = new Array((this.boardLength) + this.numOfIDColumns);
                //create Nodes for that row only in the spaces needed
                rowArray.forEach((element,index,array) => {
                    
                    //colCount increases each time so the placement of these will slowly move across the array
                    tempRow[element] = new Node(row,element);
                    //set column
                    tempRow[element].setColumn(matrix[0][element]);
                    //increase NodeCount
                    matrix[0][element].setNodeCount(matrix[0][element].getNodeCount()+1);
                    if (index == 0) {
                        //initialise horizontal linkedlists
                        tempRow[element].setLeft(tempRow[element]);
                        tempRow[element].setRight(tempRow[element]);
                    } else {
                        //add to horizontal linkedlist
                        tempRow[element].setLeft(tempRow[array[index-1]]); //last element
                        tempRow[element].setRight(tempRow[array[0]]); //header
                        //update current ones
                        tempRow[array[index-1]].setRight(tempRow[element]);
                        tempRow[array[0]].setLeft(tempRow[element]);
                    }
                    //Vertical linkedlist - already init by colHeaders
                    //set top to be the last currently in list i.e. header's top element
                    tempRow[element].setTop(matrix[0][element].getTop());
                    //set last element to point to the current element
                    (matrix[0][element].getTop()).setBottom(tempRow[element]);
                    //set header's top to be this element
                    matrix[0][element].setTop(tempRow[element]);
                    //set current to point to header
                    tempRow[element].setBottom(matrix[0][element]);

                });

                //Set ARRAY ID Element
                tempRow[element.getArrayID()] = new Node(row,element.getArrayID());
                //set column
                tempRow[element.getArrayID()].setColumn(matrix[0][element.getArrayID()]);
                //increase NodeCount
                matrix[0][element.getArrayID()].setNodeCount(matrix[0][element.getArrayID()].getNodeCount()+1);
                //add to horizontal linkedlist
                tempRow[element.getArrayID()].setLeft(tempRow[colCount+rowArray[rowArray.length-1]]); //last element
                tempRow[element.getArrayID()].setRight(tempRow[colCount+rowArray[0]]); //header
                //update current ones
                tempRow[colCount+rowArray[rowArray.length-1]].setRight(tempRow[element.getArrayID()]);
                tempRow[colCount+rowArray[0]].setLeft(tempRow[element.getArrayID()]);
                //Vertical linkedlist - already init by colHeaders
                //set top to be the last currently in list i.e. header's top element
                tempRow[element.getArrayID()].setTop(matrix[0][element.getArrayID()].getTop());
                //set last element to point to the current element
                (matrix[0][element.getArrayID()].getTop()).setBottom(tempRow[element.getArrayID()]);
                //set header's top to be this element
                matrix[0][element.getArrayID()].setTop(tempRow[element.getArrayID()]);
                //set current to point to header
                tempRow[element.getArrayID()].setBottom(matrix[0][element.getArrayID()]);

                matrix.push([...tempRow]);
                row++;
            });
        });
        return matrix;
    }


    // convert to take 1-12 instead of A-L
    private prePlace(prePlace){
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
    public solve(prePlace:number[][] = new Array(),maxSolutions:number = 0,maxRunTime:number = 0){
        // run prePlace if set
        var tempSolution: Node[] = [];
        console.log(prePlace,'prePlace');
        
        if (prePlace.length !== 0){
            tempSolution = [...this.prePlace(prePlace)];
        }
        //run algoritmX return solutions
        //return this.convertOutput(alogrithmX(this, maxSolutions ? maxSolutions : null, [],tempSolution, maxRunTime ? new Date().getTime() + maxRunTime : undefined,false));
        //convertOutput now done in SearchObject when adding to Solutions
        return dancingLinks(this,new SearchObject(maxSolutions != 0 ? maxSolutions : 0, maxRunTime != 0 ? new Date().getTime() + maxRunTime : 0),new Array());
    }

    public reset(){
        // needs to be a way to stop algorithmX if a reset is clicked
        // allow this to enable recursive play without refresh
        this.board = this.fullBoard;

    }

    //cover a given node
    public cover(targetNode: Node){
        let rightTargetNode = targetNode;
        do {
            //pointer to header column
            var columnNode: ColumnHeader = (rightTargetNode.getColumn() as ColumnHeader);
            console.log('colNode-cover',columnNode);

            //unlink column header from its neighbours
            columnNode.getLeft().setRight(columnNode.getRight());
            columnNode.getRight().setLeft(columnNode.getLeft());
            columnNode.setActivated(false);

            //move down column and remove each row
            //by traversing right
            let row = columnNode.getBottom();
            do {
                let rightNode = row;
                do {
                    //console.log('leftNode-cover',rightNode);
                    rightNode.getTop().setBottom(rightNode.getBottom());
                    rightNode.getBottom().setTop(rightNode.getTop());
                    //get column and decrease nodeCount
                    (rightNode.getColumn() as ColumnHeader).setNodeCount((rightNode.getColumn() as ColumnHeader).getNodeCount()-1 );

                    rightNode = rightNode.getRight();
                } while(rightNode != row);
                row = row.getBottom();
            } while(row != columnNode);
            rightTargetNode = rightTargetNode.getRight();
        } while (rightTargetNode != targetNode);
    }

    //uncover a given node
    public uncover(targetNode: Node){
        let leftTargetNode = targetNode;
        do {
            //pointer to header column
            var columnNode: ColumnHeader = (leftTargetNode.getColumn() as ColumnHeader);
            console.log('colNode-uncover',columnNode);

            //move down column and relink each row
            //by traversing left
            let row = columnNode.getTop();
            do {
                let leftNode = row;
                do {
                    
                    leftNode.getTop().setBottom(leftNode);
                    leftNode.getBottom().setTop(leftNode);
                    //get column and increase nodeCount
                    (leftNode.getColumn() as ColumnHeader).setNodeCount((leftNode.getColumn() as ColumnHeader).getNodeCount()+1 );
                    leftNode = leftNode.getLeft();
                } while(leftNode != row);
                row = row.getTop();
            } while(row != columnNode);
            

            //link column header to its neighbours
            columnNode.getLeft().setRight(columnNode);
            columnNode.getRight().setLeft(columnNode);
            columnNode.setActivated(true);
            leftTargetNode = leftTargetNode.getLeft();
        } while(leftTargetNode != targetNode);
    }

    //get min Column
    public getMinColumn(): ColumnHeader{
        console.log('all cols',this.board[0]);
        var first: ColumnHeader = (this.board[0].find(col => (col as ColumnHeader).getActivated()) as ColumnHeader);
        var minColumn: ColumnHeader = first;
        var currentColumn: ColumnHeader = (first.getRight() as ColumnHeader);
        //console.log('minCol',minColumn,currentColumn);
        do {
            if(currentColumn.getNodeCount() < minColumn.getNodeCount() && currentColumn.getActivated()){
                minColumn = currentColumn;
            }
            currentColumn = (currentColumn.getRight() as ColumnHeader);
        } while(currentColumn != first);
        console.info('minCol',minColumn);

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
    console.warn('DFS',searchObject.getDFS(),searchObject,tempSolution);
    //1. ran out of time!
    if (searchObject.checkTime()){
        //return solutions below break out
        console.error('ranOutOfTime');
    }
    else if (searchObject.getDFS() == 63 || searchObject.getMaxSolutionsFound()){
        console.error('stop crash');
        searchObject.setMaxSolutionsFound(true);
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
            searchObject.addToSolutions([...tempSolution],boardObject);
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
                console.log('currentRow',currentRow);
                
                // while row is not a column
                do {
                    // cover that conflicting rows
                    // cover the column
                    // cover the working row
                    boardObject.cover(currentRow);
                    // put row into partial
                    tempSolution = [...searchObject.addToTempSolution(tempSolution,currentRow)];

                    //recurse call search
                    searchObject.increaseDFS();
                    searchObject = dancingLinks(boardObject,searchObject,tempSolution);
                    searchObject.decreaseDFS();

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
