export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  status:
    | "Todo"
    | "In Progress"
    | "Review"
    | "Done";

    dueDate: string;
};

export const tasks: Task[] = [
  {
    id: "1",
    title: "Design Dashboard UI",
    description: "Create modern dashboard layout.",
    priority: "High",
    assignee: "Harshit",
    status: "Todo",
    dueDate: "2026-08-15",
  },

  {
    id: "2",
    title: "Build AI Chat",
    description: "Integrate Gemini API.",
    priority: "Medium",
    assignee: "Harshit",
    status: "In Progress",
    dueDate: "2026-08-18",
  },

  {
    id: "3",
    title: "Deploy Backend",
    description: "Deploy Node server on Render.",
    priority: "High",
    assignee: "DevPilot AI",
    status: "Review",
    dueDate: "2026-08-10",
  },

  {
    id: "4",
    title: "Repository Cleanup",
    description: "Optimize project structure.",
    priority: "Low",
    assignee: "Harshit",
    status: "Done",
    dueDate: "2026-08-20",
  },
];