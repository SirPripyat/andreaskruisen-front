import { cn } from '@/lib';
import { LoginForm, Logo, WelcomeText } from './components';

export const LoginScreen = () => {
  return (
    <div className={'flex min-h-screen w-full flex-col md:flex-row'}>
      <aside
        className={cn(
          'flex items-center justify-start gap-3 bg-accent-foreground px-5 py-6 md:w-[40%]',
          'md:min-w-70 md:flex-col md:justify-center md:gap-4 md:px-10 md:py-10',
        )}
      >
        <Logo />
      </aside>

      <div
        className={
          'relative flex flex-1 items-center justify-center bg-background px-5 py-10'
        }
      >
        <div className={'w-full max-w-sm flex flex-col gap-6'}>
          <WelcomeText />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
