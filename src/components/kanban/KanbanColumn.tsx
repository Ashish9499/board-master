import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { KanbanCardItem } from "./KanbanCard";
import type { KanbanColumn as KanbanColumnType, ColumnId } from "@/types/kanban";

const columnStyles: Record<ColumnId, { bg: string; accent: string; badge: string }> = {
  todo: {
    bg: "bg-column-todo",
    accent: "bg-column-todo-accent",
    badge: "text-column-todo-accent",
  },
  "in-progress": {
    bg: "bg-column-progress",
    accent: "bg-column-progress-accent",
    badge: "text-column-progress-accent",
  },
  done: {
    bg: "bg-column-done",
    accent: "bg-column-done-accent",
    badge: "text-column-done-accent",
  },
};

interface Props {
  column: KanbanColumnType;
  onAddCard: (columnId: ColumnId) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (cardId: string, title: string) => void;
}

export function KanbanColumnComponent({ column, onAddCard, onDeleteCard, onEditCard }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const styles = columnStyles[column.id];

  return (
    <div
      className={`flex w-full flex-col rounded-xl ${styles.bg} transition-all md:w-80 ${
        isOver ? "ring-2 ring-primary/30" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${styles.accent}`} />
          <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
          <span className={`text-xs font-medium ${styles.badge}`}>
            {column.cards.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(column.id)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label={`Add card to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex min-h-[120px] flex-1 flex-col gap-2 px-3 pb-3">
        <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <KanbanCardItem
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
            />
          ))}
        </SortableContext>

        {column.cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border/50 py-8 text-xs text-muted-foreground">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
