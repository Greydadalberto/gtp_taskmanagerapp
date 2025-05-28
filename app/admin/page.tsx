'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

export default function AdminPage() {
  const auth = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/');
    } else {
      const groups = auth.user?.profile['cognito:groups'];
      if (!groups?.includes('admingroup')) {
        router.push('/team');
      }
    }
  }, [auth.isAuthenticated]);

  const filteredTasks =
    filter === 'All'
      ? tasks
      : tasks.filter((task) => task.status === filter);

  const updateStatus = (id: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
    alert(`Task ${id} updated to ${newStatus}`);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    alert(`Task ${id} deleted`);
  };

  const addTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: `Task ${tasks.length + 1}`,
      status: 'Pending',
    };
    setTasks([...tasks, newTask]);
    alert('New task created!');
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add Task
        </button>

        <select
          className="border px-2 py-1 rounded"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600">{task.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border px-2 py-1 rounded"
                value={task.status}
                onChange={(e) =>
                  updateStatus(task.id, e.target.value as Task['status'])
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => auth.signoutRedirect()}
        className="mt-8 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
      >
        Sign Out
      </button>
    </main>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "react-oidc-context";
// import { useRouter } from "next/navigation";

// type Task = {
//   id: string;
//   title: string;
//   status: "pending" | "in-progress" | "done";
// };

// export default function AdminPage() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     if (!auth.isAuthenticated) return;
//     if (!auth.user?.profile["cognito:groups"]?.includes("admingroup")) {
//       router.replace("/team");
//     }
//     fetchTasks();
//   }, [auth.isAuthenticated]);

//   const fetchTasks = async () => {
//     // Simulated fetch
//     setTasks([
//       { id: "1", title: "Check reports", status: "pending" },
//       { id: "2", title: "Approve schedules", status: "done" },
//     ]);
//   };

//   const updateTaskStatus = (id: string, status: Task["status"]) => {
//     setTasks((prev) =>
//       prev.map((task) => (task.id === id ? { ...task, status } : task))
//     );
//     alert(`Task ${id} updated to ${status}`);
//   };

//   const deleteTask = (id: string) => {
//     setTasks((prev) => prev.filter((task) => task.id !== id));
//     alert(`Task ${id} deleted`);
//   };

//   const signOutRedirect = () => {
//     const clientId = "4fi4lbbl6t3oo8cs5jcsug9v8n";
//     const logoutUri = "http://localhost:3000";
//     const domain = "https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com";
//     window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   const filteredTasks = tasks.filter((task) => filter === "all" || task.status === filter);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-4">Admin Task Manager</h1>

//       <div className="mb-4 flex items-center gap-4">
//         <label className="text-lg font-semibold">Filter:</label>
//         <select onChange={(e) => setFilter(e.target.value)} value={filter} className="p-2 rounded border">
//           <option value="all">All</option>
//           <option value="pending">Pending</option>
//           <option value="in-progress">In Progress</option>
//           <option value="done">Done</option>
//         </select>
//       </div>

//       <ul className="space-y-4">
//         {filteredTasks.map((task) => (
//           <li key={task.id} className="bg-white p-4 rounded shadow-md flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold text-lg">{task.title}</h3>
//               <p className="text-gray-600">Status: {task.status}</p>
//             </div>
//             <div className="flex gap-2">
//               <select
//                 value={task.status}
//                 onChange={(e) => updateTaskStatus(task.id, e.target.value as Task["status"])}
//                 className="p-1 border rounded"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="done">Done</option>
//               </select>
//               <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <div className="mt-6 flex gap-4">
//         <button onClick={() => auth.removeUser()} className="bg-gray-600 text-white px-4 py-2 rounded">
//           Sign out (Local)
//         </button>
//         <button onClick={signOutRedirect} className="bg-red-600 text-white px-4 py-2 rounded">
//           Sign out (Cognito)
//         </button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState, useEffect } from "react";

// type Task = {
//   id: number;
//   title: string;
//   description: string;
//   status: "Pending" | "In Progress" | "Completed";
// };

// export default function AdminPage() {
//   const [tasks, setTasks] = useState<Task[]>([
//     { id: 1, title: "Fix bug #123", description: "Fix the login bug", status: "Pending" },
//     { id: 2, title: "Update docs", description: "Add new API docs", status: "In Progress" },
//     { id: 3, title: "Deploy update", description: "Deploy version 1.2", status: "Completed" },
//   ]);
//   const [filter, setFilter] = useState<string>("All");
//   const [notification, setNotification] = useState<string | null>(null);

//   // Filter tasks by status
//   const filteredTasks =
//     filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

//   // Helper to show notifications temporarily
//   const showNotification = (message: string) => {
//     setNotification(message);
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // Update task status handler
//   const handleStatusChange = (id: number, newStatus: Task["status"]) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task
//       )
//     );
//     showNotification(`Task #${id} status updated to "${newStatus}"`);
//   };

//   // Delete task handler
//   const handleDelete = (id: number) => {
//     setTasks((prev) => prev.filter((task) => task.id !== id));
//     showNotification(`Task #${id} deleted`);
//   };

//   // Add task example (optional)
//   const handleAddTask = () => {
//     const newTask: Task = {
//       id: tasks.length + 1,
//       title: `New Task #${tasks.length + 1}`,
//       description: "New task description",
//       status: "Pending",
//     };
//     setTasks((prev) => [...prev, newTask]);
//     showNotification(`Task #${newTask.id} created`);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
//       <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

//       {/* Notification */}
//       {notification && (
//         <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{notification}</div>
//       )}

//       {/* Filter */}
//       <div className="mb-4 flex items-center gap-3">
//         <label htmlFor="filter" className="font-semibold">
//           Filter by Status:
//         </label>
//         <select
//           id="filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="All">All</option>
//           <option value="Pending">Pending</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//         </select>
//         <button
//           onClick={handleAddTask}
//           className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
//         >
//           Add Task
//         </button>
//       </div>

//       {/* Task List */}
//       <ul>
//         {filteredTasks.length === 0 && (
//           <li className="text-gray-600">No tasks found for selected filter.</li>
//         )}
//         {filteredTasks.map((task) => (
//           <li
//             key={task.id}
//             className="mb-4 p-4 border rounded flex flex-col sm:flex-row sm:items-center sm:justify-between"
//           >
//             <div>
//               <h2 className="font-semibold text-lg">{task.title}</h2>
//               <p className="text-gray-700">{task.description}</p>
//             </div>

//             <div className="mt-3 sm:mt-0 flex items-center gap-3">
//               {/* Status selector */}
//               <select
//                 value={task.status}
//                 onChange={(e) =>
//                   handleStatusChange(task.id, e.target.value as Task["status"])
//                 }
//                 className="border px-2 py-1 rounded"
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>

//               {/* Delete button */}
//               <button
//                 onClick={() => handleDelete(task.id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
//                 aria-label={`Delete task ${task.title}`}
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



