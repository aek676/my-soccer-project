import { InjectionToken } from '@angular/core';
import { doc, setDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface FirestoreFunctions {
  doc: typeof doc;
  setDoc: typeof setDoc;
  docData: typeof docData;
}

export const FIRESTORE_FUNCTIONS = new InjectionToken<FirestoreFunctions>(
  'Firestore Functions',
  {
    providedIn: 'root',
    factory: () => ({
      doc,
      setDoc,
      docData,
    }),
  },
);
