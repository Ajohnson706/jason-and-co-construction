"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Project = {
  title: string;
  category: "Trim & Details" | "Cabinetry" | "Custom Woodwork";
  image: string;
  alt: string;
  position?: string;
};

const projects: Project[] = [
  { title: "Custom fireplace surround", category: "Trim & Details", image: "/images/fireplace-mantel.webp", alt: "Finished white fireplace mantel with detailed trim and brick surround" },
  { title: "New-construction cabinetry", category: "Cabinetry", image: "/images/custom-cabinet-build.webp", alt: "Custom raised-panel wood cabinetry being installed in a new interior" },
  { title: "Built-in cabinet installation", category: "Cabinetry", image: "/images/cabinet-installation.webp", alt: "Built-in wood cabinets and interior trim during installation" },
  { title: "Cabinet door detailing", category: "Custom Woodwork", image: "/images/cabinetry-detail.webp", alt: "Crafted wood cabinet doors with detailed raised panels" },
  { title: "Mantel and wall trim", category: "Trim & Details", image: "/images/fireplace-trim.webp", alt: "White fireplace mantel and coordinating interior trim" },
  { title: "Custom wood fabrication", category: "Custom Woodwork", image: "/images/woodwork-fabrication.webp", alt: "Custom wood components prepared for finish carpentry installation" },
  { title: "Fitted interior cabinetry", category: "Cabinetry", image: "/images/custom-cabinetry.webp", alt: "Custom unfinished wood cabinets fitted into an interior space" },
  { title: "Fireplace finish package", category: "Trim & Details", image: "/images/brick-fireplace.webp", alt: "Brick fireplace completed with bright white mantel and base trim" },
];

const filters = ["All", "Trim & Details", "Cabinetry", "Custom Woodwork"] as const;

const phoneDisplay = "(706) 496-5687";
const phoneLink = "+17064965687";
const email = "jasonandco.jason@gmail.com";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: "Jason & Co. Construction",
            url: "https://jasonandcoconstruction.com/",
            telephone: phoneLink,
            email,
            serviceType: [
              "Finish carpentry",
              "Interior trim installation",
              "Crown molding installation",
              "Baseboard installation",
              "Door and window casing",
              "Built-in cabinetry installation",
              "Stair trim and railings",
              "New-construction trim packages",
            ],
          }),
        }}
      />
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
        <a className="header-cta" href={`tel:${phoneLink}`}>Call {phoneDisplay}</a>
      </header>

      <section className="hero" id="top">
        <Image className="hero-image" src="/images/fireplace-mantel.webp" alt="Finished fireplace mantel showcasing detailed finish carpentry" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">Finish carpentry · New construction</p>
          <h1>The details that<br />finish the job.</h1>
          <p className="hero-copy">Precise interior trim, cabinetry, built-ins, and custom woodwork for builders, homeowners, and new-construction projects.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#work">View our work</a>
            <a className="text-link light-link" href={`sms:${phoneLink}`}>Text about a project <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="hero-proof" aria-label="Project focus">
          <span>New construction</span><span>Finish carpentry</span><span>Residential</span>
        </div>
      </section>

      <section className="intro" id="approach">
        <div>
          <p className="eyebrow">The Jason &amp; Co. standard</p>
          <h2>Clean lines begin with careful craftsmanship.</h2>
        </div>
        <div className="intro-copy">
          <p>Jason &amp; Co. Construction installs the trim, built-ins, cabinetry, and tailored wood details that bring a new space together. Every cut, reveal, joint, and transition is handled with the finished room in mind.</p>
          <a className="text-link" href="#services">Explore our services <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-heading">
          <p className="eyebrow light">What we do</p>
          <h2>Finish work, built to fit.</h2>
        </div>
        <div className="service-list">
          <article><span>01</span><h3>New-construction trim</h3><p>Complete interior trim packages with consistent details from room to room.</p></article>
          <article><span>02</span><h3>Molding &amp; casing</h3><p>Baseboards, crown molding, door casing, window casing, and clean transitions.</p></article>
          <article><span>03</span><h3>Built-ins &amp; cabinetry</h3><p>Fitted cabinetry, shelving, fireplace surrounds, and custom storage details.</p></article>
          <article><span>04</span><h3>Stairs &amp; custom work</h3><p>Stair trim, railings, decorative woodwork, and project-specific finish details.</p></article>
        </div>
      </section>

      <section className="portfolio" id="work">
        <div className="portfolio-top">
          <div><p className="eyebrow">Selected work</p><h2>Details that complete the space.</h2></div>
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
        <div className="process-image-wrap"><Image src="/images/custom-cabinet-build.webp" alt="Custom cabinetry and trim being fitted during new construction" fill sizes="(max-width: 900px) 100vw, 45vw" /></div>
        <div className="process-content">
          <p className="eyebrow">How we work</p>
          <h2>Measure carefully. Build precisely. Finish clean.</h2>
          <ol>
            <li><span>01</span><div><h3>Review the plans</h3><p>Confirm scope, profiles, materials, dimensions, and the details that define the finish package.</p></div></li>
            <li><span>02</span><div><h3>Coordinate the installation</h3><p>Plan the sequence around the build so trim and cabinetry fit cleanly into the project schedule.</p></div></li>
            <li><span>03</span><div><h3>Complete the details</h3><p>Install with tight joints, consistent reveals, clean lines, and a jobsite-ready finish.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="eyebrow light">Start a conversation</p>
          <h2>Bring us in for the finish.</h2>
          <p>Planning a new build or a detailed interior project? Call, text, or email to discuss the scope and schedule.</p>
          <div className="contact-actions">
            <a className="button contact-button" href={`tel:${phoneLink}`}>Call now</a>
            <a className="button contact-button contact-button-outline" href={`sms:${phoneLink}`}>Send a text</a>
          </div>
        </div>
        <div className="contact-details">
          <div><span>Phone</span><strong><a href={`tel:${phoneLink}`}>{phoneDisplay}</a></strong></div>
          <div><span>Email</span><strong><a href={`mailto:${email}?subject=Finish%20carpentry%20project`}>{email}</a></strong></div>
          <div><span>Project focus</span><strong>New construction &amp; residential finish carpentry</strong></div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">J&amp;Co.</span><span className="brand-name">Jason &amp; Co. Construction</span></div>
        <p>Finish carpentry for new construction and residential projects.</p>
        <p><a href={`tel:${phoneLink}`}>{phoneDisplay}</a> · <a href={`mailto:${email}`}>Email Jason</a></p>
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
