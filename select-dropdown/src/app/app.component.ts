import { Component, HostListener, signal } from '@angular/core';
import { User } from './users';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'select-dropdown';

  testValue: string | null = '';

  selectedValue = 'curie';
  users: User[] = [
    new User(1, 'Albert Einstein', 'einstein', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'bohrs', 'Denmark'),
    new User(3, 'Marie Curie', 'curie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'newton', 'United Kingdom', true),
  ];

  ngOnInit() {
    setTimeout(() => {
      this.selectedValue = 'franklin';
      this.users = [
        new User(1, 'Ada Lovelace', 'lovelace', 'United Kingdom'),
        new User(2, 'Nikola Tesla', 'tesla', 'Serbia/USA'),
        new User(3, 'Rosalind Franklin', 'franklin', 'United Kingdom'),
        new User(4, 'Galileo Galilei', 'galilei', 'Italy', true),
      ];
    }, 3000);
  }
  handleSelectionChanged(value: string | null) {
    this.testValue = value;
  }
}
