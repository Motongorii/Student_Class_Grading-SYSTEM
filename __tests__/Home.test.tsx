import { render } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders welcome message', () => {
    // Home is async, so we need to handle promise
    // @ts-ignore
    const { getByText } = render(<Home />);
    expect(getByText(/welcome to sgms/i)).toBeInTheDocument();
  });
});
