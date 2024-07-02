import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { MainService } from '../main/main.service';

@Component({
  selector: 'current-input',
  templateUrl: './current-input.component.html',
  styleUrls: ['./current-input.component.scss']
})
export class CurrentInputComponent implements OnInit {
  data: string[] | null = [];

  constructor(private mainService: MainService) {
  }
  ngOnInit() {
    this.mainService.currentInput$.subscribe(res => {
      this.data = res;
    });
  }
}
