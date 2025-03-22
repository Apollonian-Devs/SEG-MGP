import { render, screen } from '@testing-library/react';
import AboutUs from '../../pages/AboutUs';
import { describe, it, expect } from 'vitest';

// Mock framer-motion to render regular HTML in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: actual.motion.div || (({ children }) => <div>{children}</div>),
      a: actual.motion.a || (({ children, ...props }) => <a {...props}>{children}</a>),
      li: actual.motion.li || (({ children }) => <li>{children}</li>),
    },
  };
});

describe('AboutUs', () => {
  it('renders main heading and project dates', () => {
    render(<AboutUs />);
    expect(screen.getByText('About This Project')).toBeInTheDocument();
    expect(screen.getByText(/13 January 2025/)).toBeInTheDocument();
    expect(screen.getByText(/27 March 2025/)).toBeInTheDocument();
  });

  it('renders all team members', () => {
    const memberNames = [
      'Josiah Chan',
      'Rahat Chowdhury',
      'Lucas Jaroenpanichying',
      'Dimitrios Katsoulis',
      'Siddhant Mohapatra',
      'Fahim Nouri Nasir',
      'Yau Ting Hiu Ryan',
      'Adam Wood',
    ];
    render(<AboutUs />);
    memberNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders generative AI section', () => {
    render(<AboutUs />);
    expect(screen.getByText(/We use AI to suggest/)).toBeInTheDocument();
  });

  it('contains a working Back link', () => {
    render(<AboutUs />);
    const backLink = screen.getByRole('link', { name: /Back/i });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
