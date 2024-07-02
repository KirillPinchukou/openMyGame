import { Component, OnInit, Input } from '@angular/core';
import { MainService } from '../main/main.service';
import {first} from "rxjs";

@Component({
  selector: 'letter-circle',
  templateUrl: './letter-circle.component.html',
  styleUrls: ['./letter-circle.component.scss']
})
export class LetterCircleComponent implements OnInit {
  currentLetters: Array<{key: string, isActive: boolean, id: number}> = [];
  selectedLetters: string[] = [];
  enableEnter = false;

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.mainService.enableEnter$.subscribe((res) => { this.enableEnter = res})
    this.mainService.currentLetters$.pipe(first()).pipe(first()).subscribe(res => {
      const lettersArr = Array.from(res, ([key, value]) => ({ key, value }));
      this.currentLetters = this.configCircle(lettersArr);
    })
  }

  configCircle(lettersArray: Array<{ key: string, value: number}>) {
    let result = [];
    for (let i = 0; i <lettersArray.length; i++) {
      for( let j = 0; j < lettersArray[i].value;  j++) {
        result.push({key: lettersArray[i].key, isActive: false, id: i});
      }
    }
    return result;
  }

  enableEntering() {
    this.mainService.enableInput();
  }
  disableEnter(event: Event) {
    this.selectedLetters = [];
    this.currentLetters = this.currentLetters.map((item, index) => {
      return { key: item.key, isActive: false, id:index }
    })
    this.mainService.disableInput();
    this.mainService.updateCurrentInput(this.selectedLetters)
  }

  detectClass() {
    return `circle-${this.currentLetters.length}`;
  }

  detectLetterClass(isActive: boolean) {
    return isActive && this.enableEnter;
  }


  selectLetter(letter: {key: string, isActive: boolean, id: number }, event?: Event) {
    if((this.enableEnter || event?.type === 'mousedown') && !letter.isActive ) {
      this.selectedLetters.push(letter.key);
      this.mainService.updateCurrentInput(this.selectedLetters);
      const pos = this.currentLetters.map((item) => item.id).indexOf(letter.id)
      this.currentLetters[pos] = {key: letter.key, isActive: true, id: letter.id}
    }
  }
}
