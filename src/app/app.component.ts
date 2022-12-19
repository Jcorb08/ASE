import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontend-polysphere-puzzle';  
  toggle: boolean = true;
  @Output() change: EventEmitter<MatButtonToggleChange>

  gameResult: number[][][]

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.getReset().subscribe((value: boolean) => {
      if(value){
        this.sharedService.getSolutions().subscribe(solutions => this.gameResult = solutions);
      }
    })
  }

  toggleView(e) {
    this.sharedService.getSolutions().subscribe(solutions => this.gameResult = solutions);
  }
  
}