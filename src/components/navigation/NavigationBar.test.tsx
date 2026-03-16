import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavigationBar from './NavigationBar';

describe('NavigationBar', () => {
  const defaultProps = {
    user: {
      name: 'Test User',
      profile: {
        username: 'testuser',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    },
    onLogout: jest.fn(),
  };

  it('should render NavigationBar with default props', () => {
    render(<NavigationBar {...defaultProps} />);
    
    const oasisBioTitle = screen.getByText('OasisBio');
    expect(oasisBioTitle).toBeInTheDocument();
    
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toBeInTheDocument();
  });

  it('should display user information', () => {
    render(<NavigationBar {...defaultProps} />);
    
    const userName = screen.getByText('Test User');
    expect(userName).toBeInTheDocument();
    
    const userUsername = screen.getByText('@testuser');
    expect(userUsername).toBeInTheDocument();
  });

  it('should display user avatar when avatarUrl is provided', () => {
    const { container } = render(<NavigationBar {...defaultProps} />);
    
    const avatar = container.querySelector('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should display default avatar when avatarUrl is not provided', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      user: {
        name: 'Test User',
        profile: {
          username: 'testuser',
        },
      },
    };
    const { container } = render(<NavigationBar {...propsWithoutAvatar} />);
    
    const avatarSvg = container.querySelector('svg');
    expect(avatarSvg).toBeInTheDocument();
  });

  it('should render navigation items', () => {
    render(<NavigationBar {...defaultProps} />);
    
    const overviewLink = screen.getByText('Overview');
    expect(overviewLink).toBeInTheDocument();
    
    const settingsLink = screen.getByText('Settings');
    expect(settingsLink).toBeInTheDocument();
  });

  it('should render logout button', () => {
    render(<NavigationBar {...defaultProps} />);
    
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call onLogout when logout button is clicked', () => {
    const onLogout = jest.fn();
    render(<NavigationBar {...defaultProps} onLogout={onLogout} />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should render mobile menu toggle', () => {
    const { container } = render(<NavigationBar {...defaultProps} />);
    
    const mobileMenuToggle = container.querySelector('div[class*="lg:hidden"]');
    expect(mobileMenuToggle).toBeInTheDocument();
  });

  it('should toggle mobile menu when toggle button is clicked', () => {
    const { container } = render(<NavigationBar {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    const mobileMenuToggle = buttons[0]; // First button is mobile menu toggle
    fireEvent.click(mobileMenuToggle);
    
    const navigationBar = container.querySelector('div[class*="fixed"]');
    expect(navigationBar).toBeInTheDocument();
  });
});
