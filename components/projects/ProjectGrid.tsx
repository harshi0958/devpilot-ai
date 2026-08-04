"use client";

import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Running" | "Building" | "Testing" | "Completed";
  progress: number;
  members: number;
  agents: number;
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({
  projects,
}: ProjectGridProps) {
  return (
    <section className="mt-8">
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            name={project.name}
            description={project.description}
            status={project.status}
            progress={project.progress}
            updated="Recently"
            members={project.members}
            agents={project.agents}
          />
        ))}
      </div>
    </section>
  );
}