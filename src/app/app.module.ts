import { NgModule } from '@angular/core';

// COMPONENTS
import { AppComponent} from "./app.component";
import {MainComponent} from "./components/main/main.component";
import {LetterCircleComponent} from "./components/letterCircle/letter-circle.component";

// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CurrentInputComponent} from "./components/current-input/current-input.component";
import {GridComponent} from "./components/grid/grid.component";
import {CongratulationPopupComponent} from "./components/congratulation-popup/congratulation-popup.component";
import {MatDialogModule} from "@angular/material/dialog";




@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LetterCircleComponent,
    CurrentInputComponent,
    GridComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [CongratulationPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
