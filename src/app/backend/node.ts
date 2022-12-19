export class Node {

    //Connected Nodes
    protected left: Node;
    protected right: Node;
    protected top: Node;
    protected bottom: Node;
    protected column: ColumnHeader;

    //Activated
    protected activated: boolean;

    //IDs
    protected rowID: number;
    protected columnID: number;

    //Setters
    public setLeft(left: Node){
        this.left = left;
    }
    public setRight(right: Node){
        this.right = right;
    }
    public setTop(top: Node){
        this.top = top;
    }
    public setBottom(bottom: Node){
        this.bottom = bottom;
    }
    public setColumn(column: ColumnHeader){
        this.column = column;
    }
    //Getters
    public getLeft(): Node{
        return this.left;
    }
    public getRight(): Node{
        return this.right;
    }
    public getTop(): Node{
        return this.top;
    }
    public getBottom(): Node{
        return this.bottom;
    }
    public getColumn(): ColumnHeader{
        return this.column;
    }
    public getColumnID(): number{
        return this.columnID;
    }
    public getRowID(): number{
        return this.rowID;
    }
    //Construct
    constructor(rowID: number, columnID: number){
        this.rowID = rowID;
        this.columnID = columnID;
    }

}

export class ColumnHeader extends Node {
    private nodeCount: number;

    constructor(activated: boolean, rowID: number, columnID: number){
        super(rowID,columnID);
        this.activated = activated;
        this.nodeCount = 0;
    }
    //Setters
    public setNodeCount(nodeCount: number){
        this.nodeCount = nodeCount;
    }
    public setActivated(activated: boolean){
        this.activated = activated;
    }
    //Getters
    public getNodeCount(): number{
        return this.nodeCount;
    }
    public getActivated(): boolean{
        return this.activated;
    }
}