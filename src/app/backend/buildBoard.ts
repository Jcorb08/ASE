import { ColumnHeader,Node } from "./node";
import { Shape } from "./shape";


export class buildBoard{
    private workplace:number[];
    private startCorner:number;
    private boardLength:number;
    private layers:number;
    private layersStart:number[];
    private shapes: Shape[];
    private numOfIDColumns: number;
    private levelupPlace:number[];
    private startPlace:number[];
    private row:number; 


    private left2right: number[] = [4,9,14,19,24,28,32,36,40,43,46,49,51,53,54];
private right2left: number[] = [0,5,10,15,20,25,29,33,37,41,44,47,50,52,54];
private left2left: number[] = [20,21,22,23,24,37,38,39,40,47,48,49,52,53,54];
private right2right: number[] = [0,1,2,3,4,25,26,27,28,41,42,43,50,51,54];

    constructor(layers:number,boardLength:number,layersStart:number[]){
        // 5 * 11
        this.boardLength = boardLength;
        console.log('boardLength-aggggggggg',this.boardLength);
        // level 5 etc.
        this.layers = layers;
        console.log('layers',this.layers);
        
        // 0 25 41 50 54 55
        this.layersStart = layersStart;

        this.shapes = this.createShapes();

        this.numOfIDColumns = this.shapes.length;
        console.log('numOfIDCols',this.numOfIDColumns);
    }

    private createShapes(): Shape[]{
        //create the objects
        var shapes: Shape[] = [];
        // needs more rotations/flips...
        shapes.push(new Shape(1,[[5,1,7,0,2],[10,0,6,11,1],[10,0,5,11,1],[5,0,6,7,2]],[[6,25,41,45,50],[8,28,43,45,51],[18,40,49,45,53],[16,37,47,45,52]],this.boardLength));

        shapes.push(new Shape(2,[[5,2,6,7,3],[16,0,5,10,11],[5,1,2,6,3],[16,0,5,11,6]],[[0,25,41,30,45],[4,28,43,45,31],[24,40,49,45,35],[20,37,47,34,45]],this.boardLength));
      
        shapes.push(new Shape(3,[[11,1,5,6,12],[10,1,5,6,7],[11,0,1,6,7],[11,5,6,7,2],[10,1,6,11,7],[11,0,5,6,7],[11,1,5,6,2],[12,1,5,6,7]],[],this.boardLength));
      
        shapes.push(new Shape(4,[[5,1,6,7],[10,0,5,6],[6,0,1,2],[11,5,6,1]],[[0,6,25,41],[4,8,28,43],[24,18,40,49],[20,16,37,47]],this.boardLength));
      
        shapes.push(new Shape(5,[[5,1,6,7,8],[15,0,5,10,6],[7,0,1,2,3],[16,6,10,11,1],[5,2,6,7,8],[15,0,5,10,11],[6,0,1,2,3],[16,5,6,11,1]],[[0,6,25,41,50],[4,8,28,43,51],[24,18,40,49,53],[20,16,37,47,52]],this.boardLength));
      
        shapes.push(new Shape(6,[[5,1,6,7,2],[10,0,5,11,6],[5,0,1,6,2],[11,0,5,6,1],[5,0,1,6,7],[10,0,5,6,1],[6,0,1,7,2],[10,5,6,11,1]],[[0,6,25,41,30],[4,8,28,43,31],[24,18,40,49,35],[20,16,37,47,34]],this.boardLength));
        
        shapes.push(new Shape(7,[[5,1,6,2],[11,0,5,6],[6,0,1,7],[10,6,5,1]],[[0,6,25,30],[4,8,28,31],[24,18,40,35],[20,16,37,34]],this.boardLength));
      
        shapes.push(new Shape(8,[[10,0,5,1],[7,0,1,2],[10,6,11,1],[5,0,6,7],[10,0,5,11],[11,0,6,1],[5,6,7,2],[5,0,1,2]],[[0,25,41,30],[4,28,43,31],[24,40,49,35],[20,37,47,34]],this.boardLength));
      
        shapes.push(new Shape(9,[[12,0,1,7,2],[10,7,11,12,2],[10,0,5,11,12],[10,0,1,5,2]],[[0,25,41,30,12],[4,28,43,31,12],[24,40,49,35,12],[20,37,47,34,12]],this.boardLength));
      
        shapes.push(new Shape(10,[[5,0,6,7,8],[15,0,5,10,1],[8,0,1,2,3],[15,6,11,16,1],[5,0,1,2,3],[16,0,6,11,1],[5,6,7,8,3],[15,0,5,10,16]],[[0,25,41,50,45],[4,28,43,51,45],[24,40,49,53,45],[20,37,47,52,45]],this.boardLength));
      
        shapes.push(new Shape(11,[[5,0,6],[5,0,1],[6,0,1],[5,6,1]],[[0,25,6],[4,28,8],[24,40,18],[20,37,16]],this.boardLength));
      
        shapes.push(new Shape(12,[[7,0,1,6,12],[10,6,7,11,2],[11,0,5,6,12],[10,1,5,6,2]],[[41,45,49,50,53],[43,45,47,51,52],[41,45,49,50,53],[43,45,47,51,52]],this.boardLength));

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
                            this.row++;
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
                var this.workplace = rowArray
                if (startcorner = 1){
                    
                    //push this.workplace
                    //while any in workplace not in left2right
                        //workplace ++, push this.workplace
                    //this.workplace = startPlace
                    //while any in workplace not in left2left
                        //left2left transform, push this.workplace
                    //workplace = startPlace
                    //moveInTransform
                    //ifworkplace not present in left2right or left2left push workplace
                    //startplace = workplace

                }
            */
            this.startCorner = 1;
            //needs ecapsulation
            element.getVerticals().forEach((rowArray) => {

                this.workplace = [...rowArray];
                this.levelupPlace = [...rowArray];
                
                if(this.startCorner == 1){
                    this.left2rightFunc(matrix,row,element.getArrayID());
                    
                    this.goingDownFunc;    
                    

            
                    }

                else if(this.startCorner == 2){
                    this.right2leftFunc;
                    this.goingDownFunc;
                }
                else if(this.startCorner == 3){
                    this.right2leftFunc;
                    this.goingUpFunc;
                }

                else if(this.startCorner == 4){
                    this.left2rightFunc;
                    this.goingUpFunc;
                }

//end of adding verticals




                const tempRow = new Array((this.boardLength) + this.numOfIDColumns);/*
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

                });*/

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
                this.row++;
            });     
        });
        return matrix;
    }
    // needs this.row++ after call
    private setBoardRow(matrix:Node[][],row:number,shapeID:number,arrayToAdd:number[]): Node[][] {
        const tempRow = new Array((this.boardLength) + this.numOfIDColumns);
        //create Nodes for that row only in the spaces needed
        arrayToAdd.forEach((element,index,array) => {
            
            //colCount increases each time so the placement of these will slowly move across the array
            tempRow[element] = new Node(row,element);
            //set column
            tempRow[element].setColumn(matrix[0][element]);
            //increase NodeCount
            (matrix[0][element] as ColumnHeader).setNodeCount((matrix[0][element] as ColumnHeader).getNodeCount()+1);
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
        tempRow[shapeID] = new Node(row,shapeID);
        //set column
        tempRow[shapeID].setColumn(matrix[0][shapeID]);
        //increase NodeCount
        (matrix[0][shapeID] as ColumnHeader).setNodeCount((matrix[0][shapeID] as ColumnHeader).getNodeCount()+1);
        //add to horizontal linkedlist
        tempRow[shapeID].setLeft(tempRow[arrayToAdd[arrayToAdd.length-1]]); //last element
        tempRow[shapeID].setRight(tempRow[arrayToAdd[0]]); //header
        //update current ones
        tempRow[arrayToAdd[arrayToAdd.length-1]].setRight(tempRow[shapeID]);
        tempRow[arrayToAdd[0]].setLeft(tempRow[shapeID]);
        //Vertical linkedlist - already init by colHeaders
        //set top to be the last currently in list i.e. header's top element
        tempRow[shapeID].setTop(matrix[0][shapeID].getTop());
        //set last element to point to the current element
        (matrix[0][shapeID].getTop()).setBottom(tempRow[shapeID]);
        //set header's top to be this element
        matrix[0][shapeID].setTop(tempRow[shapeID]);
        //set current to point to header
        tempRow[shapeID].setBottom(matrix[0][shapeID]);

        matrix.push([...tempRow]);
        return matrix;
    }

    private left2rightFunc(matrix,shapeID) {

        while(this.workplace.filter(x => !this.left2right.includes(x))){//go left
            //push workplace
            //increcease all values in workplace by 1
            
        
            matrix = this.setBoardRow(matrix,shapeID);
            this.row++;
            
            this.workplace = this.workplace.map(x => x + 1);
            }
            this.workplace = this.startPlace;
            matrix = this.setBoardRow(matrix,shapeID);
}

private right2leftFunc(matrix,shapeID) {

    while(this.workplace.filter(x => !this.left2right.includes(x))){//go left
        //push workplace
        //decrese  all values in workplace by 1
        
    
        matrix = this.setBoardRow(matrix,shapeID);
        this.row++;
        
        this.workplace = this.workplace.map(x => x - 1);
        }
        this.workplace = this.startPlace;

        matrix = this.setBoardRow(matrix,shapeID);
}

private goingDownFunc(matrix,shapeID) {
    while(this.workplace.filter(x => !this.left2left.includes(x))){//go down
        //push workplace
        matrix = this.setBoardRow(matrix,shapeID);
        this.row++;
        for(var i = 0; i < this.workplace.length; i++){
   
            if ( this.workplace[i] <= 24 ){
              this.workplace[i] = this.workplace[i] + 5;
            }
            else if(this.workplace[i] <= 40){
                this.workplace[i] = this.workplace[i] + 4;
            }
            else if(this.workplace[i] <= 49){
                this.workplace[i] = this.workplace[i] + 3;
            }
            else if(this.workplace[i] <= 53){
                this.workplace[i] = this.workplace[i] + 2;
            }
            else if(this.workplace[i] <= 54){
                this.workplace[i] = this.workplace[i] + 1;
            }
        }
    }
    this.workplace = this.startPlace;
    if (this.startCorner ==1){
        this.goingInsc1Func(matrix,shapeID);
    }
    else if (this.startCorner ==2){
        this.goingInsc2Func(matrix,shapeID);
    }
    matrix = this.setBoardRow(matrix,shapeID);

}

private goingUpFunc(matrix,shapeID) {
    while(this.workplace.filter(x => !this.right2right.includes(x))){//go down
        //push workplace
        matrix = this.setBoardRow(matrix,shapeID);
        this.row++;
        for(var i = 0; i < this.workplace.length; i++){
   
            if ( this.workplace[i] <= 24 ){
              this.workplace[i] = this.workplace[i] - 5;
            }
            else if(this.workplace[i] <=40){
                this.workplace[i] = this.workplace[i] - 4;
            }
            else if(this.workplace[i] <=49){
                this.workplace[i] = this.workplace[i] - 3;
            }
            else if(this.workplace[i] <=53){
                this.workplace[i] = this.workplace[i] - 2;
            }
            else if(this.workplace[i] <=54){
                this.workplace[i] = this.workplace[i] - 1;
            }
        }
    }
    this.workplace = this.startPlace;
    if (this.startCorner ==3){
        this.goingInsc3Func(matrix,shapeID);
    }
    else if (this.startCorner ==4){
        this.goingInsc4Func(matrix,shapeID);
    }
    matrix = this.setBoardRow(matrix,shapeID);
}

private goingInsc1Func(matrix,shapeID) {
    if(this.workplace.filter(x => !this.left2left.includes(x)) && this.workplace.filter(x => !this.left2right.includes(x))){
        for(var i = 0; i < this.workplace.length; i++){

            if ( this.workplace[i] <= 24 ){
              this.workplace[i] = this.workplace[i] + 6;
            }
            else if(this.workplace[i] <=40){
                this.workplace[i] = this.workplace[i] + 5;
            }
            else if(this.workplace[i] <=49){
                this.workplace[i] = this.workplace[i] + 4;
            }
            else if(this.workplace[i] <=53){
                this.workplace[i] = this.workplace[i] + 3;
            }
            else if(this.workplace[i] <=54){
                this.workplace[i] = this.workplace[i] + 2;
            }
        }
        this.startPlace = this.workplace;
        this.left2rightFunc;
                    
        this.goingDownFunc; 
    }
    else{
        this.nextlevelSc1Func(matrix,shapeID);
    }
    matrix = this.setBoardRow(matrix,shapeID);

}
private goingInsc2Func(matrix,shapeID) {
    if(this.workplace.filter(x => !this.left2left.includes(x)) && this.workplace.filter(x => !this.right2left.includes(x))){
        for(var i = 0; i < this.workplace.length; i++){

            if ( this.workplace[i] <= 24 ){
              this.workplace[i] = this.workplace[i] + 4;
            }
            else if(this.workplace[i] <=40){
                this.workplace[i] = this.workplace[i] + 3;
            }
            else if(this.workplace[i] <=49){
                this.workplace[i] = this.workplace[i] + 2;
            }
            else if(this.workplace[i] <=53){
                this.workplace[i] = this.workplace[i] + 1;
            }
            else if(this.workplace[i] <=54){
                this.workplace[i] = this.workplace[i] + 0;
            }
        }
        this.startPlace = this.workplace;
        this.right2leftFunc;
                    
        this.goingDownFunc; 
        

    }
    else{
        this.nextlevelSc2Func(matrix,shapeID);
    }
    matrix = this.setBoardRow(matrix,shapeID);

}

private goingInsc3Func(matrix,shapeID) {
    if(this.workplace.filter(x => !this.right2right.includes(x)) && this.workplace.filter(x => !this.right2left.includes(x))){
        for(var i = 0; i < this.workplace.length; i++){

            if ( this.workplace[i] <= 24 ){
              this.workplace[i] = this.workplace[i] - 6;
            }
            else if(this.workplace[i] <=40){
                this.workplace[i] = this.workplace[i] - 5;
            }
            else if(this.workplace[i] <=49){
                this.workplace[i] = this.workplace[i] - 4;
            }
            else if(this.workplace[i] <=53){
                this.workplace[i] = this.workplace[i] - 3;
            }
            else if(this.workplace[i] <=54){
                this.workplace[i] = this.workplace[i] -2;
            }
        }
        this.startPlace = this.workplace;
        this.right2leftFunc;
                    
        this.goingUpFunc; 

    }
    else{
        this.nextlevelSc3Func(matrix,shapeID);
    }
    matrix = this.setBoardRow(matrix,shapeID);

}

private goingInsc4Func(matrix,shapeID) {
    if(this.workplace.filter(x => !this.right2right.includes(x)) && this.workplace.filter(x => !this.left2right.includes(x))){
        for(var i = 0; i < this.workplace.length; i++){

            if ( this.workplace[i] <= 24 ){
              this.workplace[i] = this.workplace[i] - 4;
            }
            else if(this.workplace[i] <=40){
                this.workplace[i] = this.workplace[i] - 3;
            }
            else if(this.workplace[i] <=49){
                this.workplace[i] = this.workplace[i] - 2;
            }
            else if(this.workplace[i] <=53){
                this.workplace[i] = this.workplace[i] - 1;
            }
            else if(this.workplace[i] <=54){
                this.workplace[i] = this.workplace[i] -1;
            }
        }
        this.startPlace = this.workplace;
        this.left2rightFunc;
                    
        this.goingUpFunc; 
    }
    else{
        this.nextlevelSc4Func(matrix,shapeID);
    }
    

    matrix = this.setBoardRow(matrix,shapeID);

}

private nextlevelSc1Func(matrix,shapeID) {
this.workplace = this.levelupPlace;
if(this.workplace.filter(x => !this.left2left.includes(x)) && this.workplace.filter(x => !this.left2right.includes(x))){
    for(var i = 0; i < this.workplace.length; i++){//next level
       
        if ( this.workplace[i] < 24 ){
            if(this.workplace[i] <= 4){
            this.workplace[i] = this.workplace[i] + 25;
            }
            else if (this.workplace[i] <= 9){
                this.workplace[i] = this.workplace[i] + 24;
            }
            else if (this.workplace[i] <= 14){
                this.workplace[i] = this.workplace[i] + 23;
            }
            else if (this.workplace[i] <= 19){
                this.workplace[i] = this.workplace[i] + 22;
            }
            else if (this.workplace[i] <= 24){
                this.workplace[i] = this.workplace[i] + 21;
            }
        }
        else if(this.workplace[i] <40 && this.workplace[i] > 24){
            if(this.workplace[i] < 28){
                this.workplace[i] = this.workplace[i] + 16;
                }
                else if (this.workplace[i] <= 32){
                    this.workplace[i] = this.workplace[i] + 15;
                }
                else if (this.workplace[i] <= 36){
                    this.workplace[i] = this.workplace[i] + 14;
                }
                else if (this.workplace[i] <= 40){
                    this.workplace[i] = this.workplace[i] + 13;
                }
        }
        else if(this.workplace[i] <49 && this.workplace[i] > 40){
            if(this.workplace[i] <= 43){
                this.workplace[i] = this.workplace[i] + 9;
                }
                else if (this.workplace[i] <= 46){
                    this.workplace[i] = this.workplace[i] + 8;
                }
                else if (this.workplace[i] <= 49){
                    this.workplace[i] = this.workplace[i] + 7;
                }
                    
        }
        else if(this.workplace[i] <53 && this.workplace[i] > 49){
           if(this.workplace[i] <= 51){
            this.workplace[i] = this.workplace[i] + 4;
           }
           else if (this.workplace[i] <= 53){
            this.workplace[i] = this.workplace[i] + 3;
           }
        }
        else if(this.workplace[i] <=54){
            this.workplace[i] = this.workplace[i] + 1;
        }
    }
    this.startPlace= this.workplace;
    this.levelupPlace = this.workplace;
    if(this.workplace.filter(x => !this.left2left.includes(x)) && this.workplace.filter(x => !this.left2right.includes(x))){
        this.left2rightFunc;
        
        this.goingDownFunc;    
                    

        
    }
}
    else{
        this.startCorner =2;
        //next corner, call get verts again
        
    }
    matrix = this.setBoardRow(matrix,shapeID);
}


private nextlevelSc2Func(matrix,shapeID) {
    this.workplace = this.levelupPlace;
    if(this.workplace.filter(x => !this.left2left.includes(x)) && this.workplace.filter(x => !this.right2left.includes(x))){
    for(var i = 0; i < this.workplace.length; i++){//next level
       
        if ( this.workplace[i] < 24 ){
            if(this.workplace[i] < 4){
            this.workplace[i] = this.workplace[i] + 24;
            }
            else if (this.workplace[i] < 9){
                this.workplace[i] = this.workplace[i] + 23;
            }
            else if (this.workplace[i] < 14){
                this.workplace[i] = this.workplace[i] + 22;
            }
            else if (this.workplace[i] < 19){
                this.workplace[i] = this.workplace[i] + 21;
            }
            else if (this.workplace[i] < 24){
                this.workplace[i] = this.workplace[i] + 20;
            }
        }
        else if(this.workplace[i] <40 && this.workplace[i] > 24){
            if(this.workplace[i] < 28){
                this.workplace[i] = this.workplace[i] + 15;
                }
                else if (this.workplace[i] < 32){
                    this.workplace[i] = this.workplace[i] + 14;
                }
                else if (this.workplace[i] < 36){
                    this.workplace[i] = this.workplace[i] + 13;
                }
                else if (this.workplace[i] < 40){
                    this.workplace[i] = this.workplace[i] + 12;
                }
        }
        else if(this.workplace[i] <49 && this.workplace[i] > 40){
            if(this.workplace[i] < 43){
                this.workplace[i] = this.workplace[i] + 8;
                }
                else if (this.workplace[i] < 46){
                    this.workplace[i] = this.workplace[i] + 7;
                }
                else if (this.workplace[i] < 49){
                    this.workplace[i] = this.workplace[i] + 6;
                }
                    
        }
        else if(this.workplace[i] <53 && this.workplace[i] > 49){
           if(this.workplace[i] < 51){
            this.workplace[i] = this.workplace[i] + 3;
           }
           else if (this.workplace[i] < 53){
            this.workplace[i] = this.workplace[i] + 2;
           }
        }
        else if(this.workplace[i] <54){
            this.workplace[i] = this.workplace[i] + 1;
        }
    }
    this.startPlace= this.workplace;
    this.levelupPlace = this.workplace;
    if(this.workplace.filter(x => !this.left2left.includes(x)) && this.workplace.filter(x => !this.right2left.includes(x))){
        this.right2leftFunc;
        
        this.goingDownFunc;    
                    

        
    }
    else{
        this.startCorner =3;
        //next corner, call get verts again
        
    }
}
matrix = this.setBoardRow(matrix,shapeID);
}
private nextlevelSc3Func(matrix,shapeID) {
    this.workplace = this.levelupPlace;
    if(this.workplace.filter(x => !this.right2right.includes(x)) && this.workplace.filter(x => !this.right2left.includes(x))){
    for(var i = 0; i < this.workplace.length; i++){//next level
       
        if ( this.workplace[i] <= 24 ){
            if(this.workplace[i] < 4){
            this.workplace[i] = this.workplace[i] + 20;
            }
            else if (this.workplace[i] <= 9){
                this.workplace[i] = this.workplace[i] + 19;
            }
            else if (this.workplace[i] <= 14){
                this.workplace[i] = this.workplace[i] + 18;
            }
            else if (this.workplace[i] <= 19){
                this.workplace[i] = this.workplace[i] + 17;
            }
            else if (this.workplace[i] <= 24){
                this.workplace[i] = this.workplace[i] + 16;
            }
        }
        else if(this.workplace[i] <=40 && this.workplace[i] > 24){
            if(this.workplace[i] < 28){
                this.workplace[i] = this.workplace[i] + 12;
                }
                else if (this.workplace[i] <= 32){
                    this.workplace[i] = this.workplace[i] + 11;
                }
                else if (this.workplace[i] <= 36){
                    this.workplace[i] = this.workplace[i] + 10;
                }
                else if (this.workplace[i] <= 40){
                    this.workplace[i] = this.workplace[i] + 9;
                }
        }
        else if(this.workplace[i] <=49 && this.workplace[i] > 40){
            if(this.workplace[i] <= 43){
                this.workplace[i] = this.workplace[i] + 8;
                }
                else if (this.workplace[i] <= 46){
                    this.workplace[i] = this.workplace[i] + 7;
                }
                else if (this.workplace[i] <= 49){
                    this.workplace[i] = this.workplace[i] + 6;
                }
                    
        }
        else if(this.workplace[i] <=53 && this.workplace[i] > 49){
           if(this.workplace[i] < 51){
            this.workplace[i] = this.workplace[i] + 2;
           }
           else if (this.workplace[i] <= 53){
            this.workplace[i] = this.workplace[i] + 1;
           }
        }
        else if(this.workplace[i] <=54){
            this.workplace[i] = this.workplace[i] + 1;
        }
    }
    this.startPlace= this.workplace;
    this.levelupPlace = this.workplace;
    if(this.workplace.filter(x => !this.right2right.includes(x)) && this.workplace.filter(x => !this.right2left.includes(x))){
        this.right2leftFunc;
        
        this.goingUpFunc;    
                    

        
    }
    else{
        this.startCorner =4;
        //next corner, call get verts again
        
    }
}
matrix = this.setBoardRow(matrix,shapeID);
}
private nextlevelSc4Func(matrix,shapeID) {
    this.workplace = this.levelupPlace;
    if(this.workplace.filter(x => !this.right2right.includes(x)) && this.workplace.filter(x => !this.left2right.includes(x))){
    for(var i = 0; i < this.workplace.length; i++){//next level
       
        if ( this.workplace[i] <= 24 ){
            if(this.workplace[i] < 4){
            this.workplace[i] = this.workplace[i] + 20;
            }
            else if (this.workplace[i] <= 9){
                this.workplace[i] = this.workplace[i] + 19;
            }
            else if (this.workplace[i] <= 14){
                this.workplace[i] = this.workplace[i] + 18;
            }
            else if (this.workplace[i] <= 19){
                this.workplace[i] = this.workplace[i] + 18;
            }
            else if (this.workplace[i] <= 24){
                this.workplace[i] = this.workplace[i] + 17;
            }
        }
        else if(this.workplace[i] <=40 && this.workplace[i] > 24){
            if(this.workplace[i] < 28){
                this.workplace[i] = this.workplace[i] + 13;
                }
                else if (this.workplace[i] <= 32){
                    this.workplace[i] = this.workplace[i] + 12;
                }
                else if (this.workplace[i] <= 36){
                    this.workplace[i] = this.workplace[i] + 11;
                }
                else if (this.workplace[i] <= 40){
                    this.workplace[i] = this.workplace[i] + 10;
                }
        }
        else if(this.workplace[i] <=49 && this.workplace[i] > 40){
            if(this.workplace[i] <= 43){
                this.workplace[i] = this.workplace[i] + 7;
                }
                else if (this.workplace[i] <= 46){
                    this.workplace[i] = this.workplace[i] + 6;
                }
                else if (this.workplace[i] <= 49){
                    this.workplace[i] = this.workplace[i] + 5;
                }
                    
        }
        else if(this.workplace[i] <=53 && this.workplace[i] > 49){
           if(this.workplace[i] < 51){
            this.workplace[i] = this.workplace[i] + 3;
           }
           else if (this.workplace[i] <= 53){
            this.workplace[i] = this.workplace[i] + 2;
           }
        }
        else if(this.workplace[i] <=54){
            this.workplace[i] = this.workplace[i] + 1;
        }
    }
    this.startPlace= this.workplace;
    this.levelupPlace = this.workplace;
    if(this.workplace.filter(x => !this.right2right.includes(x)) && this.workplace.filter(x => !this.left2right.includes(x))){
        this.left2rightFunc;
        
        this.goingUpFunc;    
                    

        
    }
    else{
        this.startCorner =1;
        //next corner, call get verts again
        
    }
    
}
matrix = this.setBoardRow(matrix,shapeID);
}

}

