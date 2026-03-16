import React from 'react';
import { Button } from '../Button';
import { NavItemProps } from './navigation.types';

export function NavItem({ href, label, icon, active = false, onClick, category }: NavItemProps) {
  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'profile': return 'text-blue-500';
      case 'identity': return 'text-purple-500';
      case 'content': return 'text-green-500';
      case 'system': return 'text-orange-500';
      default: return 'text-foreground';
    }
  };

  return (
    <Button
      asChild
      variant={active ? "primary" : "ghost"}
      className={`w-full justify-start ${active ? 'bg-primary/10 text-primary' : ''}`}
      onClick={onClick}
    >
      <a 
        href={href} 
        className="flex items-center"
      >
        <span className={`mr-2 ${getCategoryColor(category)}`}>
          {icon}
        </span>
        <span className={active ? 'font-medium' : ''}>{label}</span>
      </a>
    </Button>
  );
}
