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
        this.shapes.push(new Shape("#f00", [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:2,y:0}])); // Red c chape
        this.shapes.push(new Shape("#0f0", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:3,y:1}])); // dark pink wiggle
        this.shapes.push(new Shape("#00f", [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2},{x:2,y:1}])); // light pink branch
        this.shapes.push(new Shape("#ff0", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1}])); // dark blue triangle
        this.shapes.push(new Shape("#f0f", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:3,y:0}])); // yellow P
        this.shapes.push(new Shape("#0ff", [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1},{x:2,y:1}])); // Purple b 
        this.shapes.push(new Shape("#fff", [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}])); // Dark Purple s
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2},])); // Light green short L
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2}])); // large orenge right angle
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:2,y:0},{x:3,y:0}])); // long green L
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:0,y:1},{x:1,y:0}])); // small orenge right angle
        this.shapes.push(new Shape("#888", [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:2,y:2}])); // light blue w
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
        this.rowChain = new CircularList(this, listener);
		this.colChain = new CircularList(this, listener);
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

//constrains
class Choice extends TableNode {
    constructor(desc){
        super();
        this.actives = 0;
        this.description = desc;
        this.rowChain.enumerable = false;
    }

    choose(hiddenNodes){
        this.forEachSatisfiedConstraint(function(constraint) {
            constraint.satisfy(hiddenNodes);
        });
    }

    remove(hiddenNodes) {
        this.hideFromColumn(hiddenNodes);
        this.forEachSatisfiedConstraint(function(constraint, constraintLink) {
            constraintLink.hideFromColumn(hiddenNodes);
        });
    }

    satisfies(constraint) {
        var TableNode = require('./TableNode.js');
        var node = new TableNode(this, constraint);
        node.addToHeadersChains();
        return node;
    }

    forEachSatisfiedConstraint(func) {
        this.forEachColumn(function(constraintLink) {
            var constraint = constraintLink.columnHeader;
            return func(constraint, constraintLink);
        });
    }

    toString() {
        return this.description + "?";
    }


}

//choice
class Constraint extends TableNode {
    constructor(desc){
        super();
        this.actives = 0;
        this.description = desc;
        //this.optional = false;
        this.colChain.enumerable = false;
    }

    satisfy(removedNodes) {
        this.hideFromRow(removedNodes);
        this.forEachSatisfyingChoice(function(choice) {
            choice.remove(removedNodes);
        });
    }

    forEachSatisfyingChoice(func) {
        this.forEachRow(function(choiceLink){
            var choice = choiceLink.rowHeader;
            return func(choice, choiceLink);
        });
    }

    toString() {
        return this.description + "(" + this.actives + ")!";
    }
}

//network
class Network extends TableNode {
    constructor(){
        super();
        this.rowChain.enumerable = false;
        this.colChain.enumerable = false;
        this.constraints = {};
    }

    makeOptional(constraintName) {
        var constraint = this.ensureConstraint(constraintName);
        if (constraint.optional == false) {
            constraint.optional = true;
            this.add(null, constraintName);
        }
    }

    add(choiceDescription, constraintDescription) {
        var Choice = require('./Choice.js');
        var Constraint = require('./Constraint.js');
        var choice = new Choice(choiceDescription);
        choice.colChain.spliceInto(this.colChain.previous);
        var TableNode = require('./TableNode.js');
        for (var i=1; i<arguments.length; ++i) {
            var constraint = arguments[i];
            if (constraint == null) throw new Error('constraint may not be null');
            if (constraint instanceof Constraint == false) {
                constraint = this.ensureConstraint(constraint);
            }
            choice.satisfies(constraint);
        }
        return choice;
    }

    ensureConstraint(constraintName) {
        var Constraint = require('./Constraint.js');
        var constraint = this.constraints[constraintName];
        if (constraint == undefined) {
            constraint = new Constraint(constraintName);
            this.constraints[constraintName] = constraint;
            constraint.rowChain.spliceInto(this.rowChain.previous);
        }
        return constraint;
    }

    isSolved() {
        return this.rowChain.next == this.rowChain;
    }

    minConstraint(){
        var minConstraint = null;
        var count = null;
        this.forEachColumn(function(constraint) {
            if (count == null || count > constraint.actives) {
                minConstraint = constraint;
                count = minConstraint.actives;
                if (count == 0) return false;
            }
        });
        return minConstraint;
    }

    solve(maxSolutions, maxRunTime) {
        var result = solve(this, maxSolutions ? maxSolutions : null, getBlankSolutions(), [], maxRunTime ? new Date().getTime() + maxRunTime : undefined);
        result.info.endTime = new Date().getTime();
        return result;
    }

    solveOnce(maxRunTime) {
        var result = solve(this, 1, getBlankSolutions(), [], maxRunTime ? new Date().getTime() + maxRunTime : undefined);
        result.info.endTime = new Date().getTime();
        return result[0];
    }

    toString() {
        var result = "";
        this.forEachRow(function(rowHeader) {
            result += rowHeader.toString();
            rowHeader.forEachColumn(function(node) {
                result+="\t"+node.toString();
            });
            result+="\n";
        });
        return result;
    }

}

//solve it

function restoreAll(hidden) {
    for (var i = 0; i < hidden.length; ++i) {
        hidden[i].restore();
    }
}

function getBlankSolutions() {
    var solutions = [];
    solutions.info = {
            ranOutOfTime: false,
            foundMaxSolutions: false,
            backtrackings: 0,
            startTime: new Date().getTime()
    };
    return solutions;
}

function solve(network, maxSolutions, solutions, tryingChoices, latestTime) {
    if (solutions.info.ranOutOfTime && latestTime != null && latestTime < new Date().getTime()) {
        solutions.info.ranOutOfTime = true;
        return solutions;
    }
    // Find the constraint with the fewest choices that could satisfy it.
    // (This heuristic should reduce the maximum branching).
    var constraint = network.minConstraint();
    if (constraint == null) {
        // there are no constraints left - it's a solution
        solutions.push(tryingChoices);
    } else if (constraint.actives == 0) {
        // there are no choices that will satisfy a constraint, we have to give up this line of inquiry.
        solutions.info.backtrackings ++;
    } else {
        // no solution yet - search for one...
        constraint.forEachSatisfyingChoice(function(choiceToTry) {
            if (solutions.info.ranOutOfTime && latestTime != null && latestTime < new Date().getTime()) {
                solutions.info.ranOutOfTime = true;
                return false;
            }
            var trying = tryingChoices.slice();
            if (choiceToTry.description != null) trying.push(choiceToTry.description);
            var hidden = [];
            choiceToTry.choose(hidden);
            solve(network, maxSolutions, solutions, trying, latestTime);
            restoreAll(hidden);
            if (maxSolutions != null && solutions.length >= maxSolutions) {
                solutions.info.foundMaxSolutions = true;
                return false;
            }
        });
    }
    return solutions;
}

//finish main
var polySolver = new PolynomioSolver();

//displayBoard();

function solvePoly() {
    var solutions = polySolver.solve();
    var firstSolution = solutions[0];
    return firstSolution;
} 

console.log(solvePoly())

//they are all subclasses of tablenode

