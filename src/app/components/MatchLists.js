import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

export default function MatchList({ matches }) {
  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={match.mentor.image}
                  alt={match.mentor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium">{match.mentor.name}</h3>
                <p className="text-xs text-muted-foreground">{match.mentor.role}</p>
              </div>
            </div>
            
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground mx-4" />
            
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={match.mentee.image}
                  alt={match.mentee.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium">{match.mentee.name}</h3>
                <p className="text-xs text-muted-foreground">{match.mentee.role}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}