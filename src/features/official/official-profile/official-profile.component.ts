import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Activity, CircleCheck, Key, Lock, LucideAngularModule, Shield, User } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-official-profile',
  standalone: true,
  imports: [DatePipe, LucideAngularModule],
  templateUrl: './official-profile.component.html'
})
export class OfficialProfileComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;

  readonly icons = {
    Shield,
    User,
    Key,
    Lock,
    Activity,
    CircleCheck
  };
}