'use client';

import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Task = {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  createdAt: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};

const API_BASE = 'https://24dqfshmrh.execute-api.eu-north-1.amazonaws.com/dev';

export default function AdminPage() {
  const auth = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'All' | Task['status']>('All');
  const [notification, setNotification] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const accessToken = auth.user?.access_token;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/get-tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tasks.');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      showNotification('Failed to load tasks.');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newAssignedTo || !newDeadline) return;

    const task: Task = {
      taskId: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      assignedTo: newAssignedTo.trim(),
      createdAt: new Date().toISOString(),
      deadline: newDeadline,
      status: 'Pending',
    };

    try {
      const response = await fetch(`${API_BASE}/create-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error('Failed to create task.');
      setTasks(prev => [...prev, task]);

      setNewTitle('');
      setNewDescription('');
      setNewAssignedTo('');
      setNewDeadline('');
      showNotification(`Task "${task.title}" assigned to ${task.assignedTo}.`);
    } catch (err) {
      console.error(err);
      showNotification('Error creating task.');
    }
  };

  const updateStatus = async (taskId: string, status: Task['status']) => {
    const task = tasks.find(t => t.taskId === taskId);
    if (!task) return;

    const updated = { ...task, status };

    try {
      const response = await fetch(`${API_BASE}/update-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updated),
      });

      if (!response.ok) throw new Error('Failed to update task.');
      setTasks(prev => prev.map(t => (t.taskId === taskId ? updated : t)));
      showNotification(`Task updated to ${status}.`);
    } catch (err) {
      console.error(err);
      showNotification('Error updating task.');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE}/delete-task`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) throw new Error('Failed to delete task.');
      setTasks(prev => prev.filter(t => t.taskId !== taskId));
      showNotification('Task deleted.');
    } catch (err) {
      console.error(err);
      showNotification('Error deleting task.');
    }
  };

  const handleCognitoLogout = () => {
    const clientId = '4fi4lbbl6t3oo8cs5jcsug9v8';
    const logoutUri = 'http://localhost:3000';
    const domain = 'https://eu-north-1cxxydnnmg.auth.eu-north-1.amazoncognito.com';
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/');
    } else {
      const groups = auth.user?.profile['cognito:groups'];
      if (!groups?.includes('admingroup')) {
        router.push('/team');
      } else {
        fetchTasks();
      }
    }
  }, [auth.isAuthenticated]);

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {notification && (
        <div className="mb-4 bg-green-100 text-green-800 p-3 rounded">{notification}</div>
      )}

      <form onSubmit={addTask} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Task title"
          className="border px-4 py-2 rounded"
        />
        <input
          value={newAssignedTo}
          onChange={e => setNewAssignedTo(e.target.value)}
          placeholder="Assign to (email)"
          className="border px-4 py-2 rounded"
        />
        <input
          value={newDeadline}
          onChange={e => setNewDeadline(e.target.value)}
          type="date"
          className="border px-4 py-2 rounded"
        />
        <textarea
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          placeholder="Task description"
          className="border px-4 py-2 rounded md:col-span-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 md:col-span-2">
          Add Task
        </button>
      </form>

      <select
        value={filter}
        onChange={e => setFilter(e.target.value as any)}
        className="mb-6 border px-3 py-2 rounded"
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <ul className="space-y-4">
        {filteredTasks.length === 0 ? (
          <li className="text-gray-500">No tasks found.</li>
        ) : (
          filteredTasks.map(task => (
            <li
              key={task.taskId}
              className="border rounded p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-lg">{task.title}</p>
                <p className="text-sm">Description: {task.description}</p>
                <p className="text-sm">Assigned to: {task.assignedTo}</p>
                <p className="text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                <p className="text-sm">Created: {new Date(task.createdAt).toLocaleString()}</p>
                <p className="text-sm">Status: {task.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={e => updateStatus(task.taskId, e.target.value as Task['status'])}
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
          ))
        )}
      </ul>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => auth.removeUser()}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Sign Out (Local)
        </button>
        <button
          onClick={handleCognitoLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out (Cognito)
        </button>
      </div>
    </main>
  );
}







