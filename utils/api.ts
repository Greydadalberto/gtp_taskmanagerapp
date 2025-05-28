export async function createTask(task: {
  title: string;
  assignedTo: string;
  status?: string;
}) {
  const response = await fetch(
    "https://ove9nhz46c.execute-api.eu-north-1.amazonaws.com/default/createTask",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Failed to create task");
  }

  return response.json();
}
