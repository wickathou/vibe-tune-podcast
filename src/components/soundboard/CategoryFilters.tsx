
import { cn } from '@/lib/utils';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryFilters = ({ categories, selectedCategory, onCategorySelect }: CategoryFiltersProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategorySelect(cat)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium",
            "transition-all duration-200",
            selectedCategory === cat
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          )}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;

