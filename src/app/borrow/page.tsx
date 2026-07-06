"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_AVAILABLE_BOOKS_AND_MEMBERS, GET_BOOKS, GET_BORROW_RECORDS, GET_STATS } from "@/graphql/queries";
import { BORROW_BOOK, RETURN_BOOK } from "@/graphql/mutations";
import {
  Card,
  EmptyState,
  ErrorNote,
  FieldLabel,
  Input,
  PrimaryButton,
  Select,
  StatusStamp,
  SecondaryButton,
} from "@/components/ui";

interface AvailableData {
  books: { id: string; title: string; available: number }[];
  members: { id: string; name: string }[];
}

interface RecordsData {
  borrowRecords: {
    id: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: string;
    book: { id: string; title: string };
    member: { id: string; name: string };
  }[];
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export default function BorrowPage() {
  const availableResult = useQuery<AvailableData>(GET_AVAILABLE_BOOKS_AND_MEMBERS);
  const availableData = availableResult.data;

  const recordsResult = useQuery<RecordsData>(GET_BORROW_RECORDS);
  const recordsData = recordsResult.data;
  const recordsLoading = recordsResult.loading;
  const recordsError = recordsResult.error;

  const [form, setForm] = useState({ bookId: "", memberId: "", dueDate: defaultDueDate() });

  const refetchAfterChange = [
    { query: GET_BORROW_RECORDS },
    { query: GET_AVAILABLE_BOOKS_AND_MEMBERS },
    { query: GET_BOOKS },
    { query: GET_STATS },
  ];

  const borrowMutation = useMutation(BORROW_BOOK, {
    refetchQueries: refetchAfterChange,
  });
  const borrowBook = borrowMutation[0];
  const borrowing = borrowMutation[1].loading;
  const borrowError = borrowMutation[1].error;

  const returnMutation = useMutation(RETURN_BOOK, {
    refetchQueries: refetchAfterChange,
  });
  const returnBook = returnMutation[0];
  const returnError = returnMutation[1].error;

  async function handleBorrow(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bookId || !form.memberId || !form.dueDate) return;
    await borrowBook({ variables: form });
    setForm({ bookId: "", memberId: "", dueDate: defaultDueDate() });
  }

  const allRecords = recordsData ? recordsData.borrowRecords : [];
  const activeRecords = allRecords.filter((r) => r.status !== "RETURNED");
  const historyRecords = allRecords.filter((r) => r.status === "RETURNED");
  const allBooks = availableData ? availableData.books : [];
  const borrowableBooks = allBooks.filter((b) => b.available > 0);
  const allMembers = availableData ? availableData.members : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-dark">Mượn/trả sách</h2>
      </div>

      <Card>
        <h3 className="mb-4 font-display text-lg font-semibold text-ink">Ticket mới</h3>
        <form onSubmit={handleBorrow} className="grid gap-4 sm:grid-cols-4">
          <div>
            <FieldLabel>Sách</FieldLabel>
            <Select required value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
              <option value="">-- Chọn sách --</option>
              {borrowableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (con {b.available})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Thành viên</FieldLabel>
            <Select required value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
              <option value="">-- Chọn thành viên --</option>
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Hạn trả</FieldLabel>
            <Input
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <PrimaryButton type="submit" disabled={borrowing} className="w-full">
              {borrowing ? "Dang luu..." : "Xác nhận"}
            </PrimaryButton>
          </div>
        </form>
        {borrowError && (
          <div className="mt-3">
            <ErrorNote message={borrowError.message} />
          </div>
        )}
        {borrowableBooks.length === 0 && (
          <p className="mt-3 text-sm text-muted">Hiện không có sách để cho mượn.</p>
        )}
      </Card>

      {returnError && <ErrorNote message={returnError.message} />}

      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">Đang mượn ({activeRecords.length})</h3>
        {recordsLoading && <Card>Dang tai...</Card>}
        {recordsError && <ErrorNote message={recordsError.message} />}
        {!recordsLoading && activeRecords.length === 0 && (
          <EmptyState title="Khong co phieu muon nao dang hoat dong" />
        )}
        {activeRecords.length > 0 && (
          <Card className="divide-y divide-line p-0">
            {activeRecords.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-medium text-ink">{r.book.title}</p>
                  <p className="text-sm text-muted">
                    {r.member.name} - muon {r.borrowDate} - han tra {r.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusStamp status={r.status} />
                  <SecondaryButton onClick={() => returnBook({ variables: { recordId: r.id } })}>
                    Trả sách
                  </SecondaryButton>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {historyRecords.length > 0 && (
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold text-ink">Lịch sử đã trả</h3>
          <Card className="divide-y divide-line p-0">
            {historyRecords.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-medium text-ink">{r.book.title}</p>
                  <p className="text-sm text-muted">
                    {r.member.name} - muon {r.borrowDate} - tra {r.returnDate}
                  </p>
                </div>
                <StatusStamp status={r.status} />
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}