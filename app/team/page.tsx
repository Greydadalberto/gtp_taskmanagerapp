"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  status: string;
};

const mockAssignedTasks: Task[] = [
  { id: 1, title: "Initial Task", status: "Pending" },
  { id: 2, title: "Another Task", status: "Completed" },
];

export default function TeamDashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockAssignedTasks);

  const toggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "Pending" ? "Completed" : "Pending" }
          : task
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Team Dashboard</h1>

      <section>
        <h2>Your Tasks</h2>
        <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(({ id, title, status }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{status}</td>
                <td>
                  <button onClick={() => toggleStatus(id)}>
                    Mark {status === "Pending" ? "Completed" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}





// export default function TeamDashboard() {
//   return (
//     <div>
//       <h1>Team Dashboard</h1>
//       <p>Here you can view and update your assigned tasks.</p>
//     </div>
//   );
// }
