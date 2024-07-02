import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { MainService } from './main.service';

const ALLOWED_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent  implements OnDestroy {
  constructor(private mainService: MainService) { }
  disable() {
    this.mainService.disableInput();
    this.mainService.updateCurrentInput([])
  }

  ngOnDestroy() {
    this.mainService.saveState();
  }
}
