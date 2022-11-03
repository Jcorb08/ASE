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
        console.log(this.fullBoard);
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
        this.shapes.forEach(shape => {
            var allPlaced = false;
            var rotationCount = 0;
            var colCount = 0;
            while(!allPlaced){
                // check we can add shape in
                if((colCount + shape.coords[rotationCount].length - 1) <= (this.x * this.y)){
                    var tempRow = new Array((this.x * this.y) + this.IDColumns).fill(0);
                    // add in shape id
                    tempRow[shape.arrayID] = 1;
                    // concat shape into matrix
                    Array.prototype.splice.apply(tempRow,[colCount,shape.coords[rotationCount].length].concat(shape.coords[rotationCount]));
                    //console.log(tempRow);
                    //push
                    matrix.push(tempRow); //push to the matrix
                    // go along once
                    colCount++;
                } else {
                    //when hits 55
                    rotationCount++;
                    if(rotationCount > shape.coords.length-1){
                        // next shape
                        allPlaced = true;
                    }
                }
            }
           // console.table(matrix)
        });
        return matrix;
    }

    prePlace(prePlace){
        // accept input from frontend

        //find the first place of 'A' then take out all that conflicts

        // remove rows via algorithmX functionality but not the actually function

        //remove the rows we don't need as the shapes are fixed
        // edits this.board
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

        // one solution is 12 rows one for each shape
        // those rows all cover the entirelist

        // A 

        // map 1s to A etc. once figured out what letter it corrosponds to
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
    // if taken two long or solutions.length-1 = maxSolutions return solutions i.e. exit out


    // rob don't worry about keeping track just delete and return solutions

}


// main for now
var boardObject = new Board(5,11);
