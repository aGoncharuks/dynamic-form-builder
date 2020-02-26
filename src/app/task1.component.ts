import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgModel, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, scan, share, startWith, switchMap, tap } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from './tokens';

@Component({
  templateUrl: './task1.component.html',
	styleUrls: ['./task1.component.scss']
})
export class Task1Component implements OnInit {
	@ViewChild('userInput', {read: NgModel}) private userInput: NgModel;
  content: string;
  form$: Observable<FormGroup>;
  formResult$: Observable<string[]>;
  notifyDuplicates$: Subject<boolean> = new Subject<boolean>();
  
	constructor(
		@Inject(APP_CONFIG) private appConfig: IAppConfig,
		private formBuilder: FormBuilder
	) {}
	
	
	ngOnInit(): void {
    this.content =
      `<div #placeholder_first_name></div>

<div #placeholder_last_name></div>`;
    
    this.form$ = this.userInput.valueChanges.pipe(
      map(input => this.inputToFields(input)),
	    tap(fields => this.checkFieldsForDuplicates(fields)),
	    map(fields => this.fieldsToFormGroup(fields)),
	    scan((prev, curr) => this.transitFormState(prev, curr)),
	    share()
    );
	  
    this.formResult$ = this.form$.pipe(
    	switchMap(form => form.valueChanges.pipe(startWith(form.value))),
    	map(value => Object.entries(value)),
    	map(fields => fields.map(field => this.fieldToResultForm(field)))
    )
  }
  
  private checkFieldsForDuplicates(fields: string[]): void {
		this.notifyDuplicates$.next(new Set(fields).size !== fields.length)
  }
  
  private inputToFields(input: string): string[] {
		return input && input.match(this.appConfig.fieldPattern) || [];
  }
  
  private fieldsToFormGroup(fields: string[]): FormGroup {
		return this.formBuilder.group(
      fields.reduce((acc, field) => ({...acc, [field]: this.formBuilder.control('')}), {})
    )
  }
  
  private fieldToResultForm([key, value]): string {
		return `<div #placeholder_${key}><ng-container>${value}</ng-container></div>`
  }
  
  private transitFormState(prev: FormGroup, curr: FormGroup): FormGroup {
		return Object.entries(prev.value).reduce((acc, [key, value]) => {
      if (!acc.controls[key]) { return acc; }
      acc.controls[key].setValue(value);
      return acc;
    }, curr);
  }
  
  getFormControlsKeys(form: FormGroup): string[] {
		return Object.keys(form.controls);
  }
}
