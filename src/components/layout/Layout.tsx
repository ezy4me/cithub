import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useSettings } from '@/shared/hooks/useSettings';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { animationsEnabled } = useSettings();

  return (
    <div className={animationsEnabled ? '' : '[&_*]:!transition-none'}>
      <Sidebar />
      <main className="md:ml-[280px] pb-20 md:pb-0 min-h-screen overflow-y-auto overflow-x-hidden">
        {children || <Outlet />}
      </main>
      <BottomNav />
    </div>
  );
}
