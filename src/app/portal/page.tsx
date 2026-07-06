"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { Library, LogOut, BookOpen } from "lucide-react";
import { GET_BOOKS, GET_MY_BORROW_RECORDS } from "@/graphql/queries";
import { BORROW_BOOK_FOR_ME, RETURN_BOOK_FOR_ME } from "@/graphql/mutations";
import { Card, EmptyState, ErrorNote, PrimaryButton, SecondaryButton, StatusStamp } from "@/components/ui";

interface BooksData {
  books: { id: string; title: string; category: string; available: number; author: { name: string } }[];
}

interface MyRecordsData {
  myBorrowRecords: {
    id: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: string;
    book: { id: string; title: string };
  }[];
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export default function PortalPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(function () {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setUserName(localStorage.getItem("userName") || "Doc gia");
    setCheckingAuth(false);
  }, [router]);

  const booksResult = useQuery<BooksData>(GET_BOOKS, { skip: checkingAuth });
  const books = booksResult.data ? booksResult.data.books : [];
  const booksLoading = booksResult.loading;
  const booksError = booksResult.error;

  const myRecordsResult = useQuery<MyRecordsData>(GET_MY_BORROW_RECORDS, { skip: checkingAuth });
  const myRecords = myRecordsResult.data ? myRecordsResult.data.myBorrowRecords : [];
  const myRecordsLoading = myRecordsResult.loading;
  const myRecordsError = myRecordsResult.error;

  const refetchAfterChange = [{ query: GET_BOOKS }, { query: GET_MY_BORROW_RECORDS }];

  const borrowMutation = useMutation(BORROW_BOOK_FOR_ME, { refetchQueries: refetchAfterChange });
  const borrowBook = borrowMutation[0];
  const borrowError = borrowMutation[1].error;

  const returnMutation = useMutation(RETURN_BOOK_FOR_ME, { refetchQueries: refetchAfterChange });
  const returnBook = returnMutation[0];
  const returnError = returnMutation[1].error;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/login");
  }

  function handleBorrow(bookId: string) {
    borrowBook({ variables: { bookId: bookId, dueDate: defaultDueDate() } });
  }

  if (checkingAuth) {
    return null;
  }

  const availableBooks = books.filter((b) => b.available > 0);
  const activeMyRecords = myRecords.filter((r) => r.status !== "RETURNED");
  const historyMyRecords = myRecords.filter((r) => r.status === "RETURNED");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-forest px-4 shadow-md sm:px-6">
        <div className="flex items-center gap-2 text-white">
          <Library size={22} />
          <span className="font-display text-lg font-bold">Library Manager</span>
          <span className="hidden text-xs text-paper/60 sm:inline">- Cong doc gia</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-white sm:inline">Xin chao, {userName}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-white/30 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            <LogOut size={16} />
            Dang xuat
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Sach dang muon</h2>
          <p className="mt-1 text-sm text-muted">Danh sach sach ban dang muon, bam Tra sach khi doc xong.</p>
        </div>

        {returnError && <ErrorNote message={returnError.message} />}
        {myRecordsError && <ErrorNote message={myRecordsError.message} />}
        {myRecordsLoading && <Card>Dang tai...</Card>}
        {!myRecordsLoading && activeMyRecords.length === 0 && (
          <EmptyState title="Ban chua muon cuon sach nao" icon={BookOpen} />
        )}
        {activeMyRecords.length > 0 && (
          <Card className="divide-y divide-line p-0">
            {activeMyRecords.map(function (r) {
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-medium text-ink">{r.book.title}</p>
                    <p className="text-sm text-muted">Muon {r.borrowDate} - Han tra {r.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusStamp status={r.status} />
                    <SecondaryButton onClick={function () { returnBook({ variables: { recordId: r.id } }); }}>
                      Tra sach
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </Card>
        )}

        {historyMyRecords.length > 0 && (
          <div>
            <h3 className="mb-3 font-display text-lg font-semibold text-slate-800">Lich su da tra</h3>
            <Card className="divide-y divide-line p-0">
              {historyMyRecords.map(function (r) {
                return (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="font-medium text-ink">{r.book.title}</p>
                      <p className="text-sm text-muted">Muon {r.borrowDate} - Tra {r.returnDate}</p>
                    </div>
                    <StatusStamp status={r.status} />
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Sach co the muon</h2>
          <p className="mt-1 text-sm text-muted">Chon sach con ban va bam Muon sach.</p>
        </div>

        {borrowError && <ErrorNote message={borrowError.message} />}
        {booksError && <ErrorNote message={booksError.message} />}
        {booksLoading && <Card>Dang tai...</Card>}
        {!booksLoading && availableBooks.length === 0 && (
          <EmptyState title="Hien khong co sach nao con ban de muon" icon={BookOpen} />
        )}
        {availableBooks.length > 0 && (
          <Card className="divide-y divide-line p-0">
            {availableBooks.map(function (b) {
              return (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-medium text-ink">{b.title}</p>
                    <p className="text-sm text-muted">{b.author.name} - {b.category} - con {b.available} ban</p>
                  </div>
                  <PrimaryButton onClick={function () { handleBorrow(b.id); }}>Muon sach</PrimaryButton>
                </div>
              );
            })}
          </Card>
        )}
      </main>
    </div>
  );
}