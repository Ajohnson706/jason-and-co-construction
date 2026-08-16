"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Project = {
  title: string;
  category: "Bathrooms" | "Flooring" | "Interiors";
  image: string;
  alt: string;
  position?: string;
};

const projects: Project[] = [
  { title: "Freestanding bath suite", category: "Bathrooms", image: "/images/hero-bathroom.webp", alt: "Completed bathroom with a freestanding tub and tiled walk-in shower" },
  { title: "Marble-look tile floor", category: "Flooring", image: "/images/marble-tile.webp", alt: "Polished marble-look tile flooring in a finished dining room" },
  { title: "Refinished hardwood", category: "Flooring", image: "/images/hardwood-finish.webp", alt: "Richly finished hardwood floor reflecting natural light" },
  { title: "Herringbone sunroom", category: "Flooring", image: "/images/sunroom-herringbone.webp", alt: "Finished herringbone tile floor in a screened sunroom" },
  { title: "Restored brick fireplace", category: "Interiors", image: "/images/brick-fireplace.webp", alt: "Brick fireplace with bright white trim and a refinished hearth" },
  { title: "Custom shower floor", category: "Bathrooms", image: "/images/shower-tile.webp", alt: "Completed shower base with patterned mosaic tile and a square drain" },
  { title: "Built-in cabinetry", category: "Interiors", image: "/images/custom-cabinetry.webp", alt: "Custom unfinished wood cabinets being fitted in an interior renovation" },
  { title: "Clean-lined vanity", category: "Bathrooms", image: "/images/bathroom-vanity.webp", alt: "Completed white bathroom vanity with marble-look top", position: "center 62%" },
];

const filters = ["All", "Bathrooms", "Flooring", "Interiors"] as const;

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectedProject]);

  const visibleProjects = projects.filter(
    (project) => activeFilter === "All" || project.category === activeFilter,
  );

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Jason and Company Construction home">
          <span className="brand-mark">J&amp;Co.</span>
          <span className="brand-name">Jason &amp; Co. Construction</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#work">Selected work</a>
          <a href="#approach">Approach</a>
        </nav>
        <a className="header-cta" href="#contact">Start a project</a>
      </header>

      <section className="hero" id="top">
        <Image className="hero-image" src="/images/hero-bathroom.webp" alt="A completed bathroom renovation with a freestanding tub and tiled shower" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">Interior remodeling · Tile · Flooring</p>
          <h1>Built for the way<br />you live.</h1>
          <p className="hero-copy">Thoughtful residential construction and finish work, completed with a sharp eye for the details that make a room feel right.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#work">View our work</a>
            <a className="text-link light-link" href="#contact">Discuss your project <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="hero-proof" aria-label="Project focus">
          <span>Residential</span><span>Detail-led</span><span>Start to finish</span>
        </div>
      </section>

      <section className="intro" id="approach">
        <div>
          <p className="eyebrow">The Jason &amp; Co. standard</p>
          <h2>Good work is built one careful decision at a time.</h2>
        </div>
        <div className="intro-copy">
          <p>Jason &amp; Co. Construction brings practical experience and considered craftsmanship to the spaces you use every day—from a precise tile layout to the last coat on a hardwood floor.</p>
          <a className="text-link" href="#services">Explore our capabilities <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-heading">
          <p className="eyebrow light">What we do</p>
          <h2>Craft, from the surface down.</h2>
        </div>
        <div className="service-list">
          <article><span>01</span><h3>Bathrooms &amp; tile</h3><p>Showers, floors, surrounds, waterproofing, fixtures, and finish details.</p></article>
          <article><span>02</span><h3>Floors &amp; finishes</h3><p>Hardwood, patterned layouts, surface preparation, trim, and refinishing.</p></article>
          <article><span>03</span><h3>Interior remodeling</h3><p>Room updates, drywall, paint, fireplace work, and coordinated finish carpentry.</p></article>
          <article><span>04</span><h3>Custom details</h3><p>Built-ins, cabinetry, transitions, and the tailored pieces that complete a space.</p></article>
        </div>
      </section>

      <section className="portfolio" id="work">
        <div className="portfolio-top">
          <div><p className="eyebrow">Selected work</p><h2>Spaces, finished with intention.</h2></div>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((filter) => (
              <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>
            ))}
          </div>
        </div>
        <div className="project-grid" aria-live="polite">
          {visibleProjects.map((project, index) => (
            <button className={`project-card project-card-${index % 5}`} key={project.title} onClick={() => setSelectedProject(project)} aria-label={`Open ${project.title} project image`}>
              <Image src={project.image} alt={project.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 40vw" style={{ objectPosition: project.position ?? "center" }} />
              <span className="project-overlay" />
              <span className="project-caption"><small>{project.category}</small><strong>{project.title}</strong></span>
              <span className="project-open" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="process">
        <div className="process-image-wrap"><Image src="/images/bathroom-suite.webp" alt="Tiled walk-in shower nearing completion" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
        <div className="process-content">
          <p className="eyebrow">How we work</p>
          <h2>Clear planning. Careful preparation. Clean execution.</h2>
          <ol>
            <li><span>01</span><div><h3>Understand the space</h3><p>Start with the room, the goal, and the details that matter to you.</p></div></li>
            <li><span>02</span><div><h3>Build the right foundation</h3><p>Plan the sequence and prepare every surface for a lasting result.</p></div></li>
            <li><span>03</span><div><h3>Finish with precision</h3><p>Carry the same level of care through installation and final details.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="contact" id="contact">
        <div><p className="eyebrow light">Start a conversation</p><h2>Have a space in mind?</h2><p>Let’s talk through what you want to change and what it will take to build it well.</p></div>
        <div className="contact-details">
          <div><span>Phone</span><strong>To be added for launch</strong></div>
          <div><span>Email</span><strong>To be added for launch</strong></div>
          <div><span>Service area</span><strong>To be added for launch</strong></div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">J&amp;Co.</span><span className="brand-name">Jason &amp; Co. Construction</span></div>
        <p>Residential construction &amp; interior remodeling.</p>
        <p>Demo edition · Contact details pending</p>
      </footer>

      {selectedProject && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selectedProject.title} onClick={() => setSelectedProject(null)}>
          <button className="lightbox-close" onClick={() => setSelectedProject(null)} aria-label="Close project image">Close ×</button>
          <div className="lightbox-image" onClick={(event) => event.stopPropagation()}>
            <Image src={selectedProject.image} alt={selectedProject.alt} fill sizes="90vw" />
            <div className="lightbox-caption"><span>{selectedProject.category}</span><strong>{selectedProject.title}</strong></div>
          </div>
        </div>
      )}
    </main>
  );
}
