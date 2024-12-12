import { Avatar } from "./ui/avatar";
import { User } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sponsorship</h1>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4">
            <a href="#" className="text-sm hover:text-primary">Dashboard</a>
            <a href="#" className="text-sm hover:text-primary">Profile</a>
            <a href="#" className="text-sm hover:text-primary">À propos</a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">user@gmail.com</span>
            <Avatar className="h-8 w-8">
              <User className="h-5 w-5" />
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}