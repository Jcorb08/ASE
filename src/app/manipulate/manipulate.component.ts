import { Component, OnInit } from '@angular/core';
import { Piece } from '../services/piece.component';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-manipulate',
  templateUrl: './manipulate.component.html',
  styleUrls: ['./manipulate.component.css']
})
export class ManipulateComponent implements OnInit {

  gridShape: number = 5
  gridPlane: number = 5

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  changePlane(e) {
    this.gridPlane = e.target.value
    this.sharedService.setPlane(this.gridPlane);
    this.sharedService.updateTetris(null as unknown as Piece)
    this.sharedService.setReset(true);
  }

  changeShape(e) {
    this.gridShape = e.target.value
    if (this.gridShape == 4) this.changePlane(e)
    this.sharedService.setShape(this.gridShape);
    this.sharedService.updateTetris(null as unknown as Piece)
    this.sharedService.setReset(true);
  }

  changeMaxLimit(e) {
    this.sharedService.setLimit(e.target.value);
    this.sharedService.setReset(true);
  }

}
