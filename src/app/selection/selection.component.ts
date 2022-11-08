import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BoardComponent } from '../board/board.component';
import { GameService } from '../services/game.service';
import { HtmlElementService } from '../services/htmlElement.service';
import { IPiece, Piece } from '../services/piece.component';
import { SharedService } from '../services/shared.service';
import { solveX } from '../../assets/js/algorithmX'

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {

  private nextSubscription: Subscription;
  private nextElement: ElementRef<HTMLCanvasElement>;
  next: Piece;
  currentTetris: Piece;
  board: number[][];
  solution: string[][];
  solutionPieces: Piece[] = [];
  currentPiece: Piece;
  currentCtx: CanvasRenderingContext2D;
  currentCtxNext: CanvasRenderingContext2D;

  constructor(private gameService: GameService,
    private htmlService: HtmlElementService,
    private sharedService: SharedService) {}


  ngOnInit(): void {
    this.sharedService.currentShape.subscribe(piece => this.currentPiece = piece);
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

    if (this.currentTetris) this.freezeLastShape()
    new BoardComponent(this.gameService, this.htmlService, this.sharedService).submit(this.currentPiece, this.currentCtx)
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
    this.sharedService.setReset(true);
  }

  solvePuzzle_old(){
    let alphabet = "abcdefghijklmnopqrstuvwxyz"
    let foundPieces: string[] = [] ;
    this.solutionPieces = [];
    this.sharedService.currentCtx.subscribe(board => this.currentCtx = board);

    this.resetGame();
    this.solution = solveX();
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
      console.log(row, 'submitPieces');
      
      new BoardComponent(this.gameService, this.htmlService, this.sharedService).submitPieces(row, this.currentCtx)
    });
  }

  solvePuzzle(){
    let alphabet = "abcdefghijklmnopqrstuvwxyz"
    this.sharedService.getBoard().subscribe(canvas => this.board = canvas);

    this.resetGame();
    this.solution = solveX();
    console.log(this.solution, 'this.board')
    this.solution.forEach((row, y) => {
      row.forEach((value, x) => {
        Object.entries(value).forEach(([key, item]) => {
          this.board[x][Number(key)] = alphabet.indexOf(item.toLowerCase())+1;
        });
      });
    });
    console.log(this.board);
    this.sharedService.setBoard(this.board)
    new BoardComponent(this.gameService, this.htmlService, this.sharedService).drawBoard()
    
  }


}
