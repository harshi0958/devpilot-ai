export type Project = {
  id: string;
  name: string;
  description: string;
  status: "Running" | "Building" | "Testing" | "Completed";
  progress: number;

  members: number;
  agents: number;

  github: string;
  deployment: string;

  techStack: string[];
  agentsActive: number;
  membersOnline: number;
  files: number;
  tasks: number;
  pendingTasks: number;
  archived?: boolean;
};


export const projects: Project[] = [
  {
    id: "devpilot-ai",
    name: "DevPilot AI",
    description: "AI-powered autonomous software development workspace.",
    status: "Running",
    progress: 82,
    members: 6,
    agents: 5,
    github: "https://github.com/harshi0958/devpilot-ai",
    deployment: "",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    agentsActive: 5,
membersOnline: 6,
files: 214,
tasks: 48,
pendingTasks: 7,
archived: false,
  },

  {
    id: "trustfi",
    name: "TrustFi",
    description: "Privacy-preserving DeFi lending platform using FHE.",
    status: "Building",
    progress: 68,
    members: 4,
    agents: 3,
    github: "https://github.com/harshi0958/TrustFi",
    deployment: "https://trust-fi.vercel.app",
    techStack: [
      "Next.js",
      "Fhenix",
      "Solidity",
      "TypeScript",
    ],
    agentsActive: 3,
membersOnline: 4,
files: 96,
tasks: 27,
pendingTasks: 4,
archived: false,
  },

  {
    id: "passport-automation",
    name: "Passport Automation",
    description: "Government passport management system.",
    status: "Completed",
    progress: 100,
    members: 5,
    agents: 2,
    github: "https://github.com/harshi0958/Passport-management-system",
    deployment: "",
    techStack: ["Java", "MySQL", "Servlet"],
    agentsActive: 2,
membersOnline: 5,
files: 181,
tasks: 100,
pendingTasks: 0,
archived: false,
  },

  {
    id: "blockchain-voting",
    name: "Blockchain Voting",
    description: "Secure blockchain-based online voting platform.",
    status: "Testing",
    progress: 91,
    members: 3,
    agents: 4,
    github: "",
    deployment: "",
    techStack: ["Blockchain", "Java", "Spring Boot"],
    agentsActive: 4,
membersOnline: 3,
files: 142,
tasks: 56,
pendingTasks: 8,
archived: false,
  },

  {
    id: "ecommerce-platform",
    name: "E-Commerce Platform",
    description: "Modern AI-powered shopping platform.",
    status: "Running",
    progress: 74,
    members: 7,
    agents: 5,
    github: "",
    deployment: "",
    techStack: ["React", "Node.js", "MongoDB"],
    agentsActive: 5,
membersOnline: 7,
files: 301,
tasks: 73,
pendingTasks: 11,
archived: false,
  },

  {
    id: "crm-dashboard",
    name: "CRM Dashboard",
    description: "Enterprise customer relationship management.",
    status: "Building",
    progress: 45,
    members: 5,
    agents: 2,
    github: "",
    deployment: "",
    techStack: ["React", "Express", "PostgreSQL"],
    agentsActive: 2,
membersOnline: 5,
files: 87,
tasks: 39,
pendingTasks: 13,
archived: false,
  },
];