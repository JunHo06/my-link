import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-black font-sans overflow-hidden flex items-center justify-center p-6">
      
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content / Profile Card */}
      <main className="relative z-10 w-full max-w-2xl glass rounded-3xl p-8 sm:p-12 animate-fade-in-up">
        <div className="flex flex-col items-center text-center gap-8">
          
          {/* Avatar Section */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 animate-fade-in-up delay-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full blur-md opacity-70"></div>
            <Image
              src="/profile_avatar.png"
              alt="Profile Avatar"
              fill
              className="rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl relative z-10"
              priority
            />
          </div>

          {/* Texts Section */}
          <div className="flex flex-col items-center animate-fade-in-up delay-200">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
              JunHo Dev
            </h1>
            <p className="text-lg sm:text-xl font-medium text-purple-600 dark:text-purple-400 mb-4">
              Full-Stack Developer & Designer
            </p>
            <p className="max-w-md text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Passionate about building scalable modern web applications and crafting beautiful user interfaces. Always learning, always building.
            </p>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up delay-300 w-full max-w-lg mt-2">
            {['React 19', 'Next.js', 'Tailwind CSS 4', 'TypeScript', 'Node.js', 'UI/UX'].map((skill) => (
              <span 
                key={skill} 
                className="px-4 py-2 text-sm font-medium rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/50 dark:hover:text-purple-300 transition-colors cursor-default border border-zinc-300/30 dark:border-zinc-700/30"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Links / Socials */}
          <div className="flex flex-row gap-4 mt-4 animate-fade-in-up delay-400">
            <a
              href="https://github.com/JunHo06"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-auto px-6 h-12 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 shadow-md"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@example.com"
              className="flex items-center justify-center w-auto px-6 h-12 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Contact Me
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}
