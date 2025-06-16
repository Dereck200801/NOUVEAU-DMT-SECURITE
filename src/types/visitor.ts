export type VisitorStatus = 'expected' | 'checked_in' | 'checked_out' | 'blacklisted';

export interface Visitor {
  id: number;
  name: string;
  company: string;
  visitDate: string; // YYYY-MM-DD
  checkInTime?: string; // HH:MM
  checkOutTime?: string; // HH:MM
  hostId?: number; // Employee hosting
  purpose?: string;
  badgeNumber?: string;
  status: VisitorStatus;
}

export interface NewVisitor {
  name: string;
  company: string;
  visitDate: string;
  hostId?: number;
  purpose?: string;
  badgeNumber?: string;
} 