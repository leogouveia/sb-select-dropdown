import {
  Component,
  ContentChildren,
  HostListener,
  Input,
  QueryList,
  AfterContentInit,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, takeUntil } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export type SelectType<T> = T | null;

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> implements AfterContentInit, OnDestroy {
  @Input()
  label = 'Pick the User';

  @Input()
  set value(value: SelectType<T>) {
    this.selectionModel.clear();
    if (value) {
      this.selectionModel.select(value);
    }
  }
  get value() {
    return this.selectionModel.selected[0] || null;
  }
  private selectionModel = new SelectionModel<T>();

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<SelectType<T>>();

  @Output()
  readonly cloed = new EventEmitter<void>();

  isOpen = false;

  @HostListener('click')
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  private unsubscribe$ = new Subject<void>();

  ngAfterContentInit() {
    this.highlightSelectedOption(this.value);
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values) => {
        values.removed.forEach((rv) => this.findOptionsByValue(rv)?.deselect());
        values.added.forEach((av) =>
          this.findOptionsByValue(av)?.highlightAsSelected()
        );
      });
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        switchMap((options) => merge(...options.map((o) => o.selected))),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedOption) => {
        this.handleSelection(selectedOption);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private highlightSelectedOption(value: SelectType<T>) {
    this.findOptionsByValue(value)?.highlightAsSelected();
  }

  private findOptionsByValue(value: SelectType<T>) {
    return this.options && this.options.find((o) => o.value === value);
  }

  private handleSelection(option: OptionComponent<T>) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(option.value);
    }
    this.close();
  }
}
