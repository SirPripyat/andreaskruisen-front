export const Logo = () => {
  return (
    <>
      <img
        src={'/logo-flagband-square.svg'}
        alt={'Andreaskruisen'}
        className={'h-10 w-10 md:h-16 md:w-16'}
      />
      <h1
        className={
          'text-balance font-display text-xl leading-none font-extrabold text-foreground md:text-center md:text-4xl'
        }
      >
        Andreaskruisen
      </h1>
    </>
  );
};
