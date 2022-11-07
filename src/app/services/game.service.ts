import { Injectable } from '@angular/core';
import { IPiece, Piece } from './piece.component';
import { COLS, ROWS, POINTS } from './constants';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  oPiece: Piece;

  constructor(){}

  valid(p: IPiece, board: number[][]): boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          this.isEmpty(value) ||
          (this.insideWalls(x) &&
            this.aboveFloor(y) &&
            this.notOccupied(board, x, y))
        );
      });
    });
  }

  isEmpty(value: number): boolean {
    return value === 0;
  }

  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  notOccupied(board: number[][], x: number, y: number): boolean {
    return board[y] && board[y][x] === 0;
  }

  rotate(piece: IPiece): IPiece {
    let p: IPiece = JSON.parse(JSON.stringify(piece));
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    p.shape.forEach(row => row.reverse());
    return p;
  }

  flip(piece: IPiece): IPiece {
    let p: IPiece = JSON.parse(JSON.stringify(piece));
    p.shape = this.flipReverse(p.shape)
    return p;
  }

  flipReverse(matrix: any) {
    let newm = matrix
    let n = matrix.length - 1
    for (let x = 0; x < matrix.length/2; x++) {
        [newm[x], newm[n-x]] = [newm[n-x], newm[x]];
    }
    return newm
  }

  moveDown(piece: IPiece): IPiece {
    return ({ ...piece, y: piece.y + 1 })
  }

  getLinesClearedPoints(lines: number, level: number): number {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (level + 1) * lineClearPoints;
  }
}
