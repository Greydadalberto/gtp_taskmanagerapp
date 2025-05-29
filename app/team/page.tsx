'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Task = {
  taskId: string;
  title: string;
  assignedTo: string;
  createdAt: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

const API_BASE = 'https://24dqfshmrh.execute-api.eu-north-1.amazonaws.com/dev';

export default function TeamPage() {
  const auth = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'All' | Task['status']>('All');
  const [notification, setNotification] = useState<string | null>(null);

  const userEmail = auth.user?.profile?.email || '';

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/get-tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification('Failed to load tasks.');
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/');
    } else {
      const groups = auth.user?.profile['cognito:groups'];
      if (groups?.includes('admingroup')) {
        router.push('/admin');
      } else {
        fetchTasks();
      }
    }
  }, [auth.isAuthenticated]);

  // Team member can only see tasks assigned to them:
  const visibleTasks = tasks.filter((task) => task.assignedTo === userEmail);

  // Apply status filter:
  const filteredTasks =
    filter === 'All'
      ? visibleTasks
      : visibleTasks.filter((task) => task.status === filter);

  const updateStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const taskToUpdate = tasks.find((t) => t.taskId === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, status: newStatus };

      const response = await fetch(`${API_BASE}/update-task`, {
        method: 'POST', // or PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId ? { ...task, status: newStatus } : task
        )
      );

      showNotification(`Task updated to ${newStatus}.`);
    } catch (error) {
      console.error('Error updating task:', error);
      showNotification('Failed to update task.');
    }
  };

  const handleCognitoLogout = () => {
    const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8';
    const logoutUri = 'http://localhost:3000';
    const domain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com';
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Team Dashboard</h1>

      {notification && (
        <div className="mb-4 bg-green-100 text-green-800 p-3 rounded shadow">
          {notification}
        </div>
      )}

      <div className="mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'All' | Task['status'])}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredTasks.length === 0 && (
          <li className="text-gray-500">No tasks assigned to you.</li>
        )}
        {filteredTasks.map((task) => (
          <li
            key={task.taskId}
            className="border rounded p-4 shadow flex flex-col md:flex-row justify-between md:items-center gap-4"
          >
            <div>
              <p className="font-semibold text-lg">{task.title}</p>
              <p className="text-sm text-gray-600">Assigned to: {task.assignedTo}</p>
              <p className="text-sm text-gray-600">Created: {new Date(task.createdAt).toLocaleString()}</p>
              <p className="text-sm font-medium text-blue-700">Status: {task.status}</p>
            </div>
            <div>
              <select
                value={task.status}
                onChange={(e) =>
                  updateStatus(task.taskId, e.target.value as Task['status'])
                }
                className="border rounded px-2 py-1"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <button
          onClick={() => auth.removeUser()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Sign Out (Local)
        </button>
        <button
          onClick={handleCognitoLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          Sign Out (Cognito)
        </button>
      </div>
    </main>
  );
}



// 'use client';

// import { useAuth } from 'react-oidc-context';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// type Task = {
//   taskId: string;
//   title: string;
//   assignedTo: string;
//   createdAt: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
// };

// export default function TeamPage() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState<string>('All');
//   const [notification, setNotification] = useState<string | null>(null);

//   const userEmail = auth.user?.profile?.email || '';

//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       router.push('/');
//     } else {
//       const groups = auth.user?.profile['cognito:groups'];
//       if (groups?.includes('admingroup')) {
//         router.push('/admin');
//       }

//       // TODO: Fetch tasks from your backend or DynamoDB
//       // Here’s sample data with assignedTo info:
//       setTasks([
//         {
//           taskId: '1',
//           title: 'Fix login bug',
//           assignedTo: 'alice@example.com',
//           createdAt: new Date().toISOString(),
//           status: 'Pending',
//         },
//         {
//           taskId: '2',
//           title: 'Update landing page',
//           assignedTo: 'bob@example.com',
//           createdAt: new Date().toISOString(),
//           status: 'In Progress',
//         },
//         {
//           taskId: '3',
//           title: 'Write unit tests',
//           assignedTo: userEmail, // current user assigned this task
//           createdAt: new Date().toISOString(),
//           status: 'Pending',
//         },
//       ]);
//     }
//   }, [auth.isAuthenticated, router, userEmail]);

//   const showNotification = (message: string) => {
//     setNotification(message);
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // Team member can only see tasks assigned to them:
//   const visibleTasks = tasks.filter((task) => task.assignedTo === userEmail);

//   // Apply status filter:
//   const filteredTasks =
//     filter === 'All'
//       ? visibleTasks
//       : visibleTasks.filter((task) => task.status === filter);

//   const updateStatus = (taskId: string, newStatus: Task['status']) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.taskId === taskId ? { ...task, status: newStatus } : task
//       )
//     );
//     showNotification(`Task status updated to "${newStatus}"`);
//     // TODO: Update status in your backend/DynamoDB here
//   };

//   const signOutRedirect = () => {
//     const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8n';
//     const logoutUri = 'http://localhost:3000/logged-out';
//     const cognitoDomain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com';
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   return (
//     <main className="p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Team Member Dashboard</h1>

//       {notification && (
//         <div className="mb-4 bg-green-100 text-green-800 p-3 rounded shadow">
//           {notification}
//         </div>
//       )}

//       <div className="mb-4 flex justify-end">
//         <select
//           className="border px-2 py-1 rounded"
//           onChange={(e) => setFilter(e.target.value)}
//           value={filter}
//         >
//           <option>All</option>
//           <option>Pending</option>
//           <option>In Progress</option>
//           <option>Completed</option>
//         </select>
//       </div>

//       <ul className="space-y-4">
//         {filteredTasks.length === 0 && (
//           <li className="text-gray-500">No tasks assigned to you.</li>
//         )}

//         {filteredTasks.map((task) => (
//           <li
//             key={task.taskId}
//             className="p-4 border rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium text-lg">{task.title}</p>
//               <p className="text-sm text-gray-600">
//                 Assigned to: <span className="font-semibold">{task.assignedTo}</span>
//               </p>
//               <p className="text-sm text-gray-600">Status: {task.status}</p>
//               <p className="text-xs text-gray-500">
//                 Created: {new Date(task.createdAt).toLocaleString()}
//               </p>
//               <p className="text-xs text-gray-500">Task ID: {task.taskId}</p>
//             </div>

//             <select
//               className="border px-2 py-1 rounded"
//               value={task.status}
//               onChange={(e) =>
//                 updateStatus(task.taskId, e.target.value as Task['status'])
//               }
//             >
//               <option>Pending</option>
//               <option>In Progress</option>
//               <option>Completed</option>
//             </select>
//           </li>
//         ))}
//       </ul>

//       <button
//         onClick={signOutRedirect}
//         className="mt-8 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
//       >
//         Sign Out
//       </button>
//     </main>
//   );
// }



