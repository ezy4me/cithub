import { Search as SearchIcon } from 'lucide-react';

export function SearchEmptyState() {
  return (
    <div className="text-center py-12">
      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">
        Начните вводить название для поиска
      </p>
    </div>
  );
}
