import { Outlet } from 'react-router-dom';
import { FormProvider as RHFProvider, useForm } from 'react-hook-form';

export const FormProvider = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[] | React.ReactElement;
}) => {
  const methods = useForm();

  return <RHFProvider {...methods}>{children || <Outlet />}</RHFProvider>;
};
