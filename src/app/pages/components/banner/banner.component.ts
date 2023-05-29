import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  localStorage: Storage = window.localStorage;
  location: Location = window.location;
  username: string = '';

  setUsername(value: string) {
    this.username = value;
  }

  submitUser() {
    this.localStorage.setItem('user', this.username);
    this.location.href = './game';
  }
}
