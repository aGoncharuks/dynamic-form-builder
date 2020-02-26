import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CONFIG } from './config';
import { Task1Component } from './task1.component';
import { Task2Component } from './task2.component';
import { APP_CONFIG } from './tokens';

@NgModule({
  declarations: [
    AppComponent,
    Task1Component,
    Task2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
	  {
	  	provide: APP_CONFIG,
		  useValue: CONFIG
	  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
