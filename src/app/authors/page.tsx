"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_AUTHORS } from "@/graphql/queries";
import { ADD_AUTHOR } from "@/graphql/mutations";
import { Card, EmptyState, ErrorNote, FieldLabel, Input, PrimaryButton, SecondaryButton } from "@/components/ui";

interface Author {
  id: string;
  name: string;
  bio: string | null;
  books: { id: string }[];
}

interface AuthorsData {
  authors: Author[];
}

export default function AuthorsPage() {
  const authorsResult = useQuery<AuthorsData>(GET_AUTHORS);
  const data = authorsResult.data;
  const loading = authorsResult.loading;
  const error = authorsResult.error;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });

  const addAuthorMutation = useMutation(ADD_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });
  const addAuthor = addAuthorMutation[0];
  const adding = addAuthorMutation[1].loading;
  const addError = addAuthorMutation[1].error;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    await addAuthor({ variables: { name: form.name, bio: form.bio || null } });
    setForm({ name: "", bio: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-dark">Tác giả</h2>
          <p className="mt-1 text-sm text-muted">Danh sách tác giả.</p>
        </div>
        <PrimaryButton onClick={() => setShowForm(!showForm)}>
          {showForm ? "Dong" : "+ Thêm tác giả"}
        </PrimaryButton>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Ten tac gia</FieldLabel>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Nguyen Nhat Anh"
              />
            </div>
            <div>
              <FieldLabel>Gioi thieu (khong bat buoc)</FieldLabel>
              <Input
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Vai dong gioi thieu"
              />
            </div>
            <div className="flex items-end gap-2 sm:col-span-2">
              <PrimaryButton type="submit" disabled={adding}>
                {adding ? "Dang luu..." : "Luu tac gia"}
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

      {loading && <Card>Dang tai danh sach tac gia...</Card>}
      {error && <ErrorNote message={error.message} />}

      {!loading && data && data.authors.length === 0 && (
        <EmptyState title="Chua co tac gia nao" description="Bam nut Them tac gia de bat dau." />
      )}

      {!loading && data && data.authors.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.authors.map((author) => (
            <Card key={author.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{author.name}</p>
                  {author.bio && <p className="mt-1 text-sm text-muted">{author.bio}</p>}
                </div>
                <span className="font-mono text-xs text-brass-dark">{author.books.length} dau sach</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}