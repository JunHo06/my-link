import { dummyLinks } from "@/data/links";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 mt-12 mb-auto">
        {/* Profile Section Placeholder */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-muted shrink-0" />
          <h1 className="text-xl font-bold tracking-tight">@my_profile</h1>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-4">
          {dummyLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="relative flex flex-row items-center p-4 min-h-[60px] transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-muted/50 cursor-pointer">
                  {Icon && (
                    <div className="absolute left-4">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="flex-1 text-center font-medium text-foreground">{link.title}</span>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
