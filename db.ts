import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import path from "path";

const dbPath = path.join(__dirname, "..", "library.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  member_id TEXT
);

CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author_id TEXT NOT NULL,
  category TEXT NOT NULL,
  published_year INTEGER,
  quantity INTEGER NOT NULL,
  available INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT
);

CREATE TABLE IF NOT EXISTS borrow_records (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  borrow_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  return_date TEXT,
  status TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);
`);

function migrateIfNeeded() {
  const userColumns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const hasMemberId = userColumns.some((c) => c.name === "member_id");
  if (!hasMemberId) {
    db.exec("ALTER TABLE users ADD COLUMN member_id TEXT");
  }
}

migrateIfNeeded();

function seedIfEmpty() {
  const authorCount = db.prepare("SELECT COUNT(*) as count FROM authors").get() as { count: number };
  if (authorCount.count > 0) return;

  const insertAuthor = db.prepare("INSERT INTO authors (id, name, bio) VALUES (?, ?, ?)");
  const a1 = randomUUID();
  const a2 = randomUUID();
  const a3 = randomUUID();
  const a4 = randomUUID();
  insertAuthor.run(a1, "Nguyen Nhat Anh", "Nha van Viet Nam noi tieng voi truyen thieu nhi va tuoi moi lon.");
  insertAuthor.run(a2, "To Hoai", "Tac gia cua De Men Phieu Luu Ky.");
  insertAuthor.run(a3, "Robert C. Martin", "Tac gia cac sach kinh dien ve ky thuat phan mem.");
  insertAuthor.run(a4, "Yuval Noah Harari", "Su gia, tac gia Sapiens va Homo Deus.");

  const insertBook = db.prepare(
    "INSERT INTO books (id, title, author_id, category, published_year, quantity, available) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  insertBook.run(randomUUID(), "Mat Biec", a1, "Van hoc", 1990, 5, 3);
  insertBook.run(randomUUID(), "Cho Toi Xin Mot Ve Di Tuoi Tho", a1, "Van hoc", 2008, 4, 4);
  insertBook.run(randomUUID(), "De Men Phieu Luu Ky", a2, "Thieu nhi", 1941, 6, 5);
  insertBook.run(randomUUID(), "Clean Code", a3, "Cong nghe", 2008, 3, 1);
  insertBook.run(randomUUID(), "Sapiens", a4, "Lich su", 2011, 4, 4);

  const insertMember = db.prepare("INSERT INTO members (id, name, email, phone) VALUES (?, ?, ?, ?)");
  insertMember.run(randomUUID(), "Tran Thi Bich", "bich.tran@example.com", "0901234567");
  insertMember.run(randomUUID(), "Le Van Hung", "hung.le@example.com", "0912345678");
}

seedIfEmpty();