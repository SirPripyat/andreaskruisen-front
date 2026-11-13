import { Greeting } from './components';

export const HomeScreen = () => {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Greeting />
    </div>
  );
};
