"use client";

import { useQuery } from "@apollo/client/react";
import { BookOpen, Layers, Users, Clock } from "lucide-react";
import { GET_BORROW_RECORDS, GET_STATS } from "@/graphql/queries";
import { Card, EmptyState, StatCard, StatusStamp } from "@/components/ui";

interface StatsData {
  stats: {
    totalBooks: number;
    totalCopies: number;
    totalMembers: number;
    activeBorrows: number;
    overdueBorrows: number;
  };
}

interface RecordsData {
  borrowRecords: {
    id: string;
    dueDate: string;
    status: string;
    book: { title: string };
    member: { name: string };
  }[];
}

export default function DashboardPage() {
  const statsResult = useQuery<StatsData>(GET_STATS);
  const statsData = statsResult.data;
  const statsLoading = statsResult.loading;
  const statsError = statsResult.error;

  const recordsResult = useQuery<RecordsData>(GET_BORROW_RECORDS);
  const recordsData = recordsResult.data;
  const recordsLoading = recordsResult.loading;
  const recordsError = recordsResult.error;

  const allRecords = recordsData ? recordsData.borrowRecords : [];
  const sortedRecords = allRecords.slice().sort(function (a, b) {
    if (a.dueDate < b.dueDate) return 1;
    return -1;
  });
  const recent = sortedRecords.slice(0, 5);

  let totalBooksValue = 0;
  if (statsData) {
    totalBooksValue = statsData.stats.totalBooks;
  }

  let totalCopiesValue = 0;
  if (statsData) {
    totalCopiesValue = statsData.stats.totalCopies;
  }

  let totalMembersValue = 0;
  if (statsData) {
    totalMembersValue = statsData.stats.totalMembers;
  }

  let activeBorrowsValue = 0;
  if (statsData) {
    activeBorrowsValue = statsData.stats.activeBorrows;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-400">Home / Dashboard</p>
      </div>

      {statsError && (
        <Card className="border-rose-300 text-rose-600">
          Khong ket noi duoc GraphQL API. Kiem tra bien moi truong NEXT_PUBLIC_GRAPHQL_API_URL trong file .env.local.
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Books"
          value={statsLoading ? "..." : totalBooksValue}
          icon={BookOpen}
          color="blue"
          href="/books"
        />
        <StatCard
          label="Total Copies"
          value={statsLoading ? "..." : totalCopiesValue}
          icon={Layers}
          color="green"
          href="/books"
        />
        <StatCard
          label="Readers"
          value={statsLoading ? "..." : totalMembersValue}
          icon={Users}
          color="orange"
          href="/members"
        />
        <StatCard
          label="Total Borrowing"
          value={statsLoading ? "..." : activeBorrowsValue}
          icon={Clock}
          color="red"
          href="/borrow"
        />
      </div>

      <Card className="p-0">
        <div className="border-b border-line px-5 py-3">
          <h3 className="font-display text-lg font-semibold text-slate-800">Recent borrow records</h3>
        </div>
        {recordsLoading && <div className="p-5">Dang tai...</div>}
        {!recordsLoading && recent.length === 0 && (
          <div className="p-5">
            <EmptyState title="Chua co phieu muon nao" description="Vao muc Borrow / Return de tao phieu muon dau tien." />
          </div>
        )}
        {!recordsLoading && recent.length > 0 && (
          <div className="divide-y divide-line">
            {recent.map(function (r) {
              return (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-ink">{r.book.title}</p>
                    <p className="text-sm text-muted">{r.member.name} - han tra {r.dueDate}</p>
                  </div>
                  <StatusStamp status={r.status} />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}