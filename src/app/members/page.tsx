"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_MEMBERS } from "@/graphql/queries";
import { ADD_MEMBER, DELETE_MEMBER } from "@/graphql/mutations";
import {
  Card,
  DangerButton,
  EmptyState,
  ErrorNote,
  FieldLabel,
  Input,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  borrowRecords: { id: string; status: string }[];
}

interface MembersData {
  members: Member[];
}

export default function MembersPage() {
  const membersResult = useQuery<MembersData>(GET_MEMBERS);
  const data = membersResult.data;
  const loading = membersResult.loading;
  const error = membersResult.error;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const addMemberMutation = useMutation(ADD_MEMBER, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });
  const addMember = addMemberMutation[0];
  const adding = addMemberMutation[1].loading;
  const addError = addMemberMutation[1].error;

  const deleteMemberMutation = useMutation(DELETE_MEMBER, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });
  const deleteMember = deleteMemberMutation[0];
  const deleteError = deleteMemberMutation[1].error;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    await addMember({ variables: { name: form.name, email: form.email, phone: form.phone || null } });
    setForm({ name: "", email: "", phone: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-dark">Thành viên</h2>
          <p className="mt-1 text-sm text-muted">Danh sách đăng ký.</p>
        </div>
        <PrimaryButton onClick={() => setShowForm(!showForm)}>
          {showForm ? "Dong" : "+ Thêm thành viên"}
        </PrimaryButton>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
            <div>
              <FieldLabel>Ho ten</FieldLabel>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Tran Thi Bich"
              />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ban@example.com"
              />
            </div>
            <div>
              <FieldLabel>Dien thoai (khong bat buoc)</FieldLabel>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="09xxxxxxxx"
              />
            </div>
            <div className="flex items-end gap-2 sm:col-span-3">
              <PrimaryButton type="submit" disabled={adding}>
                {adding ? "Dang luu..." : "Luu thanh vien"}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowForm(false)}>
                Huy
              </SecondaryButton>
            </div>
            {addError && (
              <div className="sm:col-span-3">
                <ErrorNote message={addError.message} />
              </div>
            )}
          </form>
        </Card>
      )}

      {deleteError && <ErrorNote message={deleteError.message} />}
      {loading && <Card>Dang tai danh sach thanh vien...</Card>}
      {error && <ErrorNote message={error.message} />}

      {!loading && data && data.members.length === 0 && (
        <EmptyState title="Chua co thanh vien nao" description="Bam nut Them thanh vien de bat dau." />
      )}

      {!loading && data && data.members.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-paper/60 font-mono text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Ho ten</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Dien thoai</th>
                <th className="px-5 py-3">Dang muon</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.members.map((member) => {
                const activeCount = member.borrowRecords.filter((r) => r.status !== "RETURNED").length;
                return (
                  <tr key={member.id}>
                    <td className="px-5 py-3 font-medium text-ink">{member.name}</td>
                    <td className="px-5 py-3 text-muted">{member.email}</td>
                    <td className="px-5 py-3 text-muted">{member.phone ?? "-"}</td>
                    <td className="px-5 py-3 font-mono">{activeCount}</td>
                    <td className="px-5 py-3 text-right">
                      <DangerButton onClick={() => deleteMember({ variables: { id: member.id } })}>
                        Xoa
                      </DangerButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}