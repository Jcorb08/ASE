import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BoardComponent } from '../board/board.component';
import { GameService } from '../services/game.service';
import { HtmlElementService } from '../services/htmlElement.service';
import { IPiece, Piece } from '../services/piece.component';
import { SharedService } from '../services/shared.service';
import { Board } from '../backend/algorithmX';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css'],
  viewProviders: [ BoardComponent ]
})
export class SelectionComponent implements OnInit {

  private nextSubscription: Subscription;
  private nextElement: ElementRef<HTMLCanvasElement>;
  alphabet = "abcdefghijklmnopqrstuvwxyz"
  next: Piece;
  limit: number
  currentTetris: Piece;
  board: number[][];
  solutions : number[][][] = [];
  refinePreplace: number[][];
  solutionPieces: Piece[] = [];
  currentPiece: Piece;
  currentCtx: CanvasRenderingContext2D;
  currentCtxNext: CanvasRenderingContext2D;
  gameSolved: boolean;
  boardObject: Board;
  gameOutcome = {solved: false, solution: false};

  constructor(private gameService: GameService,
    private htmlService: HtmlElementService,
    private sharedService: SharedService,
    private boardCompo: BoardComponent) {}


  ngOnInit(): void {
    this.sharedService.currentShape.subscribe(piece => this.currentPiece = piece);
    // var boardLength = 55;
    // var layers = 5;
    // this.boardObject = new Board(boardLength,layers);
    // if (typeof Worker !== 'undefined') {
    //   // Create a new
    //   const worker = new Worker(new URL('../backend/onload.worker', import.meta.url));
    //   worker.onmessage = ({ data }) => {
    //     //console.log(`Onload: ${(data as Board)}`);
    //     this.boardObject.setBoard(data as Node[][]);
    //     console.log(`Onload: ${this.boardObject.getBoardLength()}`);
    //   };
    //   worker.postMessage([this.boardObject]);
    // } else {
    //   // Web workers are not supported in this environment.
    //   // You should add a fallback so that your program still executes correctly.
    //   this.boardObject.setBoard(this.boardObject.buildBoard());
    // }

  }

  rotateShape() {
    this.sharedService.currentShape.subscribe(piece => this.currentPiece = piece);
    this.sharedService.currentCtxNext.subscribe(canvas => this.currentCtxNext = canvas);

    const p = this.sharedService.rotateShape(this.currentPiece)
    this.currentPiece.move(p);
    this.currentPiece.drawNext(this.currentCtxNext);

    this.sharedService.updateShape(this.currentPiece)
  }

  generateNewShape(mode: string){
    this.sharedService.currentShape.subscribe(piece => this.currentPiece = piece);
    this.sharedService.currentCtxNext.subscribe(canvas => this.currentCtxNext = canvas);

    // this.currentPiece = this.next ;
    this.next = new Piece(this.currentCtxNext, this.currentPiece, true, {s: mode, x: 0, y: 0});
    this.next.drawNext(this.currentCtxNext);

    this.sharedService.updateShape(this.next)
  }

  flipShape(){
    this.sharedService.currentShape.subscribe(piece => this.currentPiece = piece);
    this.sharedService.currentCtxNext.subscribe(canvas => this.currentCtxNext = canvas);

    const p = this.sharedService.flipShape(this.currentPiece)
    this.currentPiece.move(p);
    this.currentPiece.drawNext(this.currentCtxNext);

    this.sharedService.updateShape(this.currentPiece)
  }

  submitShape(){
    this.sharedService.currentShape.subscribe(piece => this.currentPiece = piece);
    this.sharedService.currentCtx.subscribe(canvas => this.currentCtx = canvas);
    this.sharedService.currentTetris.subscribe(piece => this.currentTetris = piece);
    this.sharedService.getBoard().subscribe(canvas => this.board = canvas);
    this.sharedService.getGameSolved().subscribe(solve => this.gameOutcome = solve);

    if (this.gameOutcome.solved) this.resetGame()
    if (this.currentTetris) this.freezeLastShape()
    this.boardCompo.submit(this.currentPiece, this.currentCtx)
  }

  freezeLastShape(){
    this.currentTetris.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.currentTetris.y][x + this.currentTetris.x] = value;
        }
      });
    });

    this.sharedService.setBoard(this.board)
  }

  resetGame(){
    this.sharedService.setSolutions([]);
    this.sharedService.setGameSolved(false, false);
    this.sharedService.updateTetris(null as unknown as Piece)
    this.sharedService.setReset(true);
  }

  solvePuzzle(){
    this.sharedService.currentTetris.subscribe(piece => { this.currentPiece = piece });
    this.sharedService.getBoard().subscribe(canvas => this.board = canvas);
    this.sharedService.getLimit().subscribe(limit => this.limit = limit);
    this.sharedService.setReset(true);

    this.boardObject = new Board(55,5);
    var testPrePlace:number[][] = this.currentPiece ? this.currentPiece.shape : new Array();
    // var layersStart = [...this.boardObject.getLayersStart()];
    // layersStart.pop();
    // for (let index = 0; index < layersStart.length; index++) {
    //     //console.log(index,(layersStart.length-index)**2,layersStart.length-index);

    //     testPrePlace.push(new Array((layersStart.length-index)**2).fill(0))
    // }
    // testPrePlace[0][0] = 11;
    //testPrePlace[0][5] = 11;
    //testPrePlace[0][6] = 11;
    //preplacing whole of bottom of level5 pyramid so we can solve for level 4
    // for (let index = 0; index < testPrePlace[0].length; index++) {
    //   if ([6,7,8,11,13].includes(index)) {
    //     testPrePlace[0][index] = 1;
    //   } else if([18,19,22,23,24].includes(index)){
    //     testPrePlace[0][index] = 6;
    //   } else if([2,3,4,9,14].includes(index)){
    //     testPrePlace[0][index] = 9;
    //   } else if([0,1,5,10,15].includes(index)){
    //     testPrePlace[0][index] = 10;
    //   } else if([12,16,17,20,21].includes(index)){
    //     testPrePlace[0][index] = 12;
    //   }
    // }
    // console.log(testPrePlace, 'testPrePlace');

    //reset board before solve
    //this.boardObject.reset();
    //console.log('BoardObject Board Length', this.boardObject.getBoardLength());
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../backend/solve.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        //console.log(`Solve: ${data}`);
        //this.boardObject = (data as Board);
        this.solutions = data as number[][][];
        console.log('solutions',this.solutions);
        this.sharedService.setSolutions(this.solutions)
        this.sharedService.setReset(true)
      };
      worker.postMessage([55,5,testPrePlace,this.limit,0]);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      // this will crash the window currently
      this.boardObject = new Board(55,5);
      var buildBoard = new buildBoard(this.boardObject.getLayers(),this.boardObject.getBoardLength(),this.boardObject.getLayersStart())
      this.boardObject.setBoard(buildBoard.buildBoard());
      this.solutions = this.boardObject.solve(new Array(),1,0).getSolutions();
      this.sharedService.setSolutions(this.solutions)
      this.sharedService.setReset(true)
    }
  }

}
