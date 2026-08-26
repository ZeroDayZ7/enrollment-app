import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarRange, FileText, Filter, LucideAngularModule, Search, ShieldCheck } from 'lucide-angular';
import { mockAuditEvents, type AuditEvent, type AuditEventType, type AuditResult } from './audit.mock';

@Component({
  selector: 'app-official-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './audit.component.html'
})
export class AuditComponent {
  readonly icons = { Filter, Search, CalendarRange, ShieldCheck, FileText };
  readonly events = mockAuditEvents;

  selectedType: 'all' | AuditEventType = 'all';
  selectedResult: 'all' | AuditResult = 'all';
  selectedUser = 'all';
  startDate = '';
  endDate = '';

  readonly eventTypes: Array<'all' | AuditEventType> = [
    'all',
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'CITIZEN_REGISTERED',
    'CITIZEN_VERIFIED',
    'VOTING_PERMISSION_ISSUED',
    'VOTING_PERMISSION_REVOKED'
  ];

  readonly resultTypes: Array<'all' | AuditResult> = ['all', 'SUCCESS', 'FAILED', 'WARNING'];
  readonly users = ['all', 'urzędnik-kowalski', 'urzędnik-jarosz', 'urzędnik-kruk'];

  get filteredEvents(): AuditEvent[] {
    return this.events.filter((event) => {
      const matchesType = this.selectedType === 'all' || event.action === this.selectedType;
      const matchesResult = this.selectedResult === 'all' || event.result === this.selectedResult;
      const matchesUser = this.selectedUser === 'all' || event.user === this.selectedUser;

      const eventDate = new Date(event.timestamp);
      const start = this.startDate ? new Date(`${this.startDate}T00:00:00`) : null;
      const end = this.endDate ? new Date(`${this.endDate}T23:59:59`) : null;

      const matchesStartDate = !start || eventDate >= start;
      const matchesEndDate = !end || eventDate <= end;

      return matchesType && matchesResult && matchesUser && matchesStartDate && matchesEndDate;
    });
  }

  clearFilters(): void {
    this.selectedType = 'all';
    this.selectedResult = 'all';
    this.selectedUser = 'all';
    this.startDate = '';
    this.endDate = '';
  }
}
