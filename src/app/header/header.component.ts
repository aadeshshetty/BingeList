import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}
  enteredSearch: string = '';
  @Output() searchText: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {}
  onSearchChange() {
    this.searchText.emit(this.enteredSearch);
  }
}
