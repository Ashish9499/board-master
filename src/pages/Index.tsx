import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Layout } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Layout className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Kanban Board</h1>
            <p className="text-xs text-muted-foreground">Drag cards to organize your workflow</p>
          </div>
        </div>
      </header>
      <KanbanBoard />
    </div>
  );
};

export default Index;
