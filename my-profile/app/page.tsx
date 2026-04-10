export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfdfc] text-black font-sans selection:bg-black selection:text-white pb-20">
      
      {/* Settings for global neo theme applied in globals.css */}

      {/* Navigation / Header */}
      <header className="px-4 border-b-4 border-black bg-white flex justify-between items-center sticky top-0 z-50 h-20">
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 bg-neo-yellow border-2 border-black rotate-12"></div>
          <h1 className="text-2xl pl-2 font-black uppercase tracking-tighter">JunHo.Dev</h1>
        </div>
        <a href="mailto:contact@example.com" className="font-bold whitespace-nowrap text-sm sm:text-base border-4 border-black bg-neo-green px-4 py-2 neo-shadow">
          LET&apos;S TALK
        </a>
      </header>

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* --- Hero Section (spans full width on desktop) --- */}
        <section className="lg:col-span-12 neo-border neo-shadow bg-neo-yellow p-8 sm:p-12 lg:p-20 flex flex-col justify-center items-start">
          <h2 className="text-6xl sm:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-8 bg-white px-2 py-4 neo-border inline-block neo-text-shadow-light">
            BORN<br/>
            TO<br/>
            BUILD.
          </h2>
          <p className="text-xl sm:text-2xl font-bold max-w-3xl text-black border-l-8 border-black pl-4 my-8 bg-white/50 p-4 neo-border">
            Hi, I&apos;m <span className="underline decoration-4">JunHo</span>. A passionate full-stack developer who crafts scalable web applications and designs bold, functional interfaces. No nonsense, just solid engineering.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full sm:w-auto">
            <a href="#projects" className="neo-border bg-black text-white px-8 py-4 font-black uppercase text-xl neo-shadow text-center">
              See Projects
            </a>
            <a href="https://github.com/JunHo06" target="_blank" rel="noopener noreferrer" className="neo-border bg-neo-purple px-8 py-4 font-black uppercase text-xl neo-shadow text-center">
              GitHub Profile
            </a>
          </div>
        </section>

        {/* --- Skills Section --- */}
        <section className="lg:col-span-5 flex flex-col gap-8">
          <div className="neo-border neo-shadow bg-neo-pink p-8 h-full">
            <h3 className="text-4xl font-black uppercase border-b-4 border-black pb-4 mb-8 mt-2">Capabilities</h3>
            <div className="flex flex-wrap gap-3">
              {[
                'React 19', 'Next.js', 'Tailwind CSS 4', 
                'TypeScript', 'Node.js', 'PostgreSQL', 
                'UI/UX Design', 'Neobrutalism', 'Git'
              ].map((skill) => (
                <span key={skill} className="px-4 py-2 font-bold text-lg border-4 border-black bg-white neo-shadow">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* --- About Me Section --- */}
        <section className="lg:col-span-7 flex flex-col gap-8">
          <div className="neo-border neo-shadow bg-white p-8 sm:p-12 h-full flex flex-col justify-center">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-neo-blue border-4 border-black"></div>
              <h3 className="text-4xl font-black uppercase">About Me</h3>
            </div>
            <p className="font-semibold text-xl leading-relaxed">
              Always learning, always building. I believe in writing <span className="bg-neo-yellow px-1">clean code</span>, designing intuitive user experiences, and having fun along the way. I focus on bridging the gap between design and solid software architecture. When I&apos;m not coding, I&apos;m probably exploring new tech stacks or rethinking web aesthetics.
            </p>
            <div className="mt-8 pt-6 border-t-4 border-black border-dashed flex justify-between items-center content-end">
              <p className="font-bold text-2xl">Location</p>
              <p className="font-black text-2xl bg-black text-white px-3 py-1">Seoul, KR</p>
            </div>
          </div>
        </section>

        {/* --- Projects Section --- */}
        <section id="projects" className="lg:col-span-12 neo-border neo-shadow bg-neo-blue p-8 sm:p-12 mb-8 mt-4">
          <div className="flex justify-between items-end border-b-8 border-black pb-4 mb-10">
            <h3 className="text-5xl sm:text-6xl font-black uppercase tracking-tight">Selected Work</h3>
            <span className="hidden sm:inline-block font-bold text-xl bg-white px-3 py-1 neo-border">2026 Edition</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[ 
              { title: "E-Commerce Platform", desc: "A modern shopping experience built with Next.js and Stripe.", tag: "Full-Stack", color: "bg-neo-pink" },
              { title: "Task Manager Pro", desc: "Interactive drag-and-drop task management tool for agile teams.", tag: "React App", color: "bg-neo-yellow" },
              { title: "Neo UI Library", desc: "Open-source brutalist UI component library for modern web.", tag: "Open Source", color: "bg-neo-green" },
              { title: "AI Image Generator", desc: "Web interface for generating images using AI models.", tag: "AI/UX", color: "bg-white" }
            ].map((project, i) => (
              <div key={i} className={`neo-border ${project.color} p-6 sm:p-8 neo-shadow hover:-translate-y-2 transition-transform cursor-pointer flex flex-col justify-between min-h-[250px]`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-black text-white font-bold uppercase text-sm border-2 border-transparent">
                      {project.tag}
                    </span>
                    <span className="font-black text-2xl opacity-50">0{i+1}</span>
                  </div>
                  <h4 className="text-3xl font-black leading-tight mb-3 mt-4">{project.title}</h4>
                </div>
                <p className="font-bold text-lg bg-white/80 p-3 neo-border">{project.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer / Call to Action */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="neo-border bg-black p-8 sm:p-16 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white mb-2" style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>
              READY TO
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-neo-yellow bg-black inline-block">
              BUILD?
            </h2>
          </div>
          <a href="mailto:contact@example.com" className="bg-neo-pink text-black px-10 py-6 font-black uppercase text-2xl md:text-3xl border-4 border-white neo-shadow hover:bg-white transition-colors w-full lg:w-auto text-center">
            CONTACT ME 🚀
          </a>
        </div>
      </footer>
    </div>
  );
}
