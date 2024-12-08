import Database from 'better-sqlite3';
import * as path from 'path';
import { YnabService } from '../../services/ynab.service';

const raw = {
  data: {
    payees: [
      {
        id: 'bdd54bff-062c-49c2-82e7-b93b8a6162ab',
        name: 'Starting Balance',
        deleted: false,
      },
      {
        id: 'a072c04b-2e1c-464d-a2bd-aeac8610d1fb',
        name: 'Manual Balance Adjustment',
        deleted: false,
      },
      {
        id: '0a7bb05f-84c6-4bfc-9da8-a239bcbc4fae',
        name: 'Reconciliation Balance Adjustment',
        deleted: false,
      },
      {
        id: 'f51687cb-d599-4e2d-9050-68ddf84965a0',
        name: 'Sea Residences Parking',
        deleted: false,
      },
      {
        id: '33956547-7c49-45ea-8c90-393b74281c5f',
        name: 'Gringos',
        deleted: false,
      },
      {
        id: '7f9ae63e-a541-4fdc-9022-e946e84e3aea',
        name: 'Healthy Options',
        deleted: false,
      },
      {
        id: '446e9d25-52e7-423c-b95a-d820f027c852',
        name: 'Kurimu',
        deleted: false,
      },
      {
        id: '4716e301-dc83-4559-a5d2-7f2acc43317b',
        name: 'Aquabest',
        deleted: false,
      },
      {
        id: 'be3ce356-a084-4d3d-9fca-ca568355861a',
        name: 'Handyman',
        deleted: false,
      },
      {
        id: '264842b1-c5ff-47ac-830b-1b6a9cb6f2fa',
        name: 'Hi-Precision Diagnostics Plus',
        deleted: false,
      },
      {
        id: '1158e73a-b7b8-41bc-b2e2-b096ce1f3d84',
        name: 'GCash',
        deleted: false,
      },
      {
        id: 'e989e42f-2df4-4cc3-820f-09d17b9359c9',
        name: 'Transfer : Cash',
        transfer_account_id: 'd9797011-738a-41dc-901e-1c37a11d6dc1',
        deleted: false,
      },
      {
        id: 'f0bd3ada-4cc7-4c4f-b375-6b2aab591bb8',
        name: 'Locavore',
        deleted: false,
      },
      {
        id: '17f712a9-40a3-49c6-b301-997fad73f095',
        name: 'BLK 513',
        deleted: false,
      },
      {
        id: 'c05968e6-3b92-4ab3-b32d-395f6f076d3c',
        name: 'Sea Residences',
        deleted: false,
      },
      {
        id: '68950b44-348c-464a-a9ec-6d170e5e61b3',
        name: 'Mercury Drug',
        deleted: false,
      },
      {
        id: '1a45d6e1-208f-46d8-81c5-e9943c76bc28',
        name: 'Dr Katty Go',
        deleted: false,
      },
      {
        id: 'f7b63942-ed0a-43a0-96ce-48e696bb9d2f',
        name: 'Filo Coffee House',
        deleted: false,
      },
      {
        id: 'f3d223cb-5cc4-4323-bbe4-119fb6a7b31d',
        name: 'Whisky Library',
        deleted: false,
      },
      {
        id: '9e54511b-773b-4554-9b8d-763ac4c92a2f',
        name: 'Newport World Resorts',
        deleted: false,
      },
      {
        id: 'c70f2ac7-a89f-4042-aad2-f751edcad0f7',
        name: 'Santouka Ramen',
        deleted: false,
      },
      {
        id: 'c8c539db-1c35-41c9-af32-baa0a19d2e82',
        name: 'Artbeat',
        deleted: false,
      },
      {
        id: '451344be-e712-4fef-a0ad-fc7851df8b92',
        name: 'Flying Tiger',
        deleted: false,
      },
      {
        id: '0a56e1d4-d7aa-4419-8925-c0ac50a7a4eb',
        name: 'Est',
        deleted: false,
      },
      {
        id: '1a3b737a-21e6-46db-9936-9cc52ff305d5',
        name: 'Dylan Gourmet Cafe',
        deleted: false,
      },
      {
        id: '06c01cac-8f00-4ab6-8dc3-175bfdb1cf68',
        name: 'Taxi',
        deleted: false,
      },
      {
        id: '80f4e613-2d7e-495a-922a-6fb1945aea1a',
        name: 'SM Hypermarket',
        deleted: false,
      },
      {
        id: '04f7148e-2851-4dbe-8994-4f3ea2ac65e7',
        name: 'Ramen Nagi',
        deleted: false,
      },
      {
        id: '7738cd3c-d050-4431-8956-48bc830e8fdb',
        name: 'Marks & Spencer',
        deleted: false,
      },
      {
        id: '2cd192c6-3dc7-4360-911f-04e110b30291',
        name: 'AJ Tano',
        deleted: false,
      },
      {
        id: '4ffdd8ac-b98b-443a-90f3-5b5fdf0cde5d',
        name: 'Basil',
        deleted: false,
      },
      {
        id: 'ba6799ca-41f2-4381-b970-ad5ae8a576dd',
        name: 'Kambal Pandesal',
        deleted: false,
      },
      {
        id: 'f377e608-1b18-4c4b-9245-9f1c758b6f54',
        name: 'Uma Uma Ramen',
        deleted: false,
      },
      {
        id: '08dae269-264d-4688-8298-f0c0d8861d50',
        name: 'Overdoughs',
        deleted: false,
      },
      {
        id: 'f52a70c8-e5a6-4b2e-8ec9-72fb172a2054',
        name: 'AquaFlask',
        deleted: false,
      },
      {
        id: '897e5af6-b010-4adf-81df-cd66b5946d44',
        name: 'Our Home',
        deleted: false,
      },
      {
        id: '32b08060-2d23-482b-a800-9e0010900e63',
        name: 'Laundrybest',
        deleted: false,
      },
      {
        id: '52c72fed-b680-4ff4-9e6b-674b4465396e',
        name: 'Core Pacific',
        deleted: false,
      },
      {
        id: '04572c8c-a941-4ed6-aa20-16a6d85ee9d7',
        name: 'Cablelink',
        deleted: false,
      },
      {
        id: 'e800deb2-aaa4-4aac-a2a5-6afded4574ad',
        name: 'Transfer : GCash',
        transfer_account_id: 'd5539301-785e-49fc-9cc9-90960206aaa1',
        deleted: false,
      },
      {
        id: 'f5aff297-e787-4777-9834-9042eae06e8e',
        name: 'InDrive',
        deleted: false,
      },
      {
        id: '151a02ad-fece-482c-916c-4270f5d30496',
        name: 'Hai Chix & Steaks',
        deleted: false,
      },
      {
        id: '3c1acc6e-eba1-452c-bc26-9ce4f4818cd5',
        name: "Cooper's Coffee Haus",
        deleted: false,
      },
      {
        id: '531f27ec-0b36-4c6a-bcbc-f0507b280fec',
        name: 'Lumi Candles',
        deleted: false,
      },
      {
        id: '95726cfc-46cd-45cb-ae00-c3950813aacc',
        name: 'The Marketplace',
        deleted: false,
      },
      {
        id: '6857213d-1bd9-4595-91ab-c781119b9f2b',
        name: 'Wildflour',
        deleted: false,
      },
      {
        id: '10c917aa-0661-43b2-8c5f-a16b6bd2179d',
        name: 'Swaadisht',
        deleted: false,
      },
      {
        id: '56b4c9e3-ba02-419e-b9f3-84dc27c466ad',
        name: 'Octagon',
        deleted: false,
      },
      {
        id: '516f5ee9-26ee-4873-a8fe-53f015adfa97',
        name: 'IKEA',
        deleted: false,
      },
      {
        id: '8ca9b5c6-42ee-41cc-8bcd-3b78625eac58',
        name: 'SM Store',
        deleted: false,
      },
      {
        id: '29352c0b-e30c-4a74-a1be-92e3985ccdc4',
        name: 'Meralco',
        deleted: false,
      },
      {
        id: '32a4eaa7-e175-4e65-ab45-1750922009bc',
        name: 'Army Navy',
        deleted: false,
      },
      {
        id: 'e3bd38cc-e7dd-46c4-9357-d44fb4498a0b',
        name: "Italianni's",
        deleted: false,
      },
      {
        id: '92a2c151-7a6b-48a0-95c2-8d0810f01347',
        name: 'Papermoon',
        deleted: false,
      },
      {
        id: 'f4b495bc-979d-4ca8-a98c-7202561e30b8',
        name: 'Cierto',
        deleted: false,
      },
      {
        id: '9f6be174-f7a3-4bdd-9021-f57fbc4bda49',
        name: 'Agave',
        deleted: false,
      },
      {
        id: '4f0ba643-6a2b-43da-b7bd-a16c0a44d092',
        name: 'Miniso',
        deleted: false,
      },
      {
        id: 'da6893ba-5e56-410a-888a-cb6a40184a67',
        name: 'Aircon+',
        deleted: false,
      },
      {
        id: '06b5974e-77fc-4049-9dce-05e5f1081867',
        name: 'Avocadoria',
        deleted: false,
      },
      {
        id: '5f24deb9-a9ac-4c77-8b3e-7043f71a3cf0',
        name: 'Executive Optical',
        deleted: false,
      },
      {
        id: 'fc14735d-3576-484d-a7c5-ecf9f9afa667',
        name: 'True Boss',
        deleted: false,
      },
      {
        id: '0bf7528a-1cab-4a74-bb97-0b3d2afb3635',
        name: 'Keycards',
        deleted: false,
      },
      {
        id: 'b960c841-01c1-4e0b-bd17-55e8561e1550',
        name: 'Ball Katsu',
        deleted: false,
      },
      {
        id: 'c37b17d8-f16d-44b5-8752-67f22eb9f02f',
        name: 'Alfamart',
        deleted: false,
      },
      {
        id: 'e6a13218-83ea-4980-af37-46409840109a',
        name: 'Mitsuyado Sei-Men',
        deleted: false,
      },
      {
        id: 'ad2496b2-bd08-4140-aa26-bf92d8334960',
        name: 'Songtan',
        deleted: false,
      },
      {
        id: 'a3f20a66-6397-4377-bd4e-88930dc0581b',
        name: 'Lazada',
        deleted: false,
      },
      {
        id: 'edf85c86-b46b-4223-9c74-d6a3af443b37',
        name: 'Waltermart',
        deleted: false,
      },
      {
        id: '0b0b9c85-d4b4-48f1-b6f2-32ee1a1e5d2d',
        name: 'Yayoi',
        deleted: false,
      },
      {
        id: '2607bd17-1d0a-4121-b54a-a99f23e53ddd',
        name: 'Kor Asian',
        deleted: false,
      },
      {
        id: '36073157-d898-47e3-bb90-6c0e68f5a69e',
        name: 'Savemore',
        deleted: false,
      },
      {
        id: 'b208cb1a-a51e-414a-8817-95fc23638d8b',
        name: 'Blue Wonder',
        deleted: false,
      },
      {
        id: 'df0be25a-5337-4126-bdab-6c423c909259',
        name: 'Rich Oyster',
        deleted: false,
      },
      {
        id: 'aaa2c6d1-a4f6-421a-8864-ae82bc29d3ff',
        name: 'Dohtonbori',
        deleted: false,
      },
      {
        id: 'fe2f6498-5098-412a-be58-1228bf1733f5',
        name: 'Caramia',
        deleted: false,
      },
      {
        id: '341c44dc-7969-494b-abe4-c8b89115583d',
        name: 'Cinnabon',
        deleted: false,
      },
      {
        id: 'b7863973-208d-43dc-a630-99c15647db48',
        name: 'Tsujiri',
        deleted: false,
      },
      {
        id: '721f01be-9178-4e0f-94c4-a46ccdb1cfbf',
        name: 'Joe Balancio',
        deleted: false,
      },
      {
        id: '5ae5c4e2-19d0-4a86-b5ad-2bf39312a51c',
        name: 'The French Baker',
        deleted: false,
      },
      {
        id: 'bb3b3386-dcd8-4ff6-a9fb-f27acfe69210',
        name: 'Travel Tax',
        deleted: false,
      },
      {
        id: '0dd9424b-5629-4479-a0f9-ac59abd537bb',
        name: 'The Matrimonial',
        deleted: false,
      },
    ],
    server_knowledge: 461,
  },
};

export class PayeesService {
  dbName = 'payees';
  private db: Database;
  constructor(private readonly ynabService: YnabService) {
    this.db = new Database(path.resolve(process.cwd(), 'database.sqlite'));

    this.db.pragma('journal_mode = WAL');

    // Check if table exists
    const result = this.db
      .prepare(
        `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name = ?;
`,
      )
      .get(this.dbName);

    if (result.count >= 1) {
      return;
    }

    this.db.exec(
      `
-- Create main table
CREATE TABLE IF NOT EXISTS ${this.dbName} (id INTEGER PRIMARY KEY, external_id TEXT NOT NULL, name TEXT NOT NULL);

-- Create FTS5 table
CREATE VIRTUAL TABLE IF NOT EXISTS ${this.dbName}_fts USING fts5(name, content='${this.dbName}', content_rowid='id');

-- Create triggers to keep FTS5 table in sync
CREATE TRIGGER IF NOT EXISTS trg_afterinsert_${this.dbName} AFTER INSERT ON ${this.dbName} BEGIN
INSERT INTO ${this.dbName}_fts(rowid, name) VALUES (new.id, new.name);
END;

CREATE TRIGGER IF NOT EXISTS trg_afterdelete_${this.dbName} AFTER DELETE ON ${this.dbName} BEGIN
INSERT INTO ${this.dbName}_fts(${this.dbName}_fts, rowid, name) VALUES('delete', old.id, old.name);
END;

CREATE TRIGGER IF NOT EXISTS trg_afterupdate_${this.dbName} AFTER UPDATE ON ${this.dbName} BEGIN
INSERT INTO ${this.dbName}_fts(${this.dbName}_fts, rowid, name) VALUES('delete', old.id, old.name);
INSERT INTO ${this.dbName}_fts(rowid, name) VALUES (new.id, new.name);
END;
`,
    );
  }

  async load(force: boolean = false) {
    if (force) {
      const countResult = this.db.exec(
        `
DELETE FROM ${this.dbName};
DELETE FROM ${this.dbName}_fts;
`,
      );
    }
    const countResult = this.db
      .prepare(
        `
SELECT COUNT(*) as count FROM ${this.dbName};`,
      )
      .get();

    if (countResult.count >= 1) {
      return;
    }

    const results = await this.ynabService.getPayees();

    const stmt = this.db.prepare(
      `INSERT OR IGNORE INTO ${this.dbName} (external_id, name) VALUES (@id, @name)`,
    );
    const insertMany = this.db.transaction((items: any[]) => {
      for (const item of items) {
        stmt.run(item);
      }
    });

    insertMany(results.data.payees.filter((x) => !x.deleted));
  }

  findAll(search: string) {
    const results = this.db
      .prepare(
        `SELECT rank, rowid, * FROM ${this.dbName}_fts WHERE ${this.dbName}_fts MATCH ? ORDER BY rank`,
      )
      .all(search);

    const rowids = results.map((row: any) => {
      return row.rowid;
    });
    const items = this.db
      .prepare(
        `SELECT * FROM ${this.dbName} WHERE rowid IN (${rowids
          .map(() => '?')
          .join(', ')})`,
      )
      .all(rowids);

    return items.map((row: any) => {
      return {
        externalId: row.external_id,
        name: row.name,
      };
    });
  }

  findOne(search: string) {
    const result = this.db
      .prepare(
        `SELECT * FROM ${this.dbName}_fts WHERE ${this.dbName}_fts MATCH ?`,
      )
      .get(search);

    if (!result) {
      return null;
    }

    return {
      externalId: result.external_id,
      name: result.name,
    };
  }

  count() {
    const countResult = this.db
      .prepare(
        `
SELECT COUNT(*) as count FROM ${this.dbName};`,
      )
      .get();

    return countResult.count;
  }

  getCsvString() {
    const rows = this.db.prepare(`SELECT * FROM ${this.dbName};`).all();

    return (
      'id,name\n' +
      rows
        .map((row: any) => {
          return `${row.external_id},${row.name}`;
        })
        .join('\n')
    );
  }
}
