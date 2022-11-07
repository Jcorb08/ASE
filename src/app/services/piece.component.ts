import { COLORS, SHAPES, COLORSLIGHTER, COLORSDARKER, ROWS, COLS } from './constants';

export interface IPiece {
  x: number;
  y: number;
  color: string;
  shape: number[][];
}

export class Piece implements IPiece {
  x: number;
  y: number;
  color: string;
  colorLighter: string;
  colorDarker: string;
  shape: number[][];

  constructor(private ctx: CanvasRenderingContext2D,
    private _piece: any = {},
    private _spawn: boolean = true,
    private _mode: string = 'random') {
    if (_spawn) {
      this.spawn();
    }
    else{
      this.shape = _piece.shape;
      this.color = _piece.color;
      this.colorLighter = _piece.colorLighter;
      this.colorDarker = _piece.colorDarker;
      this.x = _piece.x;
      this.y = _piece.y;
    }
  }

  spawn() {
    let typeId;
    if(this._mode == 'random'){
      typeId = this.randomizeTetrominoType(COLORS.length - 1);
    }
    else{
      typeId = this.nextTetrominoType(this._mode, SHAPES.indexOf(this._piece.shape), COLORS.length - 1)
    }
    this.shape = SHAPES[typeId];
    this.color = COLORS[typeId];
    this.colorLighter = COLORSLIGHTER[typeId];
    this.colorDarker = COLORSDARKER[typeId];
    this.x = COLS - this.shape.length - 1//typeId === 4 ? 4 : 3;
    this.y = ROWS - this.shape[0].length - 1;
  }

  private add3D(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    //Darker Color
    ctx.fillStyle = this.colorDarker;
    // Vertical
    ctx.fillRect(x + .9, y, .1, 1);
    // Horizontal
    ctx.fillRect(x, y + .9, 1, .1);

    //Darker Color - Inner
    // Vertical
    ctx.fillRect(x + .65, y + .3, .05, .3);
    // Horizontal
    ctx.fillRect(x + .3, y + .6, .4, .05);

    // Lighter Color - Outer
    ctx.fillStyle = this.colorLighter;

    // Lighter Color - Inner
    // Vertical
    ctx.fillRect(x + .3, y + .3, .05, .3);
    // Horizontal
    ctx.fillRect(x + .3, y + .3, .4, .05);

    // Lighter Color - Outer
    // Vertical
    ctx.fillRect(x, y, .05, 1);
    ctx.fillRect(x, y, .1, .95);
    // Horizontal
    ctx.fillRect(x, y, 1 , .05);
    ctx.fillRect(x, y, .95, .1);
  }

  private addNextShadow(ctx: CanvasRenderingContext2D, x: number, y: number): void {
   ctx.fillStyle = 'black';
    ctx.fillRect(x, y, 1.025, 1.025);
  }

  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = this.color;
          const currentX = this.x + x;
          const currentY = this.y + y;
          this.ctx.fillRect(currentX, currentY, 1, 1);
          this.add3D(this.ctx, currentX, currentY);
        }
      });
    });
  }

  drawNext(ctxNext: CanvasRenderingContext2D) {
    ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height);
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.addNextShadow(ctxNext, x, y);
        }
      });
    });

    ctxNext.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          ctxNext.fillStyle = this.color;
          const currentX = x + .025;
          const currentY = y + .025;
          ctxNext.fillRect(currentX, currentY, 1-.025, 1 -.025);
          this.add3D(ctxNext, currentX, currentY);
        }
      });
    });
  }

  move(p: IPiece) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  randomizeTetrominoType(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes + 1);
  }

  nextTetrominoType(mode: string, currentType: number, noOfTypes: number): number {
    if(mode == '+') currentType++;
    if(mode == '-') currentType--;
    if(currentType < 1 || currentType > noOfTypes) return this.randomizeTetrominoType(noOfTypes)
    return currentType
  }
}
