export class Node {

    //Connected Nodes
    protected left: Node;
    protected right: Node;
    protected top: Node;
    protected bottom: Node;
    protected column: Node;

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
    public setColumn(column: Node){
        this.column = column;
    }
    public setActivated(activated: boolean){
        this.activated = activated;
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
    public getColumn(): Node{
        return this.column;
    }
    public getActivated(): boolean{
        return this.activated;
    }
    public getColumnID(): number{
        return this.columnID;
    }
    public getRowID(): number{
        return this.rowID;
    }

    //Construct
    constructor(activated: boolean, rowID: number, columnID: number){
        this.activated = activated;
        this.rowID = rowID;
        this.columnID = columnID;
    }

    //cover a given node
    public cover(targetNode: Node){
        //pointer to header column
        var columnNode: ColumnHeader = (targetNode.getColumn() as ColumnHeader);

        //unlink column header from its neighbours
        columnNode.getLeft().setRight(columnNode.getRight());
        columnNode.getRight().setLeft(columnNode.getLeft());

        //move down column and remove each row
        //by traversing right
        for (let row = columnNode.getBottom(); row != columnNode; row = row.getBottom()) {
            for (let rightNode = row.getRight(); rightNode != row; rightNode = rightNode.getRight()) {
                rightNode.getTop().setBottom(rightNode.getBottom());
                rightNode.getBottom().setTop(rightNode.getTop());
                //get column and decrease nodeCount
                (rightNode.getColumn() as ColumnHeader).setNodeCount((rightNode.getColumn() as ColumnHeader).getNodeCount()-1 );
            }
            
        }
    }

    //uncover a given node
    public uncover(targetNode: Node){
        //pointer to header column
        var columnNode: ColumnHeader = (targetNode.getColumn() as ColumnHeader);

        //move down column and relink each row
        //by traversing left
        for (let row = columnNode.getTop(); row != columnNode; row = row.getTop()) {
            for (let leftNode = row.getLeft(); leftNode != row; leftNode = leftNode.getRight()) {
                leftNode.getTop().setBottom(leftNode);
                leftNode.getBottom().setTop(leftNode);
                //get column and decrease nodeCount
                (leftNode.getColumn() as ColumnHeader).setNodeCount((leftNode.getColumn() as ColumnHeader).getNodeCount()+1 );
            }
            
        }
        //link column header to its neighbours
        columnNode.getLeft().setRight(columnNode);
        columnNode.getRight().setLeft(columnNode);
    }

}

export class ColumnHeader extends Node {
    private nodeCount: number;

    constructor(activated: boolean, rowID: number, columnID: number){
        super(activated,rowID,columnID);
        this.nodeCount = 0;
    }
    //Setters
    public setNodeCount(nodeCount: number){
        this.nodeCount = nodeCount;
    }
    //Getters
    public getNodeCount(): number{
        return this.nodeCount;
    }

    //get min Column
    public getMinColumn(): ColumnHeader{
        var minColumn: ColumnHeader = (this.getRight() as ColumnHeader);
        var currentColumn: ColumnHeader = (this.getRight().getRight() as ColumnHeader);
        do {
            if(currentColumn.getNodeCount() < minColumn.getNodeCount()){
                minColumn = currentColumn;
            }
            currentColumn = (currentColumn.getRight() as ColumnHeader);
        } while(currentColumn != this);

        return minColumn;
    }
}