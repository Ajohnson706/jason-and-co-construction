"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";

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

const phoneDisplay = "(706) 434-9522";
const phoneLink = "+17064349522";
const email = "jasonandco.jason@gmail.com";

function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (!video || !progress) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let objectUrl = "";
    const controller = new AbortController();

    const update = () => {
      frame = 0;
      const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const amount = Math.min(1, Math.max(0, window.scrollY / travel));
      progress.style.transform = `scaleX(${amount})`;

      if (!reducedMotion && Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = amount * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - targetTime) > 0.015) video.currentTime = targetTime;
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const unlockVideo = async () => {
      if (reducedMotion) return;
      try {
        await video.play();
        video.pause();
        requestUpdate();
      } catch {
        // Mobile browsers can require the first touch before allowing media control.
      }
    };

    const handleFirstInteraction = () => {
      void unlockVideo();
    };

    const handleMetadata = () => {
      video.pause();
      if (reducedMotion) video.currentTime = 0.01;
      else void unlockVideo();
      requestUpdate();
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("pointerdown", handleFirstInteraction, { passive: true, once: true });

    const prepareVideo = async () => {
      try {
        const response = await fetch(video.dataset.scrollSource ?? "", {
          cache: "force-cache",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load scroll film");

        const bytes = await response.arrayBuffer();
        objectUrl = URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
        video.src = objectUrl;
        video.load();
      } catch {
        if (!controller.signal.aborted) {
          video.src = video.dataset.scrollSource ?? "";
          video.load();
        }
      }
    };

    void prepareVideo();

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      if (frame) window.cancelAnimationFrame(frame);
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className="scroll-film-backdrop" aria-hidden="true">
      <video
        ref={videoRef}
        className="scroll-film-video"
        muted
        playsInline
        preload="auto"
        poster="/images/scroll-video-poster.webp"
        data-scroll-source="/video/finish-carpentry-scroll.mp4"
        tabIndex={-1}
      />
      <div className="scroll-film-shade" />
      <div className="scroll-film-progress"><span ref={progressRef} /></div>
    </div>
  );
}

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

  const handleEstimateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Estimate request — ${data.get("projectType") || "Finish carpentry"}`;
    const body = [
      `Name: ${data.get("name") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Project location: ${data.get("location") || ""}`,
      `Project type: ${data.get("projectType") || ""}`,
      `Desired timeline: ${data.get("timeline") || ""}`,
      "",
      "Project details:",
      `${data.get("details") || ""}`,
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="site-shell">
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
            areaServed: ["Augusta, Georgia", "Central Savannah River Area"],
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
      <ScrollVideoBackground />
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
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">Finish carpentry · Augusta &amp; the CSRA</p>
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
        <p className="scroll-cue">Scroll to move through the craftsmanship <span aria-hidden="true">↓</span></p>
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

      <section className="service-area" id="service-area">
        <div>
          <p className="eyebrow light">Where we work</p>
          <h2>Serving Augusta and the CSRA.</h2>
        </div>
        <div className="service-area-copy">
          <p>Jason &amp; Co. works with builders and homeowners throughout Augusta and the Central Savannah River Area on new-construction and residential finish-carpentry projects.</p>
          <div className="service-area-notes">
            <span>Augusta, Georgia</span>
            <span>CSRA</span>
            <span>New construction</span>
            <span>Residential interiors</span>
          </div>
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

      <section className="estimate" id="estimate">
        <div className="estimate-intro">
          <p className="eyebrow light">Request an estimate</p>
          <h2>Tell us what you’re building.</h2>
          <p>Send the basics now. Jason can follow up about plans, measurements, scheduling, and project photos.</p>
          <div className="estimate-direct">
            <a href={`tel:${phoneLink}`}>{phoneDisplay}</a>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
        <form className="estimate-form" onSubmit={handleEstimateSubmit}>
          <div className="form-grid">
            <label><span>Name</span><input name="name" autoComplete="name" required /></label>
            <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" required /></label>
            <label className="form-wide"><span>Project location</span><input name="location" autoComplete="street-address" placeholder="City or project address" required /></label>
            <label><span>Project type</span><select name="projectType" defaultValue="" required><option value="" disabled>Select one</option><option>New-construction trim</option><option>Molding and casing</option><option>Built-ins and cabinetry</option><option>Fireplace mantel and wall trim</option><option>Stairs and custom work</option><option>Other finish carpentry</option></select></label>
            <label><span>Desired timeline</span><select name="timeline" defaultValue=""><option value="">Not sure yet</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>More than 6 months out</option></select></label>
            <label className="form-wide"><span>Project details</span><textarea name="details" rows={5} placeholder="Describe the rooms, trim package, plans, or custom work." required /></label>
          </div>
          <button className="button estimate-submit" type="submit">Prepare estimate email <span aria-hidden="true">↗</span></button>
          <p className="form-note">This opens your email app with the project details filled in. You can attach photos or plans before sending.</p>
        </form>
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
        <p>Finish carpentry for Augusta and the CSRA.</p>
        <p><a href={`tel:${phoneLink}`}>{phoneDisplay}</a> · <a href={`mailto:${email}`}>Email Jason</a></p>
      </footer>

      <nav className="floating-contact" aria-label="Quick contact">
        <a href={`tel:${phoneLink}`}><span aria-hidden="true">☎</span> Call</a>
        <a href={`sms:${phoneLink}`}><span aria-hidden="true">✦</span> Text</a>
        <a className="floating-estimate" href="#estimate">Request estimate</a>
      </nav>

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
