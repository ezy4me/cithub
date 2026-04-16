import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative mb-8">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Введите название лекции или предмета..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-12 text-lg"
        autoFocus
      />
    </div>
  );
}
