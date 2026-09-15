import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import ProductGrid from '../ProductGrid';
import type { Product } from '../../../types/product';

const products: Product[] = Array.from({ length: 6 }, (_, index) => ({
  id: `${index}`,
  product_id: `P${index}`,
  name: `Product ${index}`,
  description: `Description ${index}`,
  images: [],
  weight: 10,
  category: 'rings',
  sub_category: '',
  fixed_price: 1000,
  metal_type: 'gold',
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      products: { items: products, loading: false, error: null },
      metalPrices: { gold: 100, silver: 100 },
    }),
  useDispatch: () => vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProductGrid />
    </MemoryRouter>
  );

describe('ProductGrid', () => {
  it('renders the featured heading, four products and a products CTA on the home page', () => {
    renderAt('/');

    expect(screen.getByRole('heading', { name: 'Featured Products' })).toBeInTheDocument();
    expect(screen.getByText('Explore some of our products')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(screen.getByRole('link', { name: /view all products/i })).toHaveAttribute(
      'href',
      '/products'
    );
  });

  it('does not render the subtitle or CTA outside the home page', () => {
    renderAt('/products');

    expect(screen.getByRole('heading', { name: 'Featured Collections' })).toBeInTheDocument();
    expect(screen.queryByText('Explore some of our products')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /view all products/i })).not.toBeInTheDocument();
  });
});
