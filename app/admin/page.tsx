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
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <section style={{ marginBottom: 30 }}>
        <h2>Create and Assign Task</h2>
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select
          value={newTaskAssignee}
          onChange={(e) => setNewTaskAssignee(e.target.value)}
          style={{ marginRight: 10 }}
        >
          {mockTeamMembers.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
        <button onClick={createTask}>Create Task</button>
      </section>

      <section>
        <h2>All Tasks</h2>
        <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(({ id, title, assignedTo, status }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{assignedTo}</td>
                <td>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}



// export default function AdminDashboard() {
//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <p>Here you can manage tasks and view team assignments.</p>
//     </div>
//   );
// }
