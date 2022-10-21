var n =0;
var prePlaced = new Array();

const MakeBoards = board => {
  let result = [];//array of boards
  
  for(let col = 0; col < board.length; col++) {//for each column
        let newRow = new Array(board.length).fill('0');//make a new row
        newRow[board[col]] = '1';//put a queen in the row
        //result.push(newRow);//add the row to the board
        result.push(newRow.join(''));//add the row to the board
    
  }
  
  return result;//return the array of boards

}

function solveN(n){
//var solveN = function(n){
  
  const result = [];//array of boards
  
  const dfs = (i, n, oneDBoard) => {//i is the row, oneDBoard is the board
    
    let lastQ = i - 1;//last queen
    
    for(let prevQ = 0; prevQ < lastQ; prevQ++){//check all previous queens
      
      if(oneDBoard[prevQ] === oneDBoard[lastQ]) return; //same column

      let rowDiff = Math.abs(prevQ - lastQ);//row difference
      let colDiff = Math.abs(oneDBoard[prevQ]-oneDBoard[lastQ]);//column difference
      
      if (rowDiff === colDiff) return;//same diagonal
    }
    
    if(i === n){//if we are at the end of the board
      result.push(oneDBoard.slice());//add the board to the result
      return;
    }
    
    for(let col = 0; col < n; col++){//for each column
      
      // If not present in prePlaced
      if(prePlaced[i] == null){
        oneDBoard.push(col);//add the column to the board
      } else {
        oneDBoard.push(prePlaced[i]);//add the column to the board
      }
      dfs(i + 1, n, oneDBoard);//recurse

      // If not present in prePlaced
      if(prePlaced[i] == null){
        oneDBoard.pop();//remove the column from the board
      } else {
        //i--;
      }
    }
  }
  dfs(0,n,[]);//start at row 0
  return result.map(board => MakeBoards(board));//return the result
};

function placeQueen(matrix){
    
    var x = prompt("Enter row number");
    var y = prompt("Enter col number");
    if(matrix[x] == null){
        matrix[x] = y;
        return matrix;
    }
    else{
        alert("Cant do that! Already Filled!");
        return placeQueen(matrix);
    }

}
//col   0   1  2    3    
//row [null,2,null,null]
// row, value = col
function prePlaceQueens(number){
    // init with nulls
    matrix = new Array(number).fill(null);
    preFillNum = prompt("How many queens do you want to prefill?");
    // too big or too small?
    if (preFillNum > number || preFillNum < 0){
        alert("Cant do that!");
        return prePlaceQueens(number);
    }
    else if (preFillNum == 0){
        return matrix;
    }
    else{
        for (var i = 0; i < preFillNum; i++) {
          matrix = placeQueen(matrix);
        }
    }
  
return matrix;
}

function frontEndSetup(){
  var button = document.getElementById('setup');
  if(n == 0){
    // set n
    n = parseInt( prompt('Enter n'))
    button.textContent = "Preplace Queens";
  } else if (prePlaced.length == 0) {
    // set prePlaced 
    prePlaced = prePlaceQueens(n);
    button.textContent = "Solve";
    console.log('pre',prePlaced);
  } else {
    //solve
    var solved = JSON.stringify(solveN(n));
    // no solution?
    if (solved == '[]') {
      solved = 'No Solution Found!';
    }
    var result = document.getElementById('result');
    result.textContent = solved;
    console.log(solved);
  }
}

function reset(){
  var button = document.getElementById('setup');
  n = 0;
  prePlaced = new Array();
  button.textContent = "Set N";
  result.textContent = "";
}
