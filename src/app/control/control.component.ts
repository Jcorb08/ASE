import { Component, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { DIR } from '../services/constants';
import { GameService } from '../services/game.service';
import { HtmlElementService } from '../services/htmlElement.service';
import { IPiece, Piece } from '../services/piece.component';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
  viewProviders: [ BoardComponent ]
})
export class ControlComponent implements OnInit {

  moves = {
    [DIR.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    [DIR.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    [DIR.DOWN]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [DIR.UP]: (p: IPiece): IPiece => ({ ...p, y: p.y - 1 })
  };

  currentTetris: Piece;
  currentCtx: CanvasRenderingContext2D;

  constructor(private gameService: GameService,
    private htmlService: HtmlElementService,
    private sharedService: SharedService,
    private boardCompo: BoardComponent) {}


  ngOnInit(): void {
  }

  controlShape(dirCode: number) {
    this.sharedService.currentTetris.subscribe(piece => this.currentTetris = piece);
    this.sharedService.currentCtx.subscribe(board => this.currentCtx = board);

    const p = (this.moves as unknown as Array<any>)[dirCode](this.currentTetris);
    this.boardCompo.control(p)
  }


}
