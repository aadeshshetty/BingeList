import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService) {}
  enteredSearch: string = '';
  @Output() searchText: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {}
  onSearchChange() {
    this.searchText.emit(this.enteredSearch);
  }
  logout() {
    this.auth.logout();
  }
}
