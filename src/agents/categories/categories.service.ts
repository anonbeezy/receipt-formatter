import Database from 'better-sqlite3';
import * as path from 'path';

interface Category {
  externalId: string;
  name: string;
}

// TODO: Fill with data
const data = [];

export class CategoriesService {
  private db;

  constructor() {
    this.db = new Database(path.resolve(process.cwd(), 'database.sqlite'));

    this.db.pragma('journal_mode = WAL');

    // Check if table exists
    const result = this.db
      .prepare(
        `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name = ?;
`
      )
      .get('categories');

    if (result.count >= 1) {
      return;
    }

    this.db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            external_id TEXT NOT NULL,
            name TEXT NOT NULL
        );
 `);
    this.createMany(
      data.map(({ id, name }) => ({ externalId: id, name } as Category))
    );

    this.db.exec(
      `
CREATE VIRTUAL TABLE IF NOT EXISTS categories_fts USING fts5(external_id, name, content='categories');
`
    );
    this.db.exec(`
INSERT INTO categories_fts(rowid, external_id, name) SELECT rowid, external_id, name FROM categories;
    `);
  }

  createMany(categories: Category[]) {
    const stmt = this.db.prepare(
      'INSERT OR IGNORE INTO categories (external_id, name) VALUES (@externalId, @name)'
    );
    const insertMany = this.db.transaction((items: any[]) => {
      for (const item of items) {
        stmt.run(item);
      }
    });

    insertMany(categories);
  }

  findAll(search: string): Category[] {
    const results = this.db
      .prepare('SELECT * FROM categories_fts WHERE categories_fts MATCH ?')
      .all(search);

    return results.map((row: any) => {
      return {
        externalId: row.external_id,
        name: row.name,
      };
    });
  }

  findOne(search: string): Category | null {
    const result = this.db
      .prepare('SELECT * FROM categories_fts WHERE categories_fts MATCH ?')
      .get(search);

    if (!result) {
      return null;
    }

    return {
      externalId: result.external_id,
      name: result.name,
    };
  }
}
