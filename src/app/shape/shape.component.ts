import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoardComponent } from '../board/board.component';
import { HtmlElementService } from '../services/htmlElement.service';
import { Piece } from '../services/piece.component';
import { SharedService } from '../services/shared.service';
import { BLOCK_SIZE } from './../services/constants';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css']
})
export class ShapeComponent implements OnInit {

  @ViewChild('next', { static: true }) canvasNext: ElementRef<HTMLCanvasElement>;
  private boardSubscription: Subscription;
  private boardElement: ElementRef<HTMLCanvasElement>;

  piece: Piece;
  currentPiece: Piece;
  ctxNext: CanvasRenderingContext2D;
  next: Piece;
  requestId: number;
  paused: boolean;
  gameStarted: boolean;
  board: number[][];

  constructor(protected htmlService: HtmlElementService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.getRefresh().subscribe((value: boolean) => {
      if(value) {
        this.initNext();
        this.draw();
      }
    })
    this.initNext();
    this.draw();
  }

  initNext() {
    const res = this.canvasNext.nativeElement.getContext('2d');
    if (!res || !(res instanceof CanvasRenderingContext2D)) {
        throw new Error('Failed to get 2D initNext context');
    }
    this.ctxNext = res;

    // Calculate size of canvas25 from constants.
    // The + 2 is to allow for space to add the drop shadow to
    // the "next piece"
    this.ctxNext.canvas.width = 4 * BLOCK_SIZE + 2;
    this.ctxNext.canvas.height = 4 * BLOCK_SIZE;

    this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
    this.sharedService.updateCtxNext(this.ctxNext)
  }

  draw() {
    this.piece = this.next;
    this.next = new Piece(this.ctxNext);
    this.next.drawNext(this.ctxNext);
    this.sharedService.updateShape(this.next)
  }

  public ngAfterViewInit(): void {
    this.htmlService.set('next', this.canvasNext.nativeElement );
  }

  // Don't forget the include clean-up code within the ngOnDestroy() event.
  public ngOnDestroy() {
	  this.htmlService.delete('next');
  }

}
