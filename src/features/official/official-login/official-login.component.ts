import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-official-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, RouterLink],
  templateUrl: './official-login.component.html'
})
export class OfficialLoginComponent { }