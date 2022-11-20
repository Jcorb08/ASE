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
    // public setMaxSolutionsFound(maxSolutionsFound: boolean){
    //     this.maxSolutionsFound = maxSolutionsFound;
    // }
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
    public addToSolutions(tempSolution:number[][]){
        this.solutions.push([...tempSolution]);
    }
    public addToTempSolution(tempSolution:number[][], row: Node): number[][]{
        //iterate through node add cols to temp solution array
        var temp:number[] = new Array();
        var currentColumn = row;
        temp.push(currentColumn.getColumnID());
        do {
            temp.push(currentColumn.getColumnID());
            currentColumn = currentColumn.getRight();
        } while(currentColumn != row);
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