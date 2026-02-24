import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Check, X } from "lucide-react";
import type { KanbanCard as KanbanCardType } from "@/types/kanban";

interface Props {
  card: KanbanCardType;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function KanbanCardItem({ card, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onEdit(card.id, trimmed);
    } else {
      setEditValue(card.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(card.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-2 rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/20" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="w-full rounded border bg-background px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <button onClick={handleSave} className="shrink-0 text-primary hover:text-primary/80">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={handleCancel} className="shrink-0 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p
            className="cursor-pointer text-sm leading-snug text-card-foreground"
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to edit"
          >
            {card.title}
          </p>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={() => onDelete(card.id)}
          className="shrink-0 text-muted-foreground/0 transition-colors group-hover:text-destructive/70 hover:!text-destructive"
          aria-label="Delete card"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
