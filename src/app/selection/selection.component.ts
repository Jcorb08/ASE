import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BoardComponent } from '../board/board.component';
import { GameService } from '../services/game.service';
import { HtmlElementService } from '../services/htmlElement.service';
import { IPiece, Piece } from '../services/piece.component';
import { SharedService } from '../services/shared.service';
import { Board } from '../backend/algorithmX';
import { Node } from '../backend/node';
import { AnyCnameRecord } from 'dns';
import { COLS, ROWS, STEPS } from '../services/constants';

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
  currentTetris: Piece;
  board: number[][];
  solution: string[][];
  refinePreplace: string[][];
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
    this.sharedService.getGameSolved().subscribe(solve => this.gameOutcome = solve.solved);

    if (this.gameOutcome) this.resetGame()
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
    this.sharedService.updateTetris(null as unknown as Piece)
    this.sharedService.setReset(true);
  }

  solvePuzzle_old(){
    let alphabet = "abcdefghijklmnopqrstuvwxyz"
    let foundPieces: string[] = [] ;
    this.solutionPieces = [];
    this.sharedService.currentCtx.subscribe(board => this.currentCtx = board);

    this.resetGame();
    this.solution = [[]];
    //solveX(undefined,1,undefined);
    console.log(this.solution, 'this.board')
    this.solution.forEach((row, y) => {
      row.forEach((value, x) => {
        Object.entries(value).forEach(([key, item]) => {
          if(foundPieces.indexOf(item) == -1){
            this.solutionPieces.push(
              new Piece(
                this.currentCtx,
                {},
                true,
                {s: (alphabet.indexOf(item.toLowerCase())+1).toString(), x: Number(key), y: x}
              )
            )
            foundPieces.push(item)
          }
        });
      });
    });
    this.submitPieces_old();
  }

  submitPieces_old(){
    this.solutionPieces.forEach((row, y) => {
      this.sharedService.currentCtx.subscribe(canvas => this.currentCtx = canvas);
      this.sharedService.currentTetris.subscribe(piece => this.currentTetris = piece);
      this.sharedService.getBoard().subscribe(canvas => this.board = canvas);

      if (this.currentTetris) this.freezeLastShape()
      this.boardCompo.submitPieces(row, this.currentCtx)
    });
  }

  solvePuzzle(){
    this.sharedService.currentTetris.subscribe(piece =>{
      if(piece) this.refinePreplace =  this.refinePrePlaceTest(piece.shape)
    });
    this.sharedService.getBoard().subscribe(canvas => this.board = canvas);
    this.sharedService.setReset(true);

    // let prePlaceTest = new Array()
    // for (let index = 0; index < 5; index++) {
    //     //const element = array[index];
    //     var tempRow = [...new Array(11).fill(0)];
    //     if (index == 0) {
    //         tempRow[0] = 'K';
    //     } else if(index == 1) {
    //         tempRow[0] = 'K';
    //         tempRow[1] = 'K';
    //     }
    //     prePlaceTest.push(tempRow);
    // }
    // console.log(prePlaceTest, 'prePlaceTest');

    //reset board before solve
    //this.boardObject.reset();
    var solutions : number[][][] = [];
    //console.log('BoardObject Board Length', this.boardObject.getBoardLength());
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../backend/solve.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`Solve: ${data}`);
        //this.boardObject = (data as Board);
        solutions = data[0] as number[][][];
        console.log('solutions',solutions);
      };
      worker.postMessage([55,5,new Array(),1,0]);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      // this will crash the window currently
      this.boardObject = new Board(55,5);
      var buildBoard = new buildBoard(this.boardObject.getLayers(),this.boardObject.getBoardLength(),this.boardObject.getLayersStart())
      this.boardObject.setBoard(buildBoard.buildBoard());
      solutions = this.boardObject.solve(new Array(),1,0).getSolutions();
    }
    
    // this.solution.forEach((row, y) => {
    //   row.forEach((value, x) => {
    //     Object.entries(value).forEach(([key, item]) => {
    //       this.board[x][Number(key)] = this.alphabet.indexOf(item.toLowerCase())+1;
    //     });
    //   });
    // });
    // this.sharedService.setBoard(this.board)
    // new BoardComponent(this.gameService, this.htmlService, this.sharedService).drawBoard()
    // this.sharedService.setGameSolved(true)

  }

  refinePrePlaceTest(shape: number[][]){
    let refinePreplace = this.gameService.getEmptySBoard();
    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0){
          refinePreplace[y][x] = this.alphabet[value-1].toUpperCase();
        }
      });
    });
    return refinePreplace;
  }

  // removeZeroLineColumn(shape: any){
  //   let pivot = (a: any) => a[0].map((_: any, i: any) => a.map((b: any) => b[i]))
  //   let rotated = pivot(shape)
  //   let filtered = rotated.filter((row: any) => !row.every((v: any) => v == 0 || v == '0'))
  //   return pivot(filtered)
  // }

  // removeZeroLineRow(shape: any){
  //   let filtered = shape.filter((row: any) => !row.every((v: any) => v == 0 || v == '0'))
  //   return filtered
  // }

}
