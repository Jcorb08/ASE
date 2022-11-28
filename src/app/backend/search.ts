import { Board } from './algorithmX';
import { Node, ColumnHeader } from './node';

export class SearchObject{

    private solutions: number[][][];
    private ranOutOfTime: boolean;
    private maxSolutionsFound: boolean;
    private dfs: number;
    private maxSolutions: number;
    private latestTime: number;

    constructor(maxSolutions:number,latestTime:number){

        this.maxSolutions = maxSolutions;
        this.latestTime = latestTime;
        //list of lists that contain the columnIDs of each shape
        this.solutions = new Array();
        //have we ran out of time
        this.ranOutOfTime = false;
        //have we found maxSolutions
        this.maxSolutionsFound = false;
        //how deep we are in the algorithm
        this.dfs = 0;
    }

    //Getters
    public getDFS(): number{
        return this.dfs;
    }
    public getRanOutOfTime(): boolean{
        return this.ranOutOfTime;
    }
    public getMaxSolutionsFound(): boolean{
        return this.maxSolutionsFound;
    }
    public getSolutions(): number[][][]{
        return this.solutions;
    }
    //Setters
    // public setDFS(dfs:number){
    //     this.dfs = dfs;
    // }
    // public setRanOutOfTime(ranOutOfTime: boolean){
    //     this.ranOutOfTime = ranOutOfTime;
    // }
    public setMaxSolutionsFound(maxSolutionsFound: boolean){
        this.maxSolutionsFound = maxSolutionsFound;
    }
    // public setSolutions(solutions: number[][]){
    //     this.solutions = solutions;
    // }

    //Methods
    public increaseDFS(){
        this.dfs++;
    }
    public decreaseDFS(){
        this.dfs--;
    }
    public addToSolutions(tempSolution:number[][],boardObject:Board){
        // length 5 where 5 is height of pyrmid
        // var solution = new Array(boardObject.getLayers()).fill(new Array());
        // var layersStart = boardObject.getLayersStart();
        // layersStart.pop(); //remove last as this is end of array
        // tempSolution.forEach((row :number[],index: number)=>{
        //     var shapeID:number = boardObject.getShapeID(row.pop() as number);
        //     row.forEach((col:number,index:number)=>{
        //         var layerValues = layersStart.map(x => x-col);
        //         for (let i = layerValues.length-1; i >= 0; i--) {
        //             if(layerValues[i] >= 0){
        //                 //can be placed in that layer
        //                 //e.g. col=30 -> first true is where layersStart = 25 as x-col=5
        //                 // therefore its placed at [1][5] as [1][0] here would be the 25th space
        //                 solution[i][layerValues[i]] = shapeID;
        //             }               
        //         }
        //     })
        // });
        this.solutions.push([...tempSolution]);
    }
    public addToTempSolution(tempSolution:number[][], row: Node): number[][]{
        //iterate through node add cols to temp solution array
        var temp:number[] = new Array();
        var currentColumn = row;
        console.log('rowTempSol',row,currentColumn,currentColumn.getColumnID());
        
        do {
            temp.push(currentColumn.getColumnID());
            currentColumn = currentColumn.getRight();
        } while(currentColumn != row);
        tempSolution.push(temp);
        console.log('temp',temp);
        
        //console.log('tempSol',tempSolution);
        
        return tempSolution;
    }
    public checkMaxSolutions(): boolean{
        if (this.maxSolutions != 0 && this.solutions.length >= this.maxSolutions) {
            this.maxSolutionsFound = true;
        }
        return this.maxSolutionsFound;
    }
    public checkTime():boolean{
        if(this.latestTime != 0 && this.latestTime < new Date().getTime()){
            this.ranOutOfTime = true;
        }
        return this.ranOutOfTime;
    }    
}