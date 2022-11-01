//main





var polySolver = new PolyominoSolver();

displayBoard();

function solvePoly() {
    var solutions = polySolver.solve();
    var firstSolution = solutions[0];

} 


//shape
/**
 * A shape that takes part in a Polyomino puzzle.
 */
class Shape{
    constructor(color, points){
        this.color = color;
        this.fills = fills;
    }  
    inBounds(x, y, boundX, boundY) {
        return x >= 0 && x < boundX && y >= 0 && y < boundY;
    }
    overflows(placedX, placedY, boundX, boundY) {
        for (var i = 0; i < this.fills.length; ++i) {
            var checkX = placedX + this.fills[i].x;
            var checkY = placedY + this.fills[i].y;
            if ( ! this.inBounds(checkX, checkY, boundX, boundY)) return true;
        }
        return false;
    }

}

//shape choice class

class ShapeChoices{
    constructor(idx, shape, posx, posy){
        this.idx = idx;
        this.shape = shape;
        this.x = posx;
        this.y = posy;
    }

    toString() {
        return "Shape "+this.idx+" can be placed at ("+this.x+", "+this.y+")";
    }
    
}




 class PolynomioSolver{
    constructor(){
    this.network = new Network();
    
    this.x = 5;
    this.y = 11;
    this.shapes = [];
    this.cellConstraints = [];
    this.shapeConstraints = [];
    this.setUpShapes();
    this.setUpCellConstraints();
    this.setUpShapeConstraints();
    this.setUpChoices();
    }

        setUpShapes() {
        this.shapes.push(new Shape("#f00", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0}])); // straight to right
        this.shapes.push(new Shape("#0f0", [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:0,y:4}])); // straight to bottom
        this.shapes.push(new Shape("#00f", [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:2,y:2}])); // L
        this.shapes.push(new Shape("#ff0", [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2},{x:2,y:2}])); // reverse L
        this.shapes.push(new Shape("#f0f", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:2,y:1}])); // T
        this.shapes.push(new Shape("#0ff", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:1,y:1}])); // reverse T
        this.shapes.push(new Shape("#fff", [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1}])); // square
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:2,y:1},{x:2,y:2}])); // Z
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1},{x:1,y:1},{x:0,y:2}])); // reverse Z
            }


            setUpCellConstraints() {
                for (var i = 0; i < this.x * this.y; ++i) {
                    this.cellConstraints[i] = this.network.ensureConstraint("cell "+i+" must be filled"); 
                }
            }

            setUpShapeConstraints() {
                for (var i = 0; i < this.shapes.length; ++i) {
                    this.shapeConstraints[i] = this.network.ensureConstraint("shape "+i+" must be placed");
                }
            }
            setUpChoices() {
                for (var shapeIdx = 0; shapeIdx < this.shapes.length; ++shapeIdx) {
                    var shape = this.shapes[shapeIdx];
                    for (var cell = 0; cell < this.x * this.y; ++cell) {
                        var placedX = cell % this.x;
                        var placedY = Math.floor(cell / this.y);
                        if (shape.overflows(placedX, placedY, this.x, this.y) == false) {
                            // this shape can be placed at this location.
                            // work out what constraints it fills.
                            // one for each cell it covers;
                            var addArg = [new ShapeChoice(shapeIdx, this.shapes[shapeIdx], placedX, placedY), this.shapeConstraints[shapeIdx]];
                            for (var pointIdx = 0; pointIdx < shape.fills.length; ++pointIdx) {
                                var p = shape.fills[pointIdx];
                                var cellNo = (p.x + placedX) + (p.y + placedY) * this.x;
                                addArg.push(this.cellConstraints[cellNo]);
                            }
                            this.network.add.apply(this.network, addArg);
                        }
                    }
                }
            }
            
            solve() {
                var solutions = this.network.solve();
                return solutions;
            }
        }

 


//tablenode

class TableNode{

    constructor(rowHeader,columnHeader){

        this.rowHeader = rowHeader;
        this.columnHeader = columnHeader;
        var self = this;
		var listener = {
				onNodeHidden: function onNodeHidden(node) {
					if (node == self.rowChain) {
						if (self.rowHeader != null) self.rowHeader.actives--;
					} else if (node == self.colChain) {
						if (self.columnHeader != null) self.columnHeader.actives--;
					}
				},
				onNodeRestored: function onNodeRestored(node) {
					if (node == self.rowChain) {
						if (self.rowHeader != null) self.rowHeader.actives ++;
					} else if (node == self.colChain) {
						if (self.columnHeader != null) self.columnHeader.actives ++;
					}
				},
				onNodeSpliced: function(node) {this.onNodeRestored(node);}
		}
    }

   forEachColumn(func) {
		this.rowChain.forEach(func);
	}

    addToHeadersChains() {
		if (this.rowHeader != null) {
			this.rowChain.spliceInto(this.rowHeader.rowChain.previous);
		}
		if (this.columnHeader != null) {
			this.colChain.spliceInto(this.columnHeader.colChain.previous);
		}
	}

    forEachRow(func) {
		this.colChain.forEach(func);
	}

    hideFromColumn(hiddenNodes) {
		hiddenNodes.push(this.colChain);
		this.colChain.hide();
	}

    hideFromRow(hiddenNodes) {
		hiddenNodes.push(this.rowChain);
		this.rowChain.hide();
	}

    toString = function() {
		return "{" + this.rowHeader +" x " + this.columnHeader +"}"; 
	}

    
}

//circularList

var guid = 0;

class CircularList {

    constructor(data, lifecycleListener) {

        this.hidden = false;
		this.id = ++guid;

        this.next = this;
        this.previous = this;
        this.lifecycleListener = lifecycleListener;
        this.data = data;
        this.enumerable = data !== undefined ? true : false;
}
forEach(func) {
    if (typeof func != 'function') Utils.error(ERROR_MESSAGES["notFunc"], "forEach", "func", func, typeof func);
    if (this.hidden !== false) Utils.error(ERROR_MESSAGES["hidden"], "forEach");
    var nextNode = this;
    do {
        var currentNode = nextNode;
        nextNode = currentNode.next;
        var result = currentNode.enumerable ? func(currentNode.data, currentNode) : true;
        if (result === false) break;
    } while (nextNode != this);
}
toString() {
    return "{circ#"+this.id+"}";
}
toArray() {
    var result = [];
    this.forEach(function(val){result.push(val);});
    return result;
}
spliceInto(newPrevious) {
    var oldPrevious = this.previous;
    this.previous.next = newPrevious.next;
    this.previous = newPrevious;
    newPrevious.next.previous = this;
    newPrevious.next = this;
    if (this.lifecycleListener != null) {
        this.lifecycleListener.onNodeSpliced(this, oldPrevious);
    }
}
push(data, lifecycleListener) {
    if (data === undefined) Utils.error(ERROR_MESSAGES["undefined"], "add", "data");
    var node = new CircularList(data, lifecycleListener);
    node.spliceInto(this.previous);
    return node;
}
isEmpty() {
    if (this.next == this && this.enumerable == false) return true;
    var result = true;
    this.forEach(function() {
        result = false;
        return false;
    });
    return result;
}
hide() {
    if (this.hidden === false) {
        this.hidden = true;
        this.next.previous = this.previous;
        this.previous.next = this.next;
        if (this.lifecycleListener != null) {
            this.lifecycleListener.onNodeHidden(this)
        }
    }
}
restore() {
    if (this.hidden === true) {
        this.hidden = false;
        this.next.previous = this;
        this.previous.next = this;
        if (this.lifecycleListener != null) {
            this.lifecycleListener.onNodeRestored(this)
        }
    }
}

}


//solve it



//constrains

//choice

//network

//finish main

//they are all subclasses of tablenode

