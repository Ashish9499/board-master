import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumnComponent } from "./KanbanColumn";
import { initialColumns } from "@/data/kanban-mock";
import type { KanbanColumn, KanbanCard, ColumnId } from "@/types/kanban";

let nextId = 100;

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const findColumn = useCallback(
    (cardId: string) => columns.find((col) => col.cards.some((c) => c.id === cardId)),
    [columns]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const col = findColumn(String(event.active.id));
    const card = col?.cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumn(activeId);
    // over could be a column id or a card id
    const destCol = columns.find((c) => c.id === overId) || findColumn(overId);

    if (!sourceCol || !destCol || sourceCol.id === destCol.id) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceCol.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== activeId) };
        }
        if (col.id === destCol.id) {
          const card = sourceCol.cards.find((c) => c.id === activeId)!;
          const overIndex = col.cards.findIndex((c) => c.id === overId);
          const newCards = [...col.cards];
          if (overIndex >= 0) {
            newCards.splice(overIndex, 0, card);
          } else {
            newCards.push(card);
          }
          return { ...col, cards: newCards };
        }
        return col;
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const col = findColumn(activeId);
    if (!col) return;

    // Reorder within same column
    if (col.cards.some((c) => c.id === overId)) {
      const oldIndex = col.cards.findIndex((c) => c.id === activeId);
      const newIndex = col.cards.findIndex((c) => c.id === overId);
      if (oldIndex !== newIndex) {
        setColumns((prev) =>
          prev.map((c) =>
            c.id === col.id ? { ...c, cards: arrayMove(c.cards, oldIndex, newIndex) } : c
          )
        );
      }
    }
  };

  const addCard = (columnId: ColumnId) => {
    const id = `card-${++nextId}`;
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id, title: "New task" }] }
          : col
      )
    );
  };

  const deleteCard = (cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      }))
    );
  };

  const editCard = (cardId: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === cardId ? { ...c, title } : c)),
      }))
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:gap-6 md:p-6">
        {columns.map((col) => (
          <KanbanColumnComponent
            key={col.id}
            column={col}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onEditCard={editCard}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="rounded-lg border bg-card p-3 shadow-xl ring-2 ring-primary/20">
            <p className="text-sm text-card-foreground">{activeCard.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
