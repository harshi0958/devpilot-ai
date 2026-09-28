"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Code2,
  Database,
  FileText,
  GitBranch,
  Lock,
  Rocket,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const sections = [
  {
    id: "getting-started",
    icon: BookOpen,
    title: "Getting Started",
    description:
      "Learn how to create an account, create a project and start using DevPilot AI.",
  },
  {
    id: "agents",
    icon: Bot,
    title: "AI Agents",
    description:
      "Understand how specialized AI agents help with architecture, development, testing and documentation.",
  },
  {
    id: "projects",
    icon: Workflow,
    title: "Projects",
    description:
      "Create and manage software projects inside your DevPilot AI workspace.",
  },
  {
    id: "architecture",
    icon: Server,
    title: "Architecture",
    description:
      "Understand the frontend, backend, database and AI service architecture.",
  },
  {
    id: "security",
    icon: Lock,
    title: "Security",
    description:
      "Learn how authentication, protected APIs and secure sessions are handled.",
  },
  {
    id: "api",
    icon: Code2,
    title: "API Reference",
    description:
      "Explore the main backend API endpoints used by DevPilot AI.",
  },
];

const agents = [
  {
    name: "Architect Agent",
    description:
      "Designs software architecture, components, databases and technical workflows.",
    icon: Server,
  },
  {
    name: "Developer Agent",
    description:
      "Helps implement features, APIs, components and backend logic.",
    icon: Code2,
  },
  {
    name: "UI/UX Agent",
    description:
      "Creates modern and user-friendly interface recommendations.",
    icon: Workflow,
  },
  {
    name: "Debugger Agent",
    description:
      "Analyzes errors and identifies root causes with technical fixes.",
    icon: ShieldCheck,
  },
  {
    name: "Testing Agent",
    description:
      "Creates testing strategies, test cases and quality assurance recommendations.",
    icon: Bot,
  },
  {
    name: "Documentation Agent",
    description:
      "Creates clear technical documentation for software projects.",
    icon: FileText,
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-slate-300 transition hover:text-cyan-400"
          >
            <ArrowLeft size={18} />

            <span>Back to DevPilot AI</span>
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-black transition hover:bg-cyan-400"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
              <BookOpen size={16} />
              DevPilot AI Documentation
            </div>

            <h1 className="mt-7 text-5xl font-bold tracking-tight md:text-6xl">
              Build software with
              <span className="bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                {" "}
                Autonomous AI Agents
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
              Learn how DevPilot AI works, how to create projects, how AI
              agents collaborate and how the platform manages software
              engineering workflows.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                href="https://github.com"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-cyan-500/40 hover:bg-white/10"
              >
                <GitBranch size={18} />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Navigation */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group rounded-2xl border border-white/10 bg-[#0B1220] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-[#0D1626]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition group-hover:scale-105">
                  <Icon size={23} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-white">
                  {section.title}
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  {section.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm text-cyan-400">
                  Read documentation
                  <ArrowRight size={16} />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Getting Started */}
      <section
        id="getting-started"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            icon={<BookOpen size={24} />}
            title="Getting Started"
            description="Start using DevPilot AI in a few simple steps."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Create an Account"
              description="Register on DevPilot AI and sign in to your workspace."
            />

            <Step
              number="02"
              title="Create a Project"
              description="Create a project and provide its name and description."
            />

            <Step
              number="03"
              title="Run an AI Agent"
              description="Select an AI agent, provide your task and receive an AI-generated response."
            />
          </div>
        </div>
      </section>

      {/* Agents */}
      <section
        id="agents"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            icon={<Bot size={24} />}
            title="AI Agents"
            description="DevPilot AI uses specialized agents for different software engineering tasks."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => {
              const Icon = agent.icon;

              return (
                <div
                  key={agent.name}
                  className="rounded-2xl border border-white/10 bg-[#0B1220] p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {agent.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {agent.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            icon={<Workflow size={24} />}
            title="Projects"
            description="Projects provide an isolated workspace for your software development tasks."
          />

          <div className="mt-10 rounded-3xl border border-white/10 bg-[#0B1220] p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <InfoCard
                icon={<Database size={20} />}
                title="Project Data"
                text="Project name, description, slug and ownership are stored in PostgreSQL."
              />

              <InfoCard
                icon={<Bot size={20} />}
                title="AI Execution"
                text="AI agent executions can be associated with a project for tracking and history."
              />

              <InfoCard
                icon={<FileText size={20} />}
                title="Project Files"
                text="The workspace is designed to support project file management."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section
        id="architecture"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            icon={<Server size={24} />}
            title="System Architecture"
            description="DevPilot AI follows a modern full-stack architecture."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ArchitectureCard
              title="Frontend"
              items={[
                "Next.js",
                "React",
                "TypeScript",
                "Tailwind CSS",
                "shadcn/ui",
              ]}
            />

            <ArchitectureCard
              title="Backend"
              items={[
                "Node.js",
                "Express",
                "TypeScript",
                "REST APIs",
              ]}
            />

            <ArchitectureCard
              title="Database"
              items={[
                "PostgreSQL",
                "Prisma ORM",
                "Projects",
                "Users",
                "AI Executions",
              ]}
            />

            <ArchitectureCard
              title="AI Layer"
              items={[
                "Gemini API",
                "Specialized Agents",
                "AI Execution",
                "Response Storage",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            icon={<Lock size={24} />}
            title="Security"
            description="Authentication and API access are protected using server-side validation."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={<Lock size={20} />}
              title="JWT Authentication"
              text="Authenticated sessions use JWT-based authentication."
            />

            <InfoCard
              icon={<ShieldCheck size={20} />}
              title="Protected APIs"
              text="Protected backend routes verify the authenticated user before accessing private resources."
            />

            <InfoCard
              icon={<Database size={20} />}
              title="Ownership"
              text="Project resources are associated with their owner to prevent unauthorized access."
            />
          </div>
        </div>
      </section>

      {/* API */}
      <section
        id="api"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeading
            icon={<Code2 size={24} />}
            title="API Reference"
            description="Main backend endpoints used by the DevPilot AI application."
          />

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]">
            <ApiRow
              method="GET"
              endpoint="/api/projects"
              description="Get the authenticated user's projects."
            />

            <ApiRow
              method="POST"
              endpoint="/api/projects"
              description="Create a new project."
            />

            <ApiRow
              method="GET"
              endpoint="/api/agents"
              description="Get available AI agents."
            />

            <ApiRow
              method="POST"
              endpoint="/api/agents/:id/execute"
              description="Execute an AI agent with a user prompt."
            />

            <ApiRow
              method="GET"
              endpoint="/api/auth/me"
              description="Get the currently authenticated user."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Rocket size={30} />
          </div>

          <h2 className="mt-7 text-4xl font-bold">
            Ready to build with DevPilot AI?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Create your account, start a project and let your AI engineering
            team help you build software.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-3 font-semibold text-black transition hover:bg-cyan-400"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 DevPilot AI. All rights reserved.</p>

          <div className="flex gap-6">
            <Link
              href="/"
              className="transition hover:text-cyan-400"
            >
              Home
            </Link>

            <Link
              href="/pricing"
              className="transition hover:text-cyan-400"
            >
              Pricing
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-cyan-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 text-cyan-400">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
          {icon}
        </div>

        <span className="text-sm font-semibold uppercase tracking-wider">
          Documentation
        </span>
      </div>

      <h2 className="mt-5 text-4xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-4 text-lg leading-8 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-7">
      <span className="text-sm font-bold text-cyan-400">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101827] p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function ArchitectureCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-6">
      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-sm text-slate-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ApiRow({
  method,
  endpoint,
  description,
}: {
  method: string;
  endpoint: string;
  description: string;
}) {
  return (
    <div className="grid gap-3 border-b border-white/10 p-5 last:border-b-0 md:grid-cols-[100px_300px_1fr] md:items-center">
      <span className="w-fit rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
        {method}
      </span>

      <code className="text-sm text-white">
        {endpoint}
      </code>

      <p className="text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
}