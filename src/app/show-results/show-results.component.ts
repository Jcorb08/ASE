import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import {
  BLOCK_SIZE,
  COLORS,
  COLORSLIGHTER,
  COLORSDARKER
} from './../services/constants';

@Component({
  selector: 'app-show-results',
  templateUrl: './show-results.component.html',
  styleUrls: ['./show-results.component.css']
})
export class ShowResultsComponent implements OnInit, OnDestroy {

  gameOutcome = {solved: false, solution: false};
  gameResult: number[][][] = []

  constructor(private el:ElementRef, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.getReset().subscribe((value: boolean) => {
      this.sharedService.getSolutions().subscribe(solutions => this.gameResult = solutions);
      
      if(value && this.gameResult.length > 0) {
        setTimeout(() => {
          this.drawResult()
        }, 10000);
      }
    })
  }

  
  private drawResult() {
    this.gameResult.forEach((result, index) => {
      this.drawOnCanvas(index, this.flattenArray(result));
    });
  }

  private flattenArray(result: number[][]){
    let flattened : number[] = [];
    const chunks = (xs, ss, i = 0, j = 0) =>   i < xs.length ? [xs.slice(i, i + ss[j]), ...chunks(xs, ss, i + ss[j], (j + 1) % ss.length)] : []
    let result5 = chunks(result[0], [5, 5, 5, 5, 5])
    let result4 = chunks(result[1], [4, 4, 4, 4])
    let result3 = chunks(result[2], [3, 3, 3])
    let result2 = chunks(result[3], [2, 2])
    let result1 = chunks(result[4], [1])
    
    flattened = [...result5[0], ...result5[1], ...result4[0], ...result5[2], ...result4[1], ...result3[0], ...result5[3], ...result4[2], ...result3[1], ...result2[0], ...result5[4], ...result4[3], ...result3[2], ...result2[1], ...result1[0]];
    return flattened;
  }

  private drawOnCanvas(canvasId: number, board: number[]) {
    let x = 0, z = 0
    const canvas = <HTMLCanvasElement>this.el.nativeElement.querySelector('#canvas-' + canvasId)
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx!.canvas.width = 15 * BLOCK_SIZE;
    ctx!.canvas.height = 5 * BLOCK_SIZE;
    ctx!.scale(BLOCK_SIZE, BLOCK_SIZE);
    
    for(let y = 0; y < board.length; y++, z++){
      let colorCode = board[y]
      
      if (board[y] > 0) {
        ctx!.fillStyle = COLORS[colorCode];
        ctx!.fillRect(z, x, 1, 1);
        ctx!.fillStyle = COLORSDARKER[colorCode];
        ctx!.fillRect(z + .9, x, .1, 1);
        ctx!.fillRect(z, x + .9, 1, .1);
        ctx!.fillRect(z + .65, x + .3, .05, .3);
        ctx!.fillRect(z + .3, x + .6, .4, .05);
        ctx!.fillStyle = COLORSLIGHTER[colorCode];
        ctx!.fillRect(z + .3, x + .3, .05, .3);
        ctx!.fillRect(z + .3, x + .3, .4, .05);
        ctx!.fillRect(z, x, .05, 1);
        ctx!.fillRect(z, x, .1, .95);
        ctx!.fillRect(z, x, 1 , .05);
        ctx!.fillRect(z, x, .95, .1);
      }
      if(x == 0 && z == 4 || x == 1 && z == 8 || x == 2 && z == 11 || x == 3 && z == 13) {
        x++;
        z = -1;
      }
    }
  }

  ngOnDestroy(){
    this.sharedService.setSolutions([]);
  }

}
