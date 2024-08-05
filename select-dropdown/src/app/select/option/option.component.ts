import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import { SelectType } from '../select.component';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent<T> {
  @Input()
  value: SelectType<T> = null;

  @Input({ transform: booleanAttribute })
  @HostBinding('class.disabled')
  disabled = false;

  @Output()
  selected = new EventEmitter<OptionComponent<T>>();

  @HostListener('click')
  protected select() {
    if (!this.disabled) {
      this.highlightAsSelected();
      this.selected.emit(this);
    }
  }

  @HostBinding('class.selected')
  get isSelected() {
    return this.isSelectedSignal();
  }

  protected isSelectedSignal = signal(false);

  constructor() {}

  deselect() {
    this.isSelectedSignal.set(false);
  }

  highlightAsSelected() {
    this.isSelectedSignal.set(true);
  }
}
