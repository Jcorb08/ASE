class Shape{
    constructor(id,coords){
        // the letter A-L
        this.id = id;
        // represented as 0-11 for the algorithmX array

        // change to take x and y as inputs
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
        // accept input from frontend - 5 * 11 0 or A-L

        //use .flat(); https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat 

        // 5*11 -> 1d length 55 A-L or 0
        var setOfVars = new Set(prePlace.flat());
        setOfVars.delete(0); //remove 0s
        var shapesToBePrePlaced = Array.from(setOfVars); //['A','B'...]
        var firstIndexes = new Array();
        // first indexes in order of shapes to be preplaced so 'A','B'... but the number they come in list so e.g. 12
        shapesToBePrePlaced.forEach(shape => {
            firstIndexes.push(prePlace.flat().findIndex((element) => {element == shape}));
       });
       // convert to 1s so we can check the rows don't conflict with this
       var rowCheckConflicts = prePlace.flatMap((element) => {element != 0 ? 1 : 0});

        //find the first place of 'A' then take out all that conflicts
        // remove rows via algorithmX functionality but not the actually function
        //remove the rows we don't need as the shapes are fixed
       this.board = this.board.filter(row => {
            //if in shapestobepreplaced and firstIndex is not equal to first indexes -> remove
            var id = this.getLetterFromRow(row);
            if(shapesToBePrePlaced.includes(id) && row.findIndex((element) => element == 1) == firstIndexes[shapesToBePrePlaced.indexOf(id)]){
                // remove all 'A's if been preplaced and not the same config as the preplaced
                return false;
            } else if (!row.slice(0,(this.x * this.y)-1).every((element,index) => {element == 0 || (element == 1 && element != rowCheckConflicts[index])})){
                //if the 0-54 has one element that is the same as rowCheckConflicts -> then we know it will be deleted so we remove it
                return false;
            } else {
                //keep the node
                return true;
            }
       });
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

    getLetterFromRow(row){
        //55 + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        // slice row to get id part, find 1 and add 65 (A)
        return String.fromCharCode((row.slice(this.x * this.y).indexOf(1)) + 65);
    }

    convert1Dto2D(array){
        newArray = [];
        // 1d length 55
        // 2d length 11 * 5
        while(array.length) newArray.push(array.splice(0,this.y));
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
            var tempSolution = new Array(this.x * this.y).fill(0);
            solution.forEach(row => {
                // grab id from row 
                var id = this.getLetterFromRow(row);
                //slice array to only board and map 1s to id
                var shapeInBoard = row.slice(0,(this.x * this.y)-1).map(val => {val == 1 ? id : val});
                //concat into tempSolution if == 0 then good to overwrite
                tempSolution.map((element, index) => {element == 0 ? shapeInBoard[index] : element});
            });
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


}

// our recursive alogrithmX function
// takes the current board, the max solutions to find, the current found solutions, and max time it can take
function alogrithmX(board, maxSolutions, solutions, latestTime){
    // if taken two long or solutions.length-1 = maxSolutions return solutions i.e. exit out


    // rob don't worry about keeping track just delete and return solutions

}


// main for now
var boardObject = new Board(5,11);
