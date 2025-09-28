import { Card } from "../ui/card";

interface Category {
  id: string;
  name: string;
}

interface CategoriesSectionProps {
  categories: Category[];
  onSelect?: (id: string) => void;
}

export function CategoriesSection({ categories, onSelect }: CategoriesSectionProps) {
  return (
    <section className="mx-auto max-w-7xl w-full">
      <Card className="rounded-xl border border-primary/20 bg-background/80 overflow-hidden">
        <div className="p-4 border-b border-primary/10">
          <h2 className="text-base font-semibold">카테고리</h2>
        </div>
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect?.(c.id)}
                className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm hover:border-primary hover:bg-primary/5 transition text-foreground whitespace-nowrap"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
