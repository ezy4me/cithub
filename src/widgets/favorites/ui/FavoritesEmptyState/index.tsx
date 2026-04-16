import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FavoritesEmptyState() {
  return (
    <div className="text-center py-12">
      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Пока нет избранного</h3>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">
        Добавляйте лекции в избранное, нажимая на звездочку
      </p>
      <Link to="/subjects">
        <Button>Выбрать предмет</Button>
      </Link>
    </div>
  );
}
