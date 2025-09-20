import { openDB } from 'idb';

export async function initDB() {
  try {
    const db = await openDB('TraderLLM', 4, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('trades')) {
          db.createObjectStore('trades', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('agents')) {
          db.createObjectStore('agents', { keyPath: 'name' });
        }
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('logs')) {
          db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('holdings')) {
          db.createObjectStore('holdings', { keyPath: 'symbol' });
        }
      },
    });
    console.log('Database initialized successfully');
    db.close();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
