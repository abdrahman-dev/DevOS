import { openDB, type IDBPDatabase } from 'idb';
import type { Project, LearningItem, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const DB_NAME = 'devos-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('learning')) {
          db.createObjectStore('learning', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  return db.getAll('projects');
}

export async function addProject(p: Project): Promise<void> {
  const db = await getDb();
  await db.add('projects', p);
}

export async function updateProject(p: Project): Promise<void> {
  const db = await getDb();
  await db.put('projects', p);
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('projects', id);
}

export async function getAllLearning(): Promise<LearningItem[]> {
  const db = await getDb();
  return db.getAll('learning');
}

export async function addLearning(item: LearningItem): Promise<void> {
  const db = await getDb();
  await db.add('learning', item);
}

export async function updateLearning(item: LearningItem): Promise<void> {
  const db = await getDb();
  await db.put('learning', item);
}

export async function deleteLearning(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('learning', id);
}

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const settings = await db.get('settings', 'main');
  return (settings as Settings) ?? DEFAULT_SETTINGS;
}

export async function saveSettings(s: Settings): Promise<void> {
  const db = await getDb();
  await db.put('settings', { id: 'main', ...s });
}
