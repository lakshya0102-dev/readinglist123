import { useCallback, useEffect, useState } from 'react';
import type { Book, ReadingStatus } from '@/types';

const STORAGE_KEY = 'reading-list:books';

function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Book[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function useReadingList() {
  const [books, setBooks] = useState<Book[]>(() => loadBooks());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      // ignore quota / serialization errors
    }
  }, [books]);

  const addBook = useCallback((title: string, status: ReadingStatus) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const book: Book = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: trimmed,
      status,
      createdAt: Date.now(),
    };
    setBooks((prev) => [book, ...prev]);
  }, []);

  const setStatus = useCallback((id: string, status: ReadingStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  const removeBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { books, addBook, setStatus, removeBook };
}
