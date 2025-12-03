import { FormProvider } from './context/FormProvider';

import SignInMain from './components/Main';

export default function SignInModule() {
  return (
    <FormProvider>
      <SignInMain />
    </FormProvider>
  );
}
