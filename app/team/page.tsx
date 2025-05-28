"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  assignedTo: string;
  status: string;
};

const mockTeamMembers = ["user1@example.com", "user2@example.com", "user3@example.com"];

export default function TeamDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Initial Task", assignedTo: "user1@example.com", status: "Pending" },
  ]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Team Dashboard</h1>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Assigned Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Assigned To</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(({ id, title, assignedTo, status }) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="border-t px-4 py-2">{id}</td>
                  <td className="border-t px-4 py-2">{title}</td>
                  <td className="border-t px-4 py-2">{assignedTo}</td>
                  <td className="border-t px-4 py-2">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}




