import { useState } from "react";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Calendar as Cal, Tag } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Priority = "Low" | "Medium" | "High";
type ColumnId = "todo" | "progress" | "review" | "done";
interface Task { id: string; title: string; desc?: string; tag: string; priority: Priority; due: string; }

const initial: Record<ColumnId, Task[]> = {
  todo: [
    { id: "1", title: "Refine onboarding copy", tag: "Product", priority: "High", due: "Tomorrow" },
    { id: "2", title: "Audit landing page SEO", tag: "Marketing", priority: "Medium", due: "Fri" },
    { id: "3", title: "Sketch v3 design tokens", tag: "Design", priority: "Low", due: "Next week" },
  ],
  progress: [
    { id: "4", title: "Implement command palette", tag: "Engineering", priority: "High", due: "Today" },
    { id: "5", title: "Auth refresh-token flow", tag: "Engineering", priority: "Medium", due: "Thu" },
  ],
  review: [
    { id: "6", title: "Pricing page A/B test", tag: "Growth", priority: "Medium", due: "Wed" },
  ],
  done: [
    { id: "7", title: "Ship beta dashboard", tag: "Product", priority: "High", due: "Mon" },
    { id: "8", title: "Brand color exploration", tag: "Design", priority: "Low", due: "Last week" },
  ],
};

const cols: { id: ColumnId; name: string; color: string }[] = [
  { id: "todo", name: "To Do", color: "bg-muted-foreground" },
  { id: "progress", name: "In Progress", color: "bg-primary" },
  { id: "review", name: "Review", color: "bg-warning" },
  { id: "done", name: "Done", color: "bg-success" },
];

const TAGS = ["Product", "Design", "Engineering", "Marketing", "Growth", "Research"];

const priColor: Record<Priority, string> = {
  High: "bg-destructive/15 text-destructive border-destructive/20",
  Medium: "bg-warning/15 text-warning border-warning/20",
  Low: "bg-success/15 text-success border-success/20",
};

function TaskCard({ task, dragging }: { task: Task; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <motion.div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      layout
      whileHover={{ y: -3 }}
      className={cn(
        "p-4 rounded-2xl bg-secondary/50 border border-border/60 hover:border-primary/40 cursor-grab active:cursor-grabbing transition-all",
        dragging && "shadow-glow-purple rotate-2"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={cn("inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border", priColor[task.priority])}>
          {task.priority}
        </div>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Cal className="w-3 h-3" />{task.due}</span>
      </div>
      <p className="text-sm font-semibold leading-snug mb-3">{task.title}</p>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Tag className="w-3 h-3" />{task.tag}</span>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-primary border-2 border-card text-[10px] flex items-center justify-center text-white">M</div>
        </div>
      </div>
    </motion.div>
  );
}

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumn: ColumnId;
  onCreate: (column: ColumnId, task: Task) => void;
}

function CreateTaskModal({ open, onOpenChange, defaultColumn, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [column, setColumn] = useState<ColumnId>(defaultColumn);
  const [tag, setTag] = useState<string>("Design");
  const [due, setDue] = useState("");

  // sync default column whenever modal opens from a specific column
  const handleOpenChange = (o: boolean) => {
    if (o) {
      setColumn(defaultColumn);
      setTitle(""); setDesc(""); setPriority("Medium"); setTag("Design"); setDue("");
    }
    onOpenChange(o);
  };

  const submit = () => {
    if (!title.trim()) {
      toast({ title: "Task title required", description: "Please enter a title for your task.", variant: "destructive" });
      return;
    }
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      desc: desc.trim() || undefined,
      priority,
      tag,
      due: due.trim() || "Someday",
    };
    onCreate(column, task);
    toast({ title: "Task created", description: `"${task.title}" added to ${cols.find(c => c.id === column)?.name}.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-strong rounded-3xl sm:max-w-[480px]">
        <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task Title</Label>
            <Input id="task-title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?" className="rounded-xl" maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea id="task-desc" value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Optional details..." className="rounded-xl" maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Column</Label>
              <Select value={column} onValueChange={(v) => setColumn(v as ColumnId)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cols.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tag</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TAGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" value={due} onChange={(e) => setDue(e.target.value)}
                placeholder="e.g. Tomorrow, Fri…" className="rounded-xl" maxLength={40} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-2xl">Cancel</Button>
          <Button onClick={submit} className="rounded-2xl bg-gradient-primary hover:shadow-glow-purple">Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Tasks() {
  const [board, setBoard] = useState(initial);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState<ColumnId>("todo");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findColumn = (id: string) => (Object.keys(board) as ColumnId[]).find((k) => board[k].some((t) => t.id === id));

  const onDragStart = (e: DragStartEvent) => {
    const col = findColumn(e.active.id as string);
    if (col) setActiveTask(board[col].find((t) => t.id === e.active.id) || null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;
    const fromCol = findColumn(active.id as string)!;
    const toCol = (cols.find((c) => c.id === over.id)?.id as ColumnId) || findColumn(over.id as string);
    if (!toCol) return;

    if (fromCol === toCol) {
      const oldI = board[fromCol].findIndex((t) => t.id === active.id);
      const newI = board[fromCol].findIndex((t) => t.id === over.id);
      if (oldI !== newI && newI !== -1) setBoard({ ...board, [fromCol]: arrayMove(board[fromCol], oldI, newI) });
    } else {
      const task = board[fromCol].find((t) => t.id === active.id)!;
      setBoard({
        ...board,
        [fromCol]: board[fromCol].filter((t) => t.id !== active.id),
        [toCol]: [...board[toCol], task],
      });
    }
  };

  const openModal = (col: ColumnId) => {
    setModalColumn(col);
    setModalOpen(true);
  };

  const handleCreate = (col: ColumnId, task: Task) => {
    setBoard((b) => ({ ...b, [col]: [...b[col], task] }));
  };

  const filter = (tasks: Task[]) => tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Drag to reorganize your workflow"
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Button onClick={() => openModal("todo")} className="rounded-2xl bg-gradient-primary hover:shadow-glow-purple">
              <Plus className="w-4 h-4 mr-2" />New Task
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 glass rounded-2xl px-4 py-2 mb-6 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="bg-transparent text-sm flex-1 outline-none" />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {cols.map((col) => {
            const items = filter(board[col.id]);
            return (
              <GlassCard key={col.id} hover={false} className="!p-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h3 className="font-semibold text-sm">{col.name}</h3>
                  <Badge variant="secondary" className="ml-auto rounded-full text-xs">{items.length}</Badge>
                </div>
                <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 min-h-[200px]">
                    {items.map((t) => <TaskCard key={t.id} task={t} />)}
                  </div>
                </SortableContext>
                <button
                  onClick={() => openModal(col.id)}
                  className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-primary border border-dashed border-border rounded-2xl hover:border-primary/40 transition"
                >
                  + Add task
                </button>
              </GlassCard>
            );
          })}
        </div>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} dragging />}</DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultColumn={modalColumn}
        onCreate={handleCreate}
      />
    </div>
  );
}
