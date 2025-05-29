'use client';

import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Task = {
  taskId: string;
  title: string;
  assignedTo: string;
  createdAt: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

const API_URL = 'https://24dqfshmrh.execute-api.eu-north-1.amazonaws.com/dev/get-tasks';

export default function AdminPage() {
  const auth = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'All' | Task['status']>('All');
  const [notification, setNotification] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch tasks from API Gateway
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here if your API needs authentication
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Assuming your Lambda returns { tasks: [...] }
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
      if (!groups || !groups.includes('admingroup')) {
        router.push('/team');
      } else {
        fetchTasks();
      }
    }
  }, [auth.isAuthenticated]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignedTo.trim()) return;

    const newTask: Task = {
      taskId: crypto.randomUUID(),
      title: newTitle.trim(),
      assignedTo: newAssignedTo.trim(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    setTasks((prev) => [...prev, newTask]);
    showNotification(`Task "${newTask.title}" created for ${newTask.assignedTo}.`);
    setNewTitle('');
    setNewAssignedTo('');
  };

  const updateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.taskId === taskId ? { ...task, status: newStatus } : task
      )
    );
    showNotification(`Task updated to ${newStatus}.`);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
    showNotification(`Task deleted.`);
  };

  const handleCognitoLogout = () => {
    const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8';
    const logoutUri = 'http://localhost:3000';
    const domain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com';
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const filteredTasks =
    filter === 'All' ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Notification */}
      {notification && (
        <div className="mb-4 bg-green-100 text-green-800 p-3 rounded shadow">
          {notification}
        </div>
      )}

      {/* Task Form */}
      <form onSubmit={addTask} className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task title"
          className="border rounded px-4 py-2 flex-1"
        />
        <input
          type="text"
          value={newAssignedTo}
          onChange={(e) => setNewAssignedTo(e.target.value)}
          placeholder="Assign to"
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add Task
        </button>
      </form>

      {/* Filter */}
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

      {/* Task List */}
      <ul className="space-y-4">
        {filteredTasks.length === 0 && (
          <li className="text-gray-500">No tasks available.</li>
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
              <p className="text-sm text-gray-500">ID: {task.taskId}</p>
              <p className="text-sm font-medium text-blue-700">Status: {task.status}</p>
            </div>
            <div className="flex gap-2 items-center">
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
              <button
                onClick={() => deleteTask(task.taskId)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Sign Out */}
      <div className="mt-8 flex gap-4">
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


