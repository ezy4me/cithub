import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Search, Star, Settings } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useFavoritesStore } from '@/shared/lib/stores';

const navItems = [
  { icon: Home, label: 'Главная', path: '/' },
  { icon: BookOpen, label: 'Предметы', path: '/subjects' },
  { icon: Search, label: 'Поиск', path: '/search' },
  { icon: Star, label: 'Избранное', path: '/favorites' },
  { icon: Settings, label: 'Настройки', path: '/settings' },
];

export function BottomNav() {
  const location = useLocation();
  const { favorites } = useFavoritesStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg text-[10px] transition-colors min-w-[56px]',
              isActive(item.path)
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.path === '/favorites' && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </div>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
