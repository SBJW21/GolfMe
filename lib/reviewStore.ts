/**
 * Saves coach reviews in this browser (IndexedDB) so the demo student page can show them.
 * The live version stores these in Supabase and the video service instead.
 */
import type { Ev, Stroke } from "./swingDraw";

export type ReviewMedia = { kind: "video" | "image"; blob: Blob; name: string };
export type Review = {
  id: string;
  title: string;
  createdAt: number;
  media: ReviewMedia[];
  strokes: Stroke[];
  events: Ev[];
  audio: Blob | null;
};

const DB = "golfme-reviews";
const STORE = "reviews";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(db.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export const saveReview = (r: Review) => run("readwrite", (s) => s.put(r));
export const getReview = (id: string) => run<Review | undefined>("readonly", (s) => s.get(id));
export const listReviews = () => run<Review[]>("readonly", (s) => s.getAll());
export const deleteReview = (id: string) => run("readwrite", (s) => s.delete(id));
