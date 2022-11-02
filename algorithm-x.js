class Shape{
    constructor(id,coords){
        // the letter A-L
        this.id = id;
        // define coords here how you said rob, the pattern in a 1d array
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
        //build basic board and store in full board, this doesn't change so we can rapid reset
        this.fullBoard = this.buildBoard();
        // the board we will change
        this.board = this.fullBoard;
        // column count to come
        // this.colCount = [] array of length 55
    }

    createShapes(){
        //create the objects
    }

    buildBoard(){
        //build the board i.e. al x matrix
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