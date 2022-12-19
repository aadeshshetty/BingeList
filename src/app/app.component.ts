import { Component, ViewChild } from '@angular/core';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Binge-List';
  // @ViewChild(HomeComponent) childComponent!: HomeComponent;

  ngAfterViewInit() {
    // child is set
    // this.childComponent.onSearchText(this.s);
    // console.log(this.childComponent);
    // this.childComponent!.searchText = this.s;
    // console.log(this.childComponent.searchText);
  }
}
