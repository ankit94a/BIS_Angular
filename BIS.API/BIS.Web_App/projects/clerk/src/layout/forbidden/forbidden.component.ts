import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'] // ✅ Fixed styleUrls
})
export class ForbiddenComponent {

  constructor(private location: Location) {
  }

  goBack() {
    this.location.back();
  }
}
