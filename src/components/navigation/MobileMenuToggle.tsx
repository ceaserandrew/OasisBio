import React from 'react';
import { Button } from '../Button';
import { MobileMenuToggleProps } from './navigation.types';

export function MobileMenuToggle({ isOpen, onToggle }: MobileMenuToggleProps) {
  return (
    <div className="lg:hidden fixed top-4 right-4 z-50">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggle}
        className="bg-background shadow-md w-10 h-10 p-0 flex items-center justify-center transition-all duration-300"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOpen ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
              className="transition-opacity duration-300"
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
              className="transition-opacity duration-300"
            />
          )}
        </svg>
      </Button>
    </div>
  );
}
