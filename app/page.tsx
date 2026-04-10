import { dummyLinks } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Globe, MessageCircle, Camera, Briefcase, Mail } from "lucide-react";

export default function Page() {
  return (
    <main className="dark flex min-h-svh flex-col items-center p-6 bg-aurora text-foreground relative overflow-hidden">
      {/* Decorative Overlays (for depth) */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 mt-12 mb-10 relative z-10">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)] shrink-0 flex items-center justify-center mb-2 overflow-hidden">
             {/* Profile Image Placeholder */}
             <span className="text-3xl font-bold text-white/50">M</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">@my_profile</h1>
          <p className="text-sm text-gray-300 text-center px-4 leading-relaxed font-medium">
             Front-end Developer | UI/UX Designer <br/>
             함께 성장하는 개발자입니다. 🚀
          </p>
        </div>
        
        {/* Links List (Glassmorphism applied) */}
        <div className="flex flex-col gap-4">
          {dummyLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-full outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                <Card className="relative flex flex-row items-center p-4 min-h-[60px] cursor-pointer 
                                 border border-white/10 bg-white/5 backdrop-blur-md shadow-xl 
                                 transition-all duration-300 ease-out
                                 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 active:scale-[0.98]">
                  {Icon && (
                    <div className="absolute left-4">
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                  )}
                  <span className="flex-1 text-center font-semibold text-gray-100 group-hover:text-white transition-colors duration-300">
                    {link.title}
                  </span>
                </Card>
              </a>
            );
          })}
        </div>

        {/* Social Links (PRD 3.4) */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="flex justify-center items-center gap-4">
            {[Globe, MessageCircle, Camera, Briefcase, Mail].map((SnsIcon, i) => (
              <a 
                key={i} 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg 
                           text-gray-300 hover:text-white hover:bg-white/10 hover:-translate-y-1 
                           transition-all duration-300 ease-out"
              >
                <SnsIcon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </div>
        
      </div>
    </main>
  );
}
