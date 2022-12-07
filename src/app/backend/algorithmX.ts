import { Shape } from './shape';
import { SearchObject } from './search';
import { Node, ColumnHeader } from './node';

//test
export class Board {

    private boardLength:number;
    private layers:number;
    private layersStart:number[];
    private shapes: Shape[];
    // private numOfIDColumns: number;
    //private colIDs: ColumnHeader[];
    private fullBoard: Node[][];
    private board: Node[][];
    private emptySolution: number[][];

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
    public getEmptySolution(): number[][]{
        return this.emptySolution;
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
        //this.shapes = this.createShapes();
        //console.log('shapes',this.shapes);
        //add shapes to the array

       // this.numOfIDColumns = this.shapes.length;
        //console.log('numOfIDCols',this.numOfIDColumns);
        
        this.emptySolution = this.createEmptySolution();
        console.log('emptySolutionArray',this.emptySolution);
        
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

    private createEmptySolution():number[][]{
        var solutionEmpty:number[][] = new Array();
        var layersStart = [...this.getLayersStart()];
        layersStart.pop();
        for (let index = 0; index < layersStart.length; index++) {
            //console.log(index,(layersStart.length-index)**2,layersStart.length-index);
            
            solutionEmpty.push(new Array((layersStart.length-index)**2))
        }
        return solutionEmpty;
    }
    
    // convert to take 1-12
    private prePlace(prePlace){
        //use .flat(); https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat 

        var oneDPrePlace = [...prePlace.flat(3)]
        //console.log('oneDPrePlace',oneDPrePlace);
        
        var setOfVars = new Set(oneDPrePlace);
        setOfVars.delete(0); //remove 0s
        //console.log('setOfVars',setOfVars);
        
        var shapesToBePrePlaced = Array.from(setOfVars); //['A','B'...]
        //console.log('shapesToBePrePlaced',shapesToBePrePlaced);
        
        //console.log('shapesToBePrePlaced',shapesToBePrePlaced);
        var tempSolution = new Array();
        shapesToBePrePlaced.forEach(shape => {
            //push shape placements
            //console.log('shape',shape);
            
            var shapeRowTemp = new Array();
            oneDPrePlace.forEach((shapeID,index)=>{
                if(shapeID === shape){
                    //if shapeID 1 and shape 1 push colID
                    shapeRowTemp.push(index);
                }
            });
            shapeRowTemp.push(shape+this.boardLength-1);
            //console.log(shapeRowTemp,'shapeRowTemp');
            
            // push id
            // shapeRowTemp.push(shape);
            //should then be an array of [1,3,5,shapeID] or similar no columnID as we cover that to start
            shapeRowTemp.forEach((column)=>{
                //min column is then columns shape is placed in
                this.cover(this.board[0][column] as ColumnHeader);
            });
            tempSolution.push([...shapeRowTemp]);
        });
        // edits this.board
        return tempSolution;
    }

    // run when solve clicked
    public solve(prePlace:number[][] = new Array(),maxSolutions:number = 0,maxRunTime:number = 0){
        // run prePlace if set
        var tempSolution: number[][] = new Array();
        console.log(prePlace,'prePlace');
        
        if (prePlace.length !== 0){
            tempSolution = [...this.prePlace(prePlace)];
        }
        //run algoritmX return solutions
        //return this.convertOutput(alogrithmX(this, maxSolutions ? maxSolutions : null, [],tempSolution, maxRunTime ? new Date().getTime() + maxRunTime : undefined,false));
        //convertOutput now done in SearchObject when adding to Solutions
        return dancingLinks(this,new SearchObject(maxSolutions != 0 ? maxSolutions : 0, maxRunTime != 0 ? new Date().getTime() + maxRunTime : 0),tempSolution);
    }

    public reset(){
        // needs to be a way to stop algorithmX if a reset is clicked
        // allow this to enable recursive play without refresh
        this.board = this.fullBoard;

    }

    //cover a given node
    public cover(targetColumn: ColumnHeader){
        //unlink column header from its neighbours
        targetColumn.getLeft().setRight(targetColumn.getRight());
        targetColumn.getRight().setLeft(targetColumn.getLeft());
        targetColumn.setActivated(false);

        //move down column and unlink each row
        //by traversing left
        let row = targetColumn.getBottom();
        while(row !== targetColumn){
            row = row.getRight();
            while(row.getColumn() !== targetColumn){
                row.getTop().setBottom(row.getBottom());
                row.getBottom().setTop(row.getTop());
                //get column and decrease nodeCount
                (row.getColumn() as ColumnHeader).setNodeCount((row.getColumn() as ColumnHeader).getNodeCount()-1 );

                row = row.getRight();
            }
            row = row.getBottom();
        }
    }

    //uncover a given node
    public uncover(targetColumn: ColumnHeader){
        //link column header to its neighbours
        targetColumn.getLeft().setRight(targetColumn);
        targetColumn.getRight().setLeft(targetColumn);
        targetColumn.setActivated(true);

        //move down column and relink each row
        //by traversing left
        let row = targetColumn.getTop();
        while(row !== targetColumn){
            row = row.getLeft();
            while(row.getColumn() !== targetColumn){
                row.getTop().setBottom(row);
                row.getBottom().setTop(row);
                //get column and increase nodeCount
                (row.getColumn() as ColumnHeader).setNodeCount((row.getColumn() as ColumnHeader).getNodeCount()+1 );

                row = row.getLeft();
            }
            row = row.getTop();
        }
    }

    //get min Column
    public getMinColumn(first: ColumnHeader): ColumnHeader{
        //console.log('all cols',this.board[0]);
        var minColumn: ColumnHeader = first;
        var currentColumn: ColumnHeader = (first.getRight() as ColumnHeader);
        //console.log('minCol',minColumn,currentColumn);
        do {
            if(currentColumn.getNodeCount() < minColumn.getNodeCount() && currentColumn.getActivated()){
                minColumn = currentColumn;
            }
            currentColumn = (currentColumn.getRight() as ColumnHeader);
        } while(currentColumn != first);
        //console.info('minCol',minColumn);

        return minColumn;
    }

}

//Takes board,searchObject,and an empty tempsolution
//Returns SearchObject that has the solutions attached
function dancingLinks(boardObject:Board, searchObject:SearchObject,tempSolution:number[][]):SearchObject{
    //console.warn('DFS',searchObject.getDFS(),searchObject,tempSolution);
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
        const startCol = boardObject.getBoard()[0].find(col => (col as ColumnHeader).getActivated());
        //3. if no activated columns success!
        if (startCol === undefined){
            console.warn('push to temp','DFS',searchObject.getDFS(),searchObject,tempSolution);
            //returns empty array
            searchObject.addToSolutions([...tempSolution],boardObject);
        }
        //4. proceed!
        else {
            // 5. choose a column with the lowest sum - least amount of ones 
            const minColumn:ColumnHeader = boardObject.getMinColumn(startCol as ColumnHeader);
            
            //6. does the mincolumn have no rows?
            if (minColumn.getNodeCount() === 0 ){
                //fail :(
                //console.error('colOfLowestSum = 0',minColumn);
            } 
            else {
                //7. columns > 0 - working on a row in this column
                //Select first in column
                boardObject.cover(minColumn);
                var currentRow: Node = (minColumn.getBottom() as Node);
                //console.log('currentRow',currentRow);

                // while row is not a column
                while(currentRow != minColumn) {
                    //console.log('MinColumn',minColumn,currentRow);
                    // cover that conflicting rows
                    // cover the column
                    // cover the working row
                    currentRow = currentRow.getRight();
                    while(currentRow.getColumn() !== minColumn){
                        boardObject.cover(currentRow.getColumn());
                        currentRow = currentRow.getRight();
                    }
                    // put row into partial
                    tempSolution = [...searchObject.addToTempSolution([...tempSolution],currentRow)];
                    //console.log('all cols after push',tempSolution,boardObject.getBoard()[0]);

                    //recurse call search
                    searchObject.increaseDFS();
                    searchObject = dancingLinks(boardObject,searchObject,[...tempSolution]);
                    searchObject.decreaseDFS();

                    // remove row from partial solution
                    var popped = tempSolution.pop();
                    //console.log('pop',popped);

                    // uncover row
                    // uncover conflicts 
                    // uncover column
                    currentRow = currentRow.getLeft();
                    while(currentRow.getColumn() !== minColumn){
                        boardObject.uncover(currentRow.getColumn());
                        currentRow = currentRow.getLeft();
                    }
                    currentRow = currentRow.getBottom();
                    if(searchObject.checkMaxSolutions()){
                        console.error('Max Solutions Found');
                        break;
                    } 
                    //console.log('currentRow',currentRow);
                    
                }
                boardObject.uncover(minColumn);
            }
        }
    }
    //return solutions and our other vars
    return searchObject;
}
