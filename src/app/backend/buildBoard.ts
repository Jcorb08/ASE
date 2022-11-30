import { ColumnHeader,Node } from "./node";
import { Shape } from "./shape";


class buildBoard{

    private boardLength:number;
    private layers:number;
    private layersStart:number[];
    private shapes: Shape[];
    private numOfIDColumns: number;

    constructor(layers,boardLength,layersStart){
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
}