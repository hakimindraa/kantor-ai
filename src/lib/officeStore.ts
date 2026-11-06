// lib/officeStore.ts
import { OfficeEvent, OfficeAction } from '@/types/kantorAi';

type Listener = (event: OfficeEvent | null) => void;

class OfficeEventManager {
  private currentEvent: OfficeEvent | null = null;
  private listeners: Set<Listener> = new Set();

  // Pancarkan aksi baru ke karakter 3D
  trigger(eventData: Omit<OfficeEvent, 'timestamp'>) {
    const fullEvent: OfficeEvent = {
      ...eventData,
      timestamp: Date.now(),
    };
    this.currentEvent = fullEvent;
    this.notify();

    // Otomatis kembalikan karakter ke posisi santai (idle) setelah 6 detik
    setTimeout(() => {
      if (this.currentEvent?.timestamp === fullEvent.timestamp) {
        this.currentEvent = null;
        this.notify();
      }
    }, 6000);
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentEvent);
      } catch (err) {
        console.error('Error in officeStore listener:', err);
      }
    });
  }
}

// Global reference to ensure single instance across fast-refresh and module boundaries
const globalWithOffice = globalThis as unknown as { __kantorai_office_store?: OfficeEventManager };
if (!globalWithOffice.__kantorai_office_store) {
  globalWithOffice.__kantorai_office_store = new OfficeEventManager();
}

export const officeStore = globalWithOffice.__kantorai_office_store!;

