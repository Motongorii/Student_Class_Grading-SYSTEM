import { render } from '@testing-library/react';
import AdminSidebar from '../components/AdminSidebar';

describe('AdminSidebar', () => {
  it('renders links and logout button', () => {
    const { getByText } = render(<AdminSidebar />);
    expect(getByText(/dashboard/i)).toBeInTheDocument();
    expect(getByText(/students/i)).toBeInTheDocument();
    expect(getByText(/courses/i)).toBeInTheDocument();
    expect(getByText(/audit logs/i)).toBeInTheDocument();
    expect(getByText(/logout/i)).toBeInTheDocument();
  });
});