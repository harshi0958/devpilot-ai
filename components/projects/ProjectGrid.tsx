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

  github: string;
  deployment: string;
  
}

interface ProjectGridProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (project: Project) => void;
  onArchive: (id: string) => void;
}

export default function ProjectGrid({
  projects,
  onDelete,
  onEdit,
  onDuplicate,
  onArchive,
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
            github={project.github}
            deployment={project.deployment}
            onDelete={onDelete}
            onEdit={() => onEdit(project)}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
          />
        ))}
      </div>
    </section>
  );
}