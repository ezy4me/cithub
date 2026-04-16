import { GitBranch } from 'lucide-react';

export function SubjectsEmptyState() {
  return (
    <div className="text-center py-12">
      <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
      <p className="text-muted-foreground">
        Попробуйте изменить поисковый запрос
      </p>
    </div>
  );
}
