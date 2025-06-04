'use client';

import { useAuth } from 'react-oidc-context';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  createdAt: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  deadline?: string;
}

interface User {
  email: string;
  group: string;
}

export default function AdminPage() {
  const auth = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserGroup, setNewUserGroup] = useState('teamgroup');
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '' });
  const [notification, setNotification] = useState<string | null>(null);

  const API_BASE = 'https://24dqfshmrh.execute-api.eu-north-1.amazonaws.com/dev';

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/get-tasks`);
      const data = await response.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (e) {
      console.error('Fetch tasks error:', e);
      showNotification('Failed to fetch tasks.');
    }
  }, [showNotification]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/get-users`);
      const data = await response.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (e) {
      console.error('Fetch users error:', e);
      showNotification('Failed to fetch users.');
    }
  }, [showNotification]);

  const createUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserEmail, group: newUserGroup })
      });
      if (!response.ok) throw new Error('Create user failed');
      showNotification('User created successfully');
      setNewUserEmail('');
      fetchUsers();
    } catch (e) {
      console.error('Create user error:', e);
      showNotification('Failed to create user.');
    }
  };

  const deleteUser = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE}/delete-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Delete user failed');
      showNotification('User deleted');
      fetchUsers();
    } catch (e) {
      console.error('Delete user error:', e);
      showNotification('Failed to delete user.');
    }
  };

  const createTask = async () => {
    try {
      const response = await fetch(`${API_BASE}/create-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Create task failed');
      showNotification('Task created');
      setNewTask({ title: '', description: '', assignedTo: '', deadline: '' });
      fetchTasks();
    } catch (e) {
      console.error('Create task error:', e);
      showNotification('Failed to create task.');
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/');
    } else {
      fetchTasks();
      fetchUsers();
    }
  }, [auth.isAuthenticated, fetchTasks, fetchUsers, router]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {notification && (
        <div className="mb-4 bg-green-100 text-green-800 p-3 rounded">
          {notification}
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Create Task</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Assign to (email)"
            value={newTask.assignedTo}
            onChange={e => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
          <input
            type="datetime-local"
            value={newTask.deadline}
            onChange={e => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={createTask}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Create Task
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="User email"
            value={newUserEmail}
            onChange={e => setNewUserEmail(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <select
            value={newUserGroup}
            onChange={e => setNewUserGroup(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="teamgroup">Team</option>
            <option value="admingroup">Admin</option>
          </select>
          <button
            onClick={createUser}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Add User
          </button>
        </div>
        <ul>
          {users.map(user => (
            <li key={user.email} className="mb-2 flex justify-between border-b pb-2">
              <span>{user.email} ({user.group})</span>
              <button
                onClick={() => deleteUser(user.email)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">All Tasks</h2>
        <ul className="space-y-4">
          {tasks.map(task => (
            <li
              key={task.taskId}
              className="border rounded p-4 flex flex-col"
            >
              <p className="font-semibold text-lg">{task.title}</p>
              <p className="text-sm italic text-gray-600 mb-2">{task.description}</p>
              <p className="text-sm">Assigned to: {task.assignedTo}</p>
              <p className="text-sm">Created: {new Date(task.createdAt).toLocaleString()}</p>
              {task.deadline && (
                <p className="text-sm text-red-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
              )}
              <p className="text-sm font-medium mt-1">Status: {task.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


// 'use client';

// import { useAuth } from 'react-oidc-context';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// type Task = {
//   taskId: string;
//   title: string;
//   description: string;
//   assignedTo: string;
//   createdAt: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
//   deadline?: string;
// };

// export default function TeamPage() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filter, setFilter] = useState<'All' | Task['status']>('All');
//   const [notification, setNotification] = useState<string | null>(null);

//   const API_BASE = 'https://24dqfshmrh.execute-api.eu-north-1.amazonaws.com/dev';
//   const userEmail = auth.user?.profile?.email ?? '';

//   // Displays a notification temporarily
//   const showNotification = (msg: string) => {
//     setNotification(msg);
//     setTimeout(() => setNotification(null), 5000);
//   };

//   // Fetch and filter user tasks
//   const fetchTasks = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/get-tasks`);
//       const data = await response.json();

//       // Ensure data.tasks exists and is an array
//       const allTasks: Task[] = Array.isArray(data.tasks) ? data.tasks : [];

//       const userTasks = allTasks.filter(
//         task => task.assignedTo?.toLowerCase() === userEmail.toLowerCase()
//       );

//       setTasks(userTasks);

//       // Notify about tasks due in 24 hours
//       const now = new Date();
//       const soonTasks = userTasks.filter(task => {
//         if (!task.deadline) return false;
//         const deadline = new Date(task.deadline);
//         const timeDiff = deadline.getTime() - now.getTime();
//         return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
//       });

//       if (soonTasks.length > 0) {
//         showNotification(`You have ${soonTasks.length} task(s) due within 24 hours!`);
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       showNotification('Failed to fetch tasks.');
//     }
//   };

//   // Update task status
//   const updateStatus = async (taskId: string, status: Task['status']) => {
//     const task = tasks.find(t => t.taskId === taskId);
//     if (!task) return;

//     const updated = { ...task, status };

//     try {
//       const response = await fetch(`${API_BASE}/update-task`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updated),
//       });

//       if (!response.ok) throw new Error('Update failed');
//       setTasks(prev => prev.map(t => (t.taskId === taskId ? updated : t)));
//       showNotification(`Task "${task.title}" marked as "${status}"`);
//     } catch (err) {
//       console.error(err);
//       showNotification('Error updating task.');
//     }
//   };

//   // Handle auth and fetch
//   useEffect(() => {
//     if (!auth.isAuthenticated) {
//       router.push('/');
//     } else {
//       const groups = auth.user?.profile['cognito:groups'];
//       if (groups?.includes('admingroup')) {
//         router.push('/admin');
//       } else {
//         fetchTasks();
//       }
//     }
//   }, [auth.isAuthenticated]);

//   const filteredTasks =
//     filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

//   return (
//     <main className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">My Assigned Tasks</h1>

//       {notification && (
//         <div className="mb-4 bg-yellow-100 text-yellow-800 p-3 rounded">
//           {notification}
//         </div>
//       )}

//       <select
//         value={filter}
//         onChange={e => setFilter(e.target.value as Task['status'] | 'All')}
//         className="mb-6 border px-3 py-2 rounded"
//       >
//         <option value="All">All</option>
//         <option value="Pending">Pending</option>
//         <option value="In Progress">In Progress</option>
//         <option value="Completed">Completed</option>
//       </select>

//       <ul className="space-y-4">
//         {filteredTasks.length === 0 ? (
//           <li className="text-gray-500">No tasks found.</li>
//         ) : (
//           filteredTasks.map(task => (
//             <li
//               key={task.taskId}
//               className="border rounded p-4 flex flex-col md:flex-row justify-between gap-4"
//             >
//               <div className="flex-1">
//                 <p className="font-semibold text-lg">{task.title}</p>
//                 <p className="text-sm italic text-gray-600 mb-2">{task.description}</p>
//                 <p className="text-sm">Assigned to: {task.assignedTo}</p>
//                 <p className="text-sm">Created: {new Date(task.createdAt).toLocaleString()}</p>
//                 {task.deadline && (
//                   <p className="text-sm text-red-600">Deadline: {new Date(task.deadline).toLocaleString()}</p>
//                 )}
//                 <p className="text-sm font-medium mt-1">Status: {task.status}</p>
//               </div>

//               <div>
//                 <select
//                   value={task.status}
//                   onChange={e =>
//                     updateStatus(task.taskId, e.target.value as Task['status'])
//                   }
//                   className="border rounded px-2 py-1"
//                 >
//                   <option>Pending</option>
//                   <option>In Progress</option>
//                   <option>Completed</option>
//                 </select>
//               </div>
//             </li>
//           ))
//         )}
//       </ul>
//     </main>
//   );
// }





