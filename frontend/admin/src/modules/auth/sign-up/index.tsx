import { AuthProvider } from '../context/AuthProvider';
import SignUpMain from './components/Main';

export default function SignUpModule() {
  return (
    <AuthProvider>
      <SignUpMain />
    </AuthProvider>
  );
}
