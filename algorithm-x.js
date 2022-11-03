class Shape{
    constructor(id,coords){
        // the letter A-L
        this.id = id;
        // represented as 0-11 for the algorithmX array
        this.arrayID = 55 + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        // define coords here how you said rob, the pattern in a 1d array
        // represented as 11110001
        // a list of them rotated clockwise
        this.coords = coords;
    }
}

class Board {
    constructor(x,y){
        // 5 * 11
        this.x = x;
        this.y = y;
        // all the shapes to iterate through when making the board
        this.shapes = [];
        //add shapes to the array
        this.createShapes();
        this.IDColumns = this.shapes.length;
        //build basic board and store in full board, this doesn't change so we can rapid reset
        this.fullBoard = this.buildBoard();
        console.log('Full Board');
        console.table(this.fullBoard);
        // the board we will change
        this.board = this.fullBoard;
        // column count to come
        // this.colCount = [] array of length 55
    }

    createShapes(){
        //create the objects
        this.shapes.push(new Shape('A',[[1,1,1,0,0,0,0,0,0,0,0,1,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1],
                                        [1,0,1,0,0,0,0,0,0,0,0,1,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1]]));

        this.shapes.push(new Shape('B',[[0,0,1,1,0,0,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
                                        [0,1,1,1,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1]]));

        this.shapes.push(new Shape('C',[[0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1],[0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
                                        [1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0,0,,1,1,1,0,0,0,0,0,0,0,0,0,1]]));
        
    }

    buildBoard(){
        //build the board i.e. al x matrix
        // 5 * 11 + 12 = 55 + 12 = 67 columns
        var matrix = new Array();
        var oneRow = new Array((this.x * this.y) + this.IDColumns).fill(0);
        this.shapes.forEach(shape => {
            var allPlaced = false;
            var rotationCount = 0;
            var colCount = 0;
            while(!allPlaced){
                // check we can add shape in
                if((colCount + shape.coords[rotationCount].length - 1) >= (this.x * this.y)){
                    var tempRow = oneRow;
                    tempRow[shape.arrayID] = '1';
                    Array.prototype.splice.apply(tempRow,[colCount,shape.coords[rotationCount].length].concat(shape.coords[rotationCount]));
                    matrix.push(tempRow); //push to the matrix
                    colCount++;
                } else {
                    //when hits 55
                    rotationCount++;
                    if(rotationCount > Shape.coords.length){
                        // next shape
                        allPlaced = true;
                    }
                }
            }
        });
        return matrix;
    }

    prePlace(prePlace){
        // accept input from frontend
        //remove the rows we don't need as the shapes are fixed
    }

    // run when solve clicked
    solve(prePlace,maxSolutions,maxRunTime){
        // run prePlace if set
        if (prePlace !== undefined){
            this.prePlace(prePlace);
        }
        //run algoritmX return solutions
        return this.convertOutput(alogrithmX(this, maxSolutions ? maxSolutions : null, [], maxRunTime ? new Date().getTime() + maxRunTime : undefined));
    }

    convertOutput(solutions){
        //take board and change to frontend output
    }

    reset(){
        // needs to be a way to stop algorithmX if a reset is clicked
        // allow this to enable recursive play without refresh
        this.board = this.fullBoard;

    }


}

// our recursive alogrithmX function
// takes the current board, the max solutions to find, the current found solutions, and max time it can take
function alogrithmX(board, maxSolutions, solutions, latestTime){

}


// main for now
var boardObject = new Board(5,11);
