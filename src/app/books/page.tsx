"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_AUTHORS, GET_BOOKS } from "@/graphql/queries";
import { ADD_BOOK, DELETE_BOOK } from "@/graphql/mutations";
import {
  Card,
  DangerButton,
  EmptyState,
  ErrorNote,
  FieldLabel,
  Input,
  PrimaryButton,
  SecondaryButton,
  Select,
} from "@/components/ui";

interface Book {
  id: string;
  title: string;
  category: string;
  publishedYear: number | null;
  quantity: number;
  available: number;
  author: { id: string; name: string };
}

interface BooksData {
  books: Book[];
}

interface AuthorsData {
  authors: { id: string; name: string }[];
}

export default function BooksPage() {
  const booksResult = useQuery<BooksData>(GET_BOOKS);
  const authorsResult = useQuery<AuthorsData>(GET_AUTHORS);
  const [showForm, setShowForm] = useState(false);

  const data = booksResult.data;
  const loading = booksResult.loading;
  const error = booksResult.error;
  const authorsData = authorsResult.data;

  const addBookMutation = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });
  const addBook = addBookMutation[0];
  const adding = addBookMutation[1].loading;
  const addError = addBookMutation[1].error;

  const deleteBookMutation = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });
  const deleteBook = deleteBookMutation[0];
  const deleteError = deleteBookMutation[1].error;

  const [form, setForm] = useState({
    title: "",
    authorId: "",
    category: "",
    publishedYear: "",
    quantity: "1",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.authorId || !form.category) return;
    await addBook({
      variables: {
        title: form.title,
        authorId: form.authorId,
        category: form.category,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
        quantity: Number(form.quantity),
      },
    });
    setForm({ title: "", authorId: "", category: "", publishedYear: "", quantity: "1" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-dark">Danh mục sách</h2>
          <p className="mt-1 text-sm text-muted">Thêm, theo dõi số lượng .</p>
        </div>
        <PrimaryButton onClick={() => setShowForm(!showForm)}>
          {showForm ? "Dong" : "+ Thêm sách"}
        </PrimaryButton>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Ten sach</FieldLabel>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Mat Biec"
              />
            </div>
            <div>
              <FieldLabel>Tac gia</FieldLabel>
              <Select
                required
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
              >
                <option value="">-- Chon tac gia --</option>
                {authorsData
                  ? authorsData.authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))
                  : null}
              </Select>
            </div>
            <div>
              <FieldLabel>The loai</FieldLabel>
              <Input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="VD: Van hoc"
              />
            </div>
            <div>
              <FieldLabel>Nam xuat ban</FieldLabel>
              <Input
                type="number"
                value={form.publishedYear}
                onChange={(e) => setForm({ ...form, publishedYear: e.target.value })}
                placeholder="VD: 2020"
              />
            </div>
            <div>
              <FieldLabel>So luong </FieldLabel>
              <Input
                type="number"
                min={1}
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <PrimaryButton type="submit" disabled={adding}>
                {adding ? "Dang luu..." : "Luu sach"}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowForm(false)}>
                Huy
              </SecondaryButton>
            </div>
            {addError && (
              <div className="sm:col-span-2">
                <ErrorNote message={addError.message} />
              </div>
            )}
          </form>
        </Card>
      )}

      {deleteError && <ErrorNote message={deleteError.message} />}

      {loading && <Card>Dang tai danh sach sach...</Card>}
      {error && <ErrorNote message={error.message} />}

      {!loading && !error && data && data.books.length === 0 && (
        <EmptyState title="Chua co sach nao" description="Bam nut Them sach de bat dau." />
      )}

      {!loading && data && data.books.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper/60 font-mono text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Ten sach</th>
                <th className="px-5 py-3">Tac gia</th>
                <th className="px-5 py-3">The loai</th>
                <th className="px-5 py-3">Nam XB</th>
                <th className="px-5 py-3">Con / Tong</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.books.map((book) => (
                <tr key={book.id}>
                  <td className="px-5 py-3 font-medium text-ink">{book.title}</td>
                  <td className="px-5 py-3 text-muted">{book.author.name}</td>
                  <td className="px-5 py-3 text-muted">{book.category}</td>
                  <td className="px-5 py-3 font-mono text-muted">{book.publishedYear ?? "-"}</td>
                  <td className="px-5 py-3 font-mono">
                    <span className={book.available === 0 ? "text-stamp-red" : "text-forest"}>
                      {book.available}
                    </span>
                    <span className="text-muted"> / {book.quantity}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DangerButton onClick={() => deleteBook({ variables: { id: book.id } })}>
                      Xoa
                    </DangerButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}