import {Component, OnDestroy, OnInit} from "@angular/core";
import {MainService} from "../main/main.service";
import {first} from "rxjs";

@Component({
  selector: 'grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss']
})
export class GridComponent implements OnInit{
  vocabulary: Array<{ value: string[], isActive: boolean}> = [];
  currentLevel: number = 1;
  constructor(private mainService: MainService) {
  }
  ngOnInit() {
    this.mainService.activeVocabulary$.subscribe((res) => {
     this.vocabulary = res.map((item) => {
        return { value: item.value.split(''), isActive: item.isActive}
      })
    })
    this.getCurrentLevel();
  }

  getCurrentLevel() {
    const level = this.mainService.currentLevel$.subscribe(level => {
      this.currentLevel = level;
    })
  }
}
