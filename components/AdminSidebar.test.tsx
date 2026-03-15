import { render } from '@testing-library/react';
import AdminSidebar from './AdminSidebar';

describe('AdminSidebar', () => {
  it('renders without crashing', () => {
    render(<AdminSidebar />);
  });
});
