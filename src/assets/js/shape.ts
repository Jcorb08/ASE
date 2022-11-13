export class Shape{

    private id: String;
    private arrayID: number;
    private coords: number[][];

    constructor(id:String,coords:number[][],arrayLength:number){
        // the letter A-L
        this.id = id;
        // represented as 0-11 for the algorithmX array

        // change to take x and y as inputs
        this.arrayID = arrayLength + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        // define coords here how you said rob, the pattern in a 1d array
        // represented as 11110001
        // a list of them rotated clockwise
        this.coords = coords;
    }

    //Getters
    public getID(): String{
        return this.id;
    }
    public getArrayID(): number{
        return this.arrayID;
    }
    public getCoords(): number[][]{
        return this.coords;
    }
}