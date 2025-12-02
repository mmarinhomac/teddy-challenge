import { AuthProvider } from '../context/AuthProvider';
import SignInMain from './components/Main';

export default function SignInModule() {
  return (
    <AuthProvider>
      <SignInMain />
    </AuthProvider>
  );
}
