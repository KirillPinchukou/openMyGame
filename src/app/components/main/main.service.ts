import {Injectable, input} from '@angular/core';
import {BehaviorSubject, first} from 'rxjs';
import { wordBank } from "../../wordBank";
import {  map } from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
import {CongratulationPopupComponent} from "../congratulation-popup/congratulation-popup.component";


interface KeyState {
  currentLevel:  number;
  usedLetters: Map<string, number>;
  currentInput: string[];
  enableEnter: boolean;
  activeVocabulary: {
    value: string;
    isActive: boolean }[];
}

const initialState = {
  currentLevel: 0,
  usedLetters: new Map(),
  currentInput: [],
  activeVocabulary: [],
  enableEnter: false,
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private readonly _state$ = new BehaviorSubject<Readonly<KeyState>>(initialState);

   get state() {
    return this._state$.getValue();
  }

  readonly currentLevel$ = this._state$.pipe(
    map(state => state.currentLevel)
  )

  readonly activeVocabulary$ = this._state$.pipe(
    map(state => state.activeVocabulary)
  )

  readonly currentLetters$ = this._state$.pipe(
    map(state => state.usedLetters)
  )
  readonly currentInput$ = this._state$.pipe(
    map(state => state.currentInput)
  )

  readonly enableEnter$ = this._state$.pipe(
    map(state => state.enableEnter)
  )

  constructor(public dialog: MatDialog) {
    this.loadConfig();
  }

  /**
   * on game load, check if we have something in local storage to track our user's game history
   */
  private loadConfig() {
    let wordData = JSON.parse(localStorage.getItem("wordData") as string);
    if(!wordData) {
      localStorage.setItem("wordData", JSON.stringify(initialState));
      this.generateGame(initialState);
      return;
    }
    this.generateGame(wordData)
  }

  /**
   * generate game, update state with user's last game history (whether it was finished or unfinished)
   */
  private generateGame(wordData: KeyState) {
    this._state$.next({
      ...this.state,
      activeVocabulary: wordData.activeVocabulary.length ? wordData.activeVocabulary : this.getProgress(this.defineLevel()),
      currentLevel: wordData.currentLevel,
      usedLetters: this.getUsedLetters(),
    });
  }

    getUsedLetters(): Map<string, number> {
    const checkLevel: number = this.defineLevel();
    const levelData = wordBank[checkLevel];
    let result = new Map();
    for(let word of levelData) {
      for(let [key, value] of this.countChars(word)) {
        if(result.has(key) ) {
          const newValue = result.get(key) < value ? value : result.get(key)
          result.set(key,newValue);
        } else { result.set(key, value)}
      }
    }
    return result;
  }

   countChars(str: string): Map<string, number>  {
     let result = new Map();
     for (let i = 0; i < str.length; i++) {
      result.has(str[i]) ? result.set(str[i], result.get(str[i]) + 1): result.set(str[i], 1)
     }
     return result;
  }
  checkWord() {
    let newVocabulary: Array<{ value: string, isActive: boolean} > = []
    this.activeVocabulary$.pipe(first()).subscribe(vocabulary => {
      this.currentInput$.pipe(first()).subscribe(input => {
       newVocabulary = vocabulary.map((item) => {
          if(item.value === input.join('')) {
            item.isActive = true;
          }
          return item;
        });
      })
    });
    const levelNotPassed = newVocabulary.some(item => !item.isActive);
    this.updateActiveVocabulary(newVocabulary);
    this.saveState()
    if (!levelNotPassed) {
      let dialogRef = this.dialog.open(CongratulationPopupComponent,{
        width: '500px',
        height: '400px',
        enterAnimationDuration: 2000,
        data: {level: this._state$.getValue().currentLevel }
      });
      dialogRef.afterClosed().subscribe(res => this.setNewLevel())
    }
  }

  setNewLevel() {
    this.currentLevel$.pipe(first()).subscribe(level => {
      this._state$.next({
        ...initialState,
        currentLevel: level + 1,
      });
    })
    this.saveState()
    this.generateGame(this._state$.getValue())
    location.reload();
  }

  defineLevel() {
    let wordData: KeyState = JSON.parse(localStorage.getItem("wordData") as string);
     return wordData.currentLevel > 2 ? wordData.currentLevel % 3 : wordData.currentLevel;
  }

  getProgress(currentLevel: number): Array<{ value: string, isActive: boolean}> {
   return  wordBank[currentLevel].sort((a,b) => a.length - b.length).map((item) => {
      return   {value: item, isActive: false};
    });
  }

   updateCurrentInput(currentInput: string[]) {
    this._state$.next({
      ...this.state,
      currentInput: currentInput,
    });
  }

  updateActiveVocabulary(vocabulary: Array<{ value: string, isActive: boolean}>) {
    this._state$.next({
      ...this.state,
      activeVocabulary: vocabulary,
    });
  }

  disableInput() {
    this.checkWord();
    this._state$.next({
      ...this.state,
      enableEnter: false,
      currentInput: [],
    });
  }

  saveState() {
    localStorage.setItem("wordData", JSON.stringify(this._state$.getValue()));
  }

  enableInput() {
    this._state$.next({
      ...this.state,
      enableEnter: true,
    });
  }

}
