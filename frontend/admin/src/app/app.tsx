import { Button } from '@/shadcn/components/button';
import { ThemeProvider } from '@/shadcn/theme/ThemeProvider';

export function App() {
  return (
    <ThemeProvider>
      <h1>Welcome Page</h1>

      <Button>Click Me</Button>
    </ThemeProvider>
  );
}

export default App;
