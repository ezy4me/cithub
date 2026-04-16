import { Search as SearchIcon } from 'lucide-react';

interface SearchNoResultsProps {
  query: string;
}

export function SearchNoResults({ query }: SearchNoResultsProps) {
  return (
    <div className="text-center py-12">
      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">
        Ничего не найдено по запросу &quot;{query}&quot;
      </p>
    </div>
  );
}
