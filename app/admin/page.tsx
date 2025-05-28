"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  assignedTo: string;
  status: string;
};

const mockTeamMembers = ["user1@example.com", "user2@example.com", "user3@example.com"];

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Initial Task", assignedTo: "user1@example.com", status: "Pending" },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState(mockTeamMembers[0]);

  const createTask = () => {
    if (!newTaskTitle) return alert("Please enter a task title");
    const newTask: Task = {
      id: tasks.length + 1,
      title: newTaskTitle,
      assignedTo: newTaskAssignee,
      status: "Pending",
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create and Assign Task</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm"
          />
          <select
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border rounded shadow-sm"
          >
            {mockTeamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <button
            onClick={createTask}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
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




