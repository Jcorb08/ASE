
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
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
  // @ViewChild('board25', { static: true }) canvas25: ElementRef<HTMLCanvasElement>;
  private canvas25: ElementRef<HTMLCanvasElement>;;
  @ViewChild('board25') set content(content: ElementRef) {
     if(content) { // initially setter gets called with undefined
         this.canvas25 = content;
     }
  }
  @ViewChild('board16', { static: true }) canvas16: ElementRef<HTMLCanvasElement>;
  @ViewChild('board9', { static: true }) canvas9: ElementRef<HTMLCanvasElement>;
  @ViewChild('board4', { static: true }) canvas4: ElementRef<HTMLCanvasElement>;
  @ViewChild('board1', { static: true }) canvas1: ElementRef<HTMLCanvasElement>;

  allPlanes: ElementRef<HTMLCanvasElement>[]
  allCtx: CanvasRenderingContext2D[] = []
  ctxNext: CanvasRenderingContext2D;
  boards: (number[][])[] = []
  board: number[][];
  STEPS: number[];
  gridShape: number
  _piece: Piece;
  piece: Piece;
  next: Piece;
  gameOutcome = {solved: false, solution: false};

  constructor(private gameService: GameService,
    private htmlService: HtmlElementService,
    private sharedService: SharedService) {
    }

  ngOnInit() {
    this.sharedService.getReset().subscribe((value: boolean) => {
      if(value) {
        this.initialiseSteps()
        this.initBoards()
        this.play()
      }
    })
    this.initialiseSteps();
  }

  initialiseSteps(){
    this.sharedService.getShape().subscribe((num) => {
      this.gridShape = num
      this.STEPS = Array.from({length:num}, (v, i) => i+1);
    })
  }

  initBoards(){
    this.sharedService.setGameSolved(false, false);
    this.STEPS.forEach((item, index) => {
      this.initBoard(item, index, this.allPlanes[index])
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
    // this.sharedService.updateCtx(this.allCtx[STEPS.length])
  }

  play() {
    this.resetGame();
  }

  submit(piece: Piece, ctx: CanvasRenderingContext2D){
    this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    this.allCtx[this.STEPS.length] = ctx;
    this.piece = new Piece(ctx, piece, false)
    if(this.gameService.valid(this.piece, this.board)) {
      this.draw(this.piece)
      this.sharedService.setRefresh(true);
      this.sharedService.updateTetris(this.piece)
      this.sharedService.updateCtx(this.allCtx[this.STEPS.length])
    }

  }

  submitPieces(piece: Piece, ctx: CanvasRenderingContext2D){
    // this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.allCtx[this.STEPS.length] = ctx;
    this.piece = piece
    let counter = 0

    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    while (this.gameService.valid(this.piece, this.board) == false) {
      const p = this.sharedService.rotateShape(this.piece)
      this.piece.move(p);
      if(counter++ == 1000) break;
    }
    if(this.gameService.valid(this.piece, this.board)) {
      this.draw(this.piece)
      this.sharedService.updateTetris(this.piece)
      this.sharedService.updateCtx(this.allCtx[this.STEPS.length])
    }
  }

  draw(piece: Piece) {
    this.allCtx[this.STEPS.length].clearRect(0, 0, this.allCtx[this.STEPS.length].canvas.width, this.allCtx[this.STEPS.length].canvas.height);
    piece.draw();
    this.drawBoard();
    this.sharedService.setBoard(this.board);
  }

  control(p: IPiece){
    this.sharedService.currentTetris.subscribe(piece => this.piece = piece);
    this.sharedService.currentCtx.subscribe(board => this.allCtx[this.STEPS.length] = board);
    this.sharedService.getBoard().subscribe(bd => this.board = bd);
    if (this.gameService.valid(p, this.board)) {
      this.piece.move(p);
      this.draw(this.piece)
    }
    this.sharedService.updateTetris(this.piece)
    this.sharedService.updateCtx(this.allCtx[this.STEPS.length])
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
      this.next = new Piece(this.allCtx[this.STEPS.length]);
      this.next.drawNext(this.ctxNext);
    }
  }

  resetGame() {
    // this.board = this.gameService.getEmptyNBoard();
    // this.addOutlines();
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
    this.allCtx[this.STEPS.length].fillStyle = COLORSDARKER[color];
    // Vertical
    this.allCtx[this.STEPS.length].fillRect(x + .9, y, .1, 1);
    // Horizontal
    this.allCtx[this.STEPS.length].fillRect(x, y + .9, 1, .1);

    //Darker Color - Inner
    // Vertical
    this.allCtx[this.STEPS.length].fillRect(x + .65, y + .3, .05, .3);
    // Horizontal
    this.allCtx[this.STEPS.length].fillRect(x + .3, y + .6, .4, .05);

    // Lighter Color - Outer
    this.allCtx[this.STEPS.length].fillStyle = COLORSLIGHTER[color];

    // Lighter Color - Inner
    // Vertical
    this.allCtx[this.STEPS.length].fillRect(x + .3, y + .3, .05, .3);
    // Horizontal
    this.allCtx[this.STEPS.length].fillRect(x + .3, y + .3, .4, .05);

    // Lighter Color - Outer
    // Vertical
    this.allCtx[this.STEPS.length].fillRect(x, y, .05, 1);
    this.allCtx[this.STEPS.length].fillRect(x, y, .1, .95);
    // Horizontal
    this.allCtx[this.STEPS.length].fillRect(x, y, 1 , .05);
    this.allCtx[this.STEPS.length].fillRect(x, y, .95, .1);
  }

  private addOutlines(ctx: CanvasRenderingContext2D, size: number) {
    for(let index = 1; index < size; index++) {
      ctx.fillStyle = 'black';
      ctx.fillRect(index, 0, .025, ctx.canvas.height);
    }

    for(let index = 1; index < size; index++) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, index, ctx.canvas.width, .025);
    }
  }

  drawBoard() {
    if(!this.board) this.sharedService.getBoard().subscribe((board) => this.board = board);
    if(!this.allCtx[this.STEPS.length]) this.sharedService.currentCtx.subscribe(canvas25 => this.allCtx[this.STEPS.length] = canvas25);
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.allCtx[this.STEPS.length].fillStyle = COLORS[value];
          this.allCtx[this.STEPS.length].fillRect(x, y, 1, 1);
          this.add3D(x, y, value);
        }
      });
    });
    // this.addOutlines();
  }

  public ngAfterViewInit(): void {
    this.allPlanes =  [this.canvas1, this.canvas4, this.canvas9, this.canvas16, this.canvas25]
    if (this.gridShape == 4) this.allPlanes.pop()
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
