"use client";

import Image from "next/image";

const projects = [
  { id: 1, name: "Villa Serenity", category: "Residential", location: "Bali", year: "2025", status: "completed", images: 24, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=60" },
  { id: 2, name: "The Loft Kitchen", category: "Interior", location: "Jakarta", year: "2025", status: "completed", images: 18, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=60" },
  { id: 3, name: "Azure Living Room", category: "Interior", location: "Bandung", year: "2025", status: "in-progress", images: 12, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=60" },
  { id: 4, name: "Casa Moderna", category: "Residential", location: "Surabaya", year: "2024", status: "completed", images: 31, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=60" },
  { id: 5, name: "Zen Retreat", category: "Hospitality", location: "Yogyakarta", year: "2024", status: "completed", images: 27, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=60" },
  { id: 6, name: "Brutalist Studio", category: "Commercial", location: "Jakarta", year: "2024", status: "in-progress", images: 8, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=60" },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  "in-progress": "bg-blue-500/20 text-blue-400",
  draft: "bg-zinc-700 text-zinc-400",
};

export default function ProjectsManagement() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Project Management</h1>
        <button className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="relative aspect-video">
              <Image src={project.image} alt={project.name} fill className="object-cover" unoptimized />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{project.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[project.status]}`}>
                  {project.status.replace("-", " ")}
                </span>
              </div>
              <div className="space-y-1 text-sm text-zinc-400">
                <p>{project.category} &middot; {project.location}</p>
                <p>{project.year} &middot; {project.images} photos</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  Manage Photos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
