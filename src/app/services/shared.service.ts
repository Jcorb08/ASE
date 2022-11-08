import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GameService } from './game.service';
import { IPiece, Piece } from './piece.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private shapePiece = new BehaviorSubject<any>(null);
  currentShape: Observable<any>;

  private tetrisPiece = new BehaviorSubject<any>(null);
  currentTetris: Observable<any>;

  private shapeCtx = new BehaviorSubject<any>(null);
  currentCtx: Observable<any>;

  private shapeCtxNext = new BehaviorSubject<any>(null);
  currentCtxNext: Observable<any>;

  private pieceCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private board: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private gameSolved: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private reset: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private gameService: GameService) {
    this.currentShape = this.shapePiece.asObservable();
    this.currentTetris = this.tetrisPiece.asObservable();
    this.currentCtx = this.shapeCtx.asObservable();
    this.currentCtxNext = this.shapeCtxNext.asObservable();
  }

  public getGameSolved(): Observable<boolean> {
    return this.gameSolved.asObservable();
  }

  public setGameSolved(value: boolean): void {
    this.gameSolved.next(value);
  }

  public getRefresh(): Observable<boolean> {
    return this.refresh.asObservable();
  }

  public setRefresh(value: boolean): void {
    this.refresh.next(value);
  }

  public getReset(): Observable<boolean> {
    return this.reset.asObservable();
  }

  public setReset(value: boolean): void {
    this.reset.next(value);
  }

  public getBoard(): Observable<any> {
    return this.board.asObservable();
  }

  public setBoard(value: any): void {
    this.board.next(value);
  }

  public getPieceCount(): Observable<number> {
    return this.pieceCount.asObservable();
  }

  public setPieceCount(value: number): void {
    this.pieceCount.next(value);
  }

  rotateShape(p: Piece): IPiece {
    return this.gameService.rotate(p);
  }

  flipShape(p: Piece): IPiece {
    return this.gameService.flip(p);
  }

  updateShape(p: Piece){
    this.shapePiece.next(p)
  }

  updateTetris(p: Piece){
    this.tetrisPiece.next(p)
  }

  updateCtx(ctx: CanvasRenderingContext2D){
    this.shapeCtx.next(ctx)
  }

  updateCtxNext(ctx: CanvasRenderingContext2D){
    this.shapeCtxNext.next(ctx)
  }

}
