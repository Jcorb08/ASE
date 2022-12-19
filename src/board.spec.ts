import {Board} from './app/backend/algorithmX';

describe("boardTest", () => {
    it('should create an array of 67 columns', () => {
        
        const board = new Board(5, 11);
        const boardLength = 55;
        const numOfIDCols = 12;
        expect(boardLength).toBe(55);  
        expect(numOfIDCols).toBe(12);
    
    });

});

/*import {Board} from '../src/app/backend/algorithmX';


describe('Board tests', () => { // the tests container
    it('checking default options', () => { // the single test
        const board = new Board(5, 11); // this will be your class
        
        // expect(board).to.be.instanceOf(Board);
    
    });
});

*/