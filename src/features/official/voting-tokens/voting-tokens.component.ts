import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeCheck, Ban, CircleAlert, LucideAngularModule, Search, ShieldCheck } from 'lucide-angular';
import { mockVotingCitizens, type VotingCitizen } from './voting-tokens.mock';

@Component({
  selector: 'app-official-voting-tokens',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './voting-tokens.component.html'
})
export class VotingTokensComponent {
  readonly icons = { Search, ShieldCheck, BadgeCheck, Ban, CircleAlert };
  readonly citizens = mockVotingCitizens;

  searchTerm = '';
  selectedCitizen: VotingCitizen = this.citizens[0];
  confirmationMessage = 'Brak akcji. Wybierz obywatela i zareaguj na status uprawnienia.';

  get filteredCitizens(): VotingCitizen[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.citizens;
    }

    return this.citizens.filter((citizen) =>
      citizen.fullName.toLowerCase().includes(term) ||
      citizen.id.toLowerCase().includes(term) ||
      citizen.residence.toLowerCase().includes(term)
    );
  }

  selectCitizen(citizen: VotingCitizen): void {
    this.selectedCitizen = citizen;
    this.confirmationMessage = `Wybrano obywatela ${citizen.fullName}. Stan uprawnienia: ${citizen.permissionStatus}.`;
  }

  issuePermission(): void {
    this.selectedCitizen = {
      ...this.selectedCitizen,
      permissionStatus: 'Wydane',
      tokenStatus: 'Aktywny',
      token: `VT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    this.confirmationMessage = `Uprawnienie do głosowania zostało wydane dla ${this.selectedCitizen.fullName}.`;
  }

  revokePermission(): void {
    this.selectedCitizen = {
      ...this.selectedCitizen,
      permissionStatus: 'Unieważnione',
      tokenStatus: 'Unieważniony',
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    this.confirmationMessage = `Uprawnienie do głosowania zostało unieważnione dla ${this.selectedCitizen.fullName}.`;
  }
}
