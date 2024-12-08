import Database from 'better-sqlite3';
import * as path from 'path';

interface Category {
  externalId: string;
  name: string;
}

const data = [
  {
    id: '92cf7388-315e-4bb7-9d5a-ad0ff7669ab1',
    name: 'Inflow: Ready to Assign',
  },
  { id: '18280063-d22b-4650-8595-0d303d5635d8', name: 'Uncategorized' },
  { id: 'e23db789-a234-43f7-b73d-110e8168a6e4', name: 'Cable' },
  { id: 'c269b7fe-72a8-4485-a5a3-8fea131cbb97', name: 'Rent/Mortgage' },
  { id: '06093e40-a37c-4431-ab01-7508f104737c', name: 'Electric' },
  { id: 'acbe5a6d-7dc8-4c4b-b8f4-2fd4adc992b2', name: 'Water' },
  { id: '3e1544d5-1fc7-4c76-9fc6-33860ae60ea0', name: 'Internet' },
  { id: '7550698a-8ef4-4f76-b577-72932186e52d', name: 'Cellphone' },
  { id: 'be1d7f68-e26f-440d-8d59-181e9eae7220', name: 'Groceries' },
  { id: 'cb4021bf-ff1a-4c65-8bc7-8763c249737f', name: 'Eating Out' },
  { id: '2acf7b59-7cd0-41f7-9ef0-31b29fcc01a2', name: 'Laundry' },
  { id: 'e6a541eb-4eb9-47e0-94a3-6ae2aca1ab9f', name: 'Personal Care' },
  {
    id: '9bd9a894-37c3-4c25-a172-bc502624f2f5',
    name: 'Transportation',
  },
  {
    id: '27801179-02b7-4932-b2fe-daadc9c3a1e5',
    name: 'Home Maintenance',
  },
  {
    id: 'edea3f5d-b175-48ea-b91a-c03c08b767b8',
    name: 'Office Supplies',
  },
  { id: 'a8dfdb90-10bc-4296-aace-fd123247f097', name: 'Fees' },
  { id: '56584984-daa7-4cc6-a966-e19fedfc984e', name: 'Medical' },
  {
    id: 'd422b5f7-8286-4a53-b253-7edc9f3bcd4b',
    name: 'Auto Maintenance',
  },
  { id: '0d1fed69-b407-4c87-a5b0-1a4975ef20fd', name: 'Gifts' },
  { id: 'd3fff746-9ae9-4b77-b7d9-598c799fef1e', name: 'Vacation' },
  {
    id: '65ce2174-967b-482a-88d8-cba08d94c748',
    name: 'Home Improvement',
  },
  { id: '73b21a62-31fe-4300-b24f-8bebe44689fe', name: 'Hobbies' },
  { id: '2068a3c9-59ef-4fa5-9786-2522725b3517', name: 'Entertainment' },
  {
    id: '47282367-d5ac-4dd2-8f75-8ab0dae8af53',
    name: 'Health & Wellness',
  },
];

export class CategoriesService {
  private db;

  constructor() {
    this.db = new Database(path.resolve(process.cwd(), 'database.sqlite'));

    this.db.pragma('journal_mode = WAL');

    // Check if table exists
    const result = this.db
      .prepare(
        `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name = ?;
`,
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
      data.map(({ id, name }) => ({ externalId: id, name }) as Category),
    );

    this.db.exec(
      `
CREATE VIRTUAL TABLE IF NOT EXISTS categories_fts USING fts5(external_id, name, content='categories');
`,
    );
    this.db.exec(`
INSERT INTO categories_fts(rowid, external_id, name) SELECT rowid, external_id, name FROM categories;
    `);
  }

  createMany(categories: Category[]) {
    const stmt = this.db.prepare(
      'INSERT OR IGNORE INTO categories (external_id, name) VALUES (@externalId, @name)',
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

  getCsvString() {
    const results = this.db.prepare('SELECT * FROM categories').all();

    return (
      'id,name\n' +
      results
        .map((row: any) => {
          return `${row.external_id},${row.name}`;
        })
        .join('\n')
    );
  }
}
