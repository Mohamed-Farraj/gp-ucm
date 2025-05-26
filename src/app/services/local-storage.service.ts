import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private universitySubject: BehaviorSubject<string | null>;
  public university$: Observable<string | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize subject with current value
    this.universitySubject = new BehaviorSubject<string | null>(this.get<string>('university'));
    this.university$ = this.universitySubject.asObservable();

    // Listen for storage changes from other tabs/windows
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === 'university') {
          const newValue = event.newValue ? JSON.parse(event.newValue) : null;
          this.universitySubject.next(newValue);
        }
      });
    }
  }

  // ✅ Set value and update subject
  set<T>(key: string, value: T): void {
    if (isPlatformBrowser(this.platformId)) {
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
      
      if (key === 'university') {
        this.universitySubject.next(value as any);
        // Trigger manual storage event for current tab
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: stringified,
          oldValue: localStorage.getItem(key)
        }));
      }
    }
  }

  // ✅ Get current value
  get<T>(key: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    }
    return null;
  }

  // ✅ Remove item and update subject
  remove(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
      if (key === 'university') {
        this.universitySubject.next(null);
      }
    }
  }

  // ✅ Clear all and update subject
  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.universitySubject.next(null);
    }
  }

  // ✅ Check key existence
  has(key: string): boolean {
    return isPlatformBrowser(this.platformId) 
      ? localStorage.getItem(key) !== null 
      : false;
  }
}