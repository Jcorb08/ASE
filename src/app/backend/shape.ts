export class Shape{

    private id: number;
    private arrayID: number;
    private coords: number[][];
    private verticals: number[][];

    constructor(id:number,coords:number[][],verticals:number[][],arrayLength:number){
        // the number 1-12
        this.id = id;
        // represented as 0-11 for the algorithmX array

        // change to take x and y as inputs
        //this.arrayID = arrayLength + (this.id.charCodeAt(0) - 65); // -'A' to get 0
        this.arrayID = arrayLength + (this.id - 1); //starts at 0

        //coords for example [[0,1,2,11,13],[0,1,11,22,23]]
        // a list of them rotated clockwise
        this.coords = coords;
        //verticals - manually inputted
        this.verticals = verticals;
    }

    //Getters
    public getID(): number{
        return this.id;
    }
    public getArrayID(): number{
        return this.arrayID;
    }
    public getCoords(): number[][]{
        return this.coords;
    }
    public getVerticals(): number[][]{
        return this.verticals;
    }
}