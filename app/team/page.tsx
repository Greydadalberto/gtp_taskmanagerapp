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

export default function TeamPage() {
  const auth = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [notification, setNotification] = useState<string | null>(null);

  const userEmail = auth.user?.profile?.email || '';

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/');
    } else {
      const groups = auth.user?.profile['cognito:groups'];
      if (groups?.includes('admingroup')) {
        router.push('/admin');
      }

      // TODO: Fetch tasks from your backend or DynamoDB
      // Here’s sample data with assignedTo info:
      setTasks([
        {
          taskId: '1',
          title: 'Fix login bug',
          assignedTo: 'alice@example.com',
          createdAt: new Date().toISOString(),
          status: 'Pending',
        },
        {
          taskId: '2',
          title: 'Update landing page',
          assignedTo: 'bob@example.com',
          createdAt: new Date().toISOString(),
          status: 'In Progress',
        },
        {
          taskId: '3',
          title: 'Write unit tests',
          assignedTo: userEmail, // current user assigned this task
          createdAt: new Date().toISOString(),
          status: 'Pending',
        },
      ]);
    }
  }, [auth.isAuthenticated, router, userEmail]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Team member can only see tasks assigned to them:
  const visibleTasks = tasks.filter((task) => task.assignedTo === userEmail);

  // Apply status filter:
  const filteredTasks =
    filter === 'All'
      ? visibleTasks
      : visibleTasks.filter((task) => task.status === filter);

  const updateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.taskId === taskId ? { ...task, status: newStatus } : task
      )
    );
    showNotification(`Task status updated to "${newStatus}"`);
    // TODO: Update status in your backend/DynamoDB here
  };

  const signOutRedirect = () => {
    const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8n';
    const logoutUri = 'http://localhost:3000/logged-out';
    const cognitoDomain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com';
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Team Member Dashboard</h1>

      {notification && (
        <div className="mb-4 bg-green-100 text-green-800 p-3 rounded shadow">
          {notification}
        </div>
      )}

      <div className="mb-4 flex justify-end">
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
        {filteredTasks.length === 0 && (
          <li className="text-gray-500">No tasks assigned to you.</li>
        )}

        {filteredTasks.map((task) => (
          <li
            key={task.taskId}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-lg">{task.title}</p>
              <p className="text-sm text-gray-600">
                Assigned to: <span className="font-semibold">{task.assignedTo}</span>
              </p>
              <p className="text-sm text-gray-600">Status: {task.status}</p>
              <p className="text-xs text-gray-500">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Task ID: {task.taskId}</p>
            </div>

            <select
              className="border px-2 py-1 rounded"
              value={task.status}
              onChange={(e) =>
                updateStatus(task.taskId, e.target.value as Task['status'])
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </li>
        ))}
      </ul>

      <button
        onClick={signOutRedirect}
        className="mt-8 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
      >
        Sign Out
      </button>
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

//       // TODO: Fetch tasks assigned to this user from your backend or DynamoDB here
//       // For now, example placeholder tasks:
//       setTasks([
//         {
//           taskId: '1',
//           title: 'Example Task 1',
//           assignedTo: userEmail,
//           createdAt: new Date().toISOString(),
//           status: 'Pending',
//         },
//         {
//           taskId: '2',
//           title: 'Example Task 2',
//           assignedTo: userEmail,
//           createdAt: new Date().toISOString(),
//           status: 'In Progress',
//         },
//       ]);
//     }
//   }, [auth.isAuthenticated, router, userEmail]);

//   const showNotification = (message: string) => {
//     setNotification(message);
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const updateStatus = (taskId: string, newStatus: Task['status']) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.taskId === taskId ? { ...task, status: newStatus } : task
//       )
//     );
//     showNotification(`Task status updated to "${newStatus}"`);
//     // TODO: Also send update to backend/DynamoDB here to persist change
//   };

//   const filteredTasks =
//     filter === 'All'
//       ? tasks
//       : tasks.filter((task) => task.status === filter);

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
//         {filteredTasks.map((task) => (
//           <li
//             key={task.taskId}
//             className="p-4 border rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium text-lg">{task.title}</p>
//               <p className="text-sm text-gray-600">Status: {task.status}</p>
//               <p className="text-xs text-gray-500">Created: {new Date(task.createdAt).toLocaleString()}</p>
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
//         {filteredTasks.length === 0 && (
//           <li className="text-gray-500">No tasks assigned to you.</li>
//         )}
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


// 'use client';

// import { useAuth } from 'react-oidc-context';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// // import { fetchTasks, updateTaskStatus } from '@/utils/api'; // Import your helpers

// type Task = {
//   id: string;
//   title: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
// };

// export default function TeamPage() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState<string>('All');

//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       router.push('/');
//     } else {
//       const groups = auth.user?.profile['cognito:groups'];
//       if (groups?.includes('admingroup')) {
//         router.push('/admin');
//       }
//     }
//   }, [auth.isAuthenticated, router]);

//   const filteredTasks =
//     filter === 'All'
//       ? tasks
//       : tasks.filter((task) => task.status === filter);

//   const updateStatus = (id: string, newStatus: Task['status']) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task
//       )
//     );
//     alert(`Task ${id} updated to ${newStatus}`);
//   };

//   // New sign out function that redirects to Cognito logout endpoint
//   const signOutRedirect = () => {
//     const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8n'; // your Cognito app client ID
//     const logoutUri = 'http://localhost:3000/logged-out'; // must be in your Cognito sign out URLs
//     const cognitoDomain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com'; // your Cognito domain

//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   return (
//     <main className="p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Team Member Dashboard</h1>

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
//         {filteredTasks.map((task) => (
//           <li
//             key={task.id}
//             className="p-4 border rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{task.title}</p>
//               <p className="text-sm text-gray-600">{task.status}</p>
//             </div>
//             <div>
//               <select
//                 className="border px-2 py-1 rounded"
//                 value={task.status}
//                 onChange={(e) =>
//                   updateStatus(task.id, e.target.value as Task['status'])
//                 }
//               >
//                 <option>Pending</option>
//                 <option>In Progress</option>
//                 <option>Completed</option>
//               </select>
//             </div>
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


// app/team/page.tsx
// 'use client';

// import { useAuth } from 'react-oidc-context';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { fetchTasks, updateTaskStatus } from '@/utils/api'; // Import your helpers

// type Task = {
//   id: string;
//   title: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
// };

// export default function TeamPage() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState<string>('All');

//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       router.push('/');
//     } else {
//       const groups = auth.user?.profile['cognito:groups'];
//       if (groups?.includes('admingroup')) {
//         router.push('/admin');
//       } else {
//         // Use imported API function
//         fetchTasks(auth.user?.access_token!)
//           .then(setTasks)
//           .catch((error) => {
//             console.error(error);
//             alert('Failed to load tasks');
//           });
//       }
//     }
//   }, [auth.isAuthenticated, router]);

//   const handleUpdateStatus = async (id: string, newStatus: Task['status']) => {
//     try {
//       await updateTaskStatus(id, newStatus, auth.user?.access_token!);
//       setTasks((prev) =>
//         prev.map((task) =>
//           task.id === id ? { ...task, status: newStatus } : task
//         )
//       );
//     } catch (error) {
//       console.error(error);
//       alert('Failed to update task');
//     }
//   };

//   const filteredTasks =
//     filter === 'All' ? tasks : tasks.filter((task) => task.status === filter);

//   return (
//     <main className="p-8 max-w-3xl mx-auto">
//       {/* ... UI code ... */}
//       {filteredTasks.map((task) => (
//         <li key={task.id}>
//           <select
//             value={task.status}
//             onChange={(e) =>
//               handleUpdateStatus(task.id, e.target.value as Task['status'])
//             }
//           >
//             <option>Pending</option>
//             <option>In Progress</option>
//             <option>Completed</option>
//           </select>
//         </li>
//       ))}
//     </main>
//   );
// }





// 
// 'use client';

// import { useAuth } from 'react-oidc-context';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// type Task = {
//   id: string;
//   title: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
// };

// export default function TeamPage() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState<string>('All');

//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       router.push('/');
//     } else {
//       const groups = auth.user?.profile['cognito:groups'];
//       if (groups?.includes('admingroup')) {
//         router.push('/admin');
//       }
//     }
//   }, [auth.isAuthenticated]);

//   const filteredTasks =
//     filter === 'All'
//       ? tasks
//       : tasks.filter((task) => task.status === filter);

//   const updateStatus = (id: string, newStatus: Task['status']) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task
//       )
//     );
//     alert(`Task ${id} updated to ${newStatus}`);
//   };

//   return (
//     <main className="p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Team Member Dashboard</h1>

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
//         {filteredTasks.map((task) => (
//           <li
//             key={task.id}
//             className="p-4 border rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{task.title}</p>
//               <p className="text-sm text-gray-600">{task.status}</p>
//             </div>
//             <div>
//               <select
//                 className="border px-2 py-1 rounded"
//                 value={task.status}
//                 onChange={(e) =>
//                   updateStatus(task.id, e.target.value as Task['status'])
//                 }
//               >
//                 <option>Pending</option>
//                 <option>In Progress</option>
//                 <option>Completed</option>
//               </select>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <button
//         onClick={() => auth.signoutRedirect()}
//         className="mt-8 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
//       >
//         Sign Out
//       </button>
//     </main>
//   );
// }




