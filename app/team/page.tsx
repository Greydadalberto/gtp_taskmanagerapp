'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { fetchTasks, updateTaskStatus } from '@/utils/api'; // Import your helpers

type Task = {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

export default function TeamPage() {
  const auth = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/');
    } else {
      const groups = auth.user?.profile['cognito:groups'];
      if (groups?.includes('admingroup')) {
        router.push('/admin');
      }
    }
  }, [auth.isAuthenticated, router]);

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

  // New sign out function that redirects to Cognito logout endpoint
  const signOutRedirect = () => {
    const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8n'; // your Cognito app client ID
    const logoutUri = 'http://localhost:3000/logged-out'; // must be in your Cognito sign out URLs
    const cognitoDomain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com'; // your Cognito domain

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Team Member Dashboard</h1>

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
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-gray-600">{task.status}</p>
            </div>
            <div>
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
            </div>
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




