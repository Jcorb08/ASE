
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit} from '@angular/core';
import {
  COLS,
  BLOCK_SIZE,
  ROWS,
  COLORS,
  COLORSLIGHTER,
  COLORSDARKER
} from './../services/constants';
import { Piece, IPiece } from './../services/piece.component';
import { GameService } from './../services/game.service';
import { HtmlElementService } from '../services/htmlElement.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @ViewChild('board', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;
  board: number[][];
  _piece: Piece;
  piece: Piece;
  next: Piece;

  constructor(private gameService: GameService,
    private htmlService: HtmlElementService,
    private sharedService: SharedService) {
    }

  ngOnInit() {
    this.sharedService.getReset().subscribe((value: boolean) => {
      if(value) {
        this.initBoard();
        this.play()
      }
    })
    this.initBoard();
    this.play()
  }

  initBoard() {
    const res = this.canvas.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
        throw new Error('Failed to get 2D initBoard context');
    }
    this.ctx = res;
    // this.ctx = this.canvas.nativeElement.getContext('2d');

    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Scale so we don't need to give size on every draw.
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    this.sharedService.updateCtx(this.ctx)
  }

  play() {
    this.resetGame();
  }

  submit(piece: Piece, ctx: CanvasRenderingContext2D){
    this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    this.ctx = ctx;
    this.piece = new Piece(ctx, piece, false)
    if(this.gameService.valid(this.piece, this.board)) {
      this.draw(this.piece)
      this.sharedService.setRefresh(true);
      this.sharedService.updateTetris(this.piece)
      this.sharedService.updateCtx(this.ctx)
    }
    
  }

  submitPieces(piece: Piece, ctx: CanvasRenderingContext2D){
    // this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    this.ctx = ctx;
    this.piece = piece
    let counter = 0
    while (this.gameService.valid(this.piece, this.board) == false) {
      const p = this.sharedService.rotateShape(this.piece)
      this.piece.move(p);
      if(counter++ == 1000) break;
    }
    if(this.gameService.valid(this.piece, this.board)) {
      this.draw(this.piece)
      this.sharedService.updateTetris(this.piece)
      this.sharedService.updateCtx(this.ctx)
    }
  }

  draw(piece: Piece) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    piece.draw();
    this.drawBoard();
    this.sharedService.setBoard(this.board);
  }

  control(p: IPiece){
    this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.sharedService.currentCtx.subscribe(board => this.ctx = board);
    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    if (this.gameService.valid(p, this.board)) {
      this.piece.move(p);
      this.draw(this.piece)
    }
    this.sharedService.updateTetris(this.piece)
    this.sharedService.updateCtx(this.ctx)
  }

  drop(piece: Piece) {
    let p = this.gameService.moveDown(piece)
    if (this.gameService.valid(p, this.board)) {
      piece.move(p);
    } else {
      // this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      piece = this.next;
      this.next = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
  }

  resetGame() {
    this.board = this.getEmptyBoard();
    this.addOutlines();
    this.sharedService.setBoard(this.board);
  }


  clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      if (row.every(value => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(COLS).fill(0));
      }
    });
    this.sharedService.setBoard(this.board);
  }

  private add3D(x: number, y: number, color: number): void {
    //Darker Color
    this.ctx.fillStyle = COLORSDARKER[color];
    // Vertical
    this.ctx.fillRect(x + .9, y, .1, 1);
    // Horizontal
    this.ctx.fillRect(x, y + .9, 1, .1);

    //Darker Color - Inner
    // Vertical
    this.ctx.fillRect(x + .65, y + .3, .05, .3);
    // Horizontal
    this.ctx.fillRect(x + .3, y + .6, .4, .05);

    // Lighter Color - Outer
    this.ctx.fillStyle = COLORSLIGHTER[color];

    // Lighter Color - Inner
    // Vertical
    this.ctx.fillRect(x + .3, y + .3, .05, .3);
    // Horizontal
    this.ctx.fillRect(x + .3, y + .3, .4, .05);

    // Lighter Color - Outer
    // Vertical
    this.ctx.fillRect(x, y, .05, 1);
    this.ctx.fillRect(x, y, .1, .95);
    // Horizontal
    this.ctx.fillRect(x, y, 1 , .05);
    this.ctx.fillRect(x, y, .95, .1);
  }

  private addOutlines() {
    for(let index = 1; index < COLS; index++) {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(index, 0, .025, this.ctx.canvas.height);
    }

    for(let index = 1; index < ROWS; index++) {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, index, this.ctx.canvas.width, .025);
    }
  }

  drawBoard() {
    if(!this.board) this.sharedService.getBoard().subscribe((board) => this.board = board);
    if(!this.ctx) this.sharedService.currentCtx.subscribe(canvas => this.ctx = canvas);
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
          this.add3D(x, y, value);
        }
      });
    });
    this.addOutlines();
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  public ngAfterViewInit(): void {
    this.htmlService.set('board', this.canvas.nativeElement );
  }

  // Don't forget the include clean-up code within the ngOnDestroy() event.
  public ngOnDestroy() {
	  this.htmlService.delete('board');
  }

}
