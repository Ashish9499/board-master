import { KanbanColumn } from "@/types/kanban";

export const initialColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      { id: "card-1", title: "Research competitor analysis" },
      { id: "card-2", title: "Define project requirements" },
      { id: "card-3", title: "Create wireframes for homepage" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      { id: "card-4", title: "Build authentication flow" },
      { id: "card-5", title: "Design system components" },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "card-6", title: "Set up project repository" },
      { id: "card-7", title: "Configure CI/CD pipeline" },
    ],
  },
];
