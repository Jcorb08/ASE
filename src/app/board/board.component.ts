
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import {
  BLOCK_SIZE,
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
  @ViewChild('board25', { static: false }) canvas25: ElementRef<HTMLCanvasElement>;
  // private canvas25: ElementRef<HTMLCanvasElement>;;
  // @ViewChild('board25') set content(content: ElementRef) {
  //    if(content) { // initially setter gets called with undefined
  //        this.canvas25 = content;
  //    }
  // }
  @ViewChild('board16', { static: true }) canvas16: ElementRef<HTMLCanvasElement>;
  @ViewChild('board9', { static: true }) canvas9: ElementRef<HTMLCanvasElement>;
  @ViewChild('board4', { static: true }) canvas4: ElementRef<HTMLCanvasElement>;
  @ViewChild('board1', { static: true }) canvas1: ElementRef<HTMLCanvasElement>;
  // @ViewChild('resultCanvas', { static: true }) resultCanvas: ElementRef<HTMLCanvasElement>;

  allPlanes: ElementRef<HTMLCanvasElement>[]
  allCtx: CanvasRenderingContext2D[] = []
  ctx: CanvasRenderingContext2D;
  resultContext: CanvasRenderingContext2D
  ctxNext: CanvasRenderingContext2D;
  boards: (number[][])[] = []
  board: number[][];
  STEPS: number[];
  gridShape: number
  gridPlane: number
  _piece: Piece;
  piece: Piece;
  next: Piece;
  gameOutcome = {solved: false, solution: false};
  gameResult: number[][][] = []

  constructor(private gameService: GameService,
    private htmlService: HtmlElementService,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.sharedService.getReset().subscribe((value: boolean) => {
      this.sharedService.getSolutions().subscribe(solutions => this.gameResult = solutions);
      if(value && this.gameResult.length == 0) {
        this.initialiseSteps()
        this.initBoards()
        this.play()
      } 
      else {
        this.sharedService.getLimit().subscribe((limit) => {
          this.sharedService.setGameSolved(true, this.gameResult.length == limit)
          this.sharedService.getGameSolved().subscribe(stat => this.gameOutcome = stat)
        });
      }
    })
    this.initialiseSteps();
  }

  initialiseSteps(){
    this.sharedService.getShape().subscribe((num) => { this.gridShape = num });
    this.sharedService.getPlane().subscribe((num) => { this.gridPlane = num });
    this.STEPS = Array.from({length:this.gridShape}, (v, i) => i+1);
  }

  initBoards(){
    this.sharedService.setGameSolved(false, false);
    this.STEPS.forEach((item, index) => {
      this.initBoard(item, index, this.allPlanes.slice(0, this.gridShape)[index])
      this.boards[index] = this.gameService.getEmptyNBoard(item);
      this.addOutlines(this.allCtx[index], item);
    });
  }

  initBoard(size: number, index: number, plane: ElementRef<HTMLCanvasElement>) {
    const res = plane.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
        throw new Error('Failed to get 2D initBoard context');
    }
    let ctx: CanvasRenderingContext2D = res;
    ctx.canvas.width = size * BLOCK_SIZE;
    ctx.canvas.height = size * BLOCK_SIZE;
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    this.allCtx[index] = ctx
    this.sharedService.updateCtx(this.allCtx[this.gridShape-1])
  }

  play() {
    this.resetGame();
  }

  submit(piece: Piece, ctx: CanvasRenderingContext2D, plane: number = this.gridPlane){
    this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    this.sharedService.getPlane().subscribe(col => this.gridPlane = col);
    this.ctx = ctx;
    this.piece = new Piece(ctx, piece, false)
    if(this.gameService.valid(this.piece, this.board, this.gridPlane)) {
      this.draw(this.piece)
      this.sharedService.setRefresh(true);
      this.sharedService.updateTetris(this.piece)
      this.sharedService.updateCtx(this.ctx)
    }

  }

  submitPieces(piece: Piece, ctx: CanvasRenderingContext2D){
    // this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.ctx = ctx;
    this.piece = piece
    let counter = 0

    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    while (this.gameService.valid(this.piece, this.board, this.gridPlane) == false) {
      const p = this.sharedService.rotateShape(this.piece)
      this.piece.move(p);
      if(counter++ == 1000) break;
    }
    if(this.gameService.valid(this.piece, this.board, this.gridPlane)) {
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
    this.sharedService.getPlane().subscribe(col => this.gridPlane = col);
    if (this.gameService.valid(p, this.board, this.gridPlane)) {
      this.piece.move(p);
      this.draw(this.piece)
    }
    this.sharedService.updateTetris(this.piece)
    this.sharedService.updateCtx(this.ctx)
  }

  drop(piece: Piece) {
    let p = this.gameService.moveDown(piece)
    if (this.gameService.valid(p, this.board, this.gridPlane)) {
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
    if(this.boards.length == 0) this.initBoards();
    this.boards.forEach((item, index) => {
      return this.gameService.getEmptyNBoard(item.length);
    })
    // this.addOutlines();
    this.sharedService.setBoard(this.boards[this.gridPlane-1]);
    this.sharedService.updateCtx(this.allCtx[this.gridPlane-1]);
  }


  clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      if (row.every(value => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(this.gridShape).fill(0));
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

  private addOutlines(ctx: CanvasRenderingContext2D, size: number) {
    for(let index = 1; index <= size; index++) {
      ctx.fillStyle = 'black';
      ctx.fillRect(index, 0, .025, ctx.canvas.height);
    }

    for(let index = 1; index <= size; index++) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, index, ctx.canvas.width, .025);
    }
  }

  drawBoard() {
    if(!this.board) this.sharedService.getBoard().subscribe((board) => this.board = board);
    if(!this.ctx) this.sharedService.currentCtx.subscribe(canvas => this.ctx = canvas);
    if(!this.gridPlane) this.sharedService.getPlane().subscribe(col => this.gridPlane = col);
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
          this.add3D(x, y, value);
        }
      });
    });

    this.addOutlines(this.ctx, this.gridPlane);
  }

  public ngAfterViewInit(): void {
    this.allPlanes =  [this.canvas1, this.canvas4, this.canvas9, this.canvas16, this.canvas25]
    this.initBoards();
    this.play()
    this.htmlService.set('board', this.canvas25.nativeElement );
    this.sharedService.getGameSolved().subscribe(out => this.gameOutcome = out);

  }

  // Don't forget the include clean-up code within the ngOnDestroy() event.
  public ngOnDestroy() {
	  this.htmlService.delete('board');
  }

}
