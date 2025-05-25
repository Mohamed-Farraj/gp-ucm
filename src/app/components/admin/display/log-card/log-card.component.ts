import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-log-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './log-card.component.html',
  styleUrl: './log-card.component.scss'
})
export class LogCardComponent {
  actionLog: any;
  constructor() {
    const data = inject(MAT_DIALOG_DATA) as { logData: any };
    // Now you can access the passed item using this.data.logData
    console.log('Received data:', data.logData);
    this.actionLog = data.logData;
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  getBgColor(actionType: string): string {
    switch (actionType) {
      case 'DELETE':
        return 'bg-red-50';
      case 'ADD':
        return 'bg-green-50';
      case 'UPDATE':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  }

  getBorderColor(actionType: string): string {
    switch (actionType) {
      case 'DELETE':
        return 'border-red-300';
      case 'ADD':
        return 'border-green-300';
      case 'UPDATE':
        return 'border-blue-300';
      default:
        return 'border-gray-300';
    }
  }

  getTextColor(actionType: string): string {
    switch (actionType) {
      case 'DELETE':
        return 'text-red-700';
      case 'ADD':
        return 'text-green-700';
      case 'UPDATE':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  }

  getActionIcon(actionType: string): string {
    switch (actionType) {
      case 'DELETE':
        return 'fas fa-trash-alt';
      case 'CREATE':
        return 'fas fa-plus-circle';
      case 'UPDATE':
        return 'fas fa-edit';
      default:
        return 'fas fa-info-circle';
    }
  }

  getEmail(response:string): string {
  const parts = response.split(',ip');
  return parts[0]?.trim() || '';
}

getIp(response:string): string {
  const parts = response.split(',ip');
  return parts[1]?.trim() || '';
}


}
