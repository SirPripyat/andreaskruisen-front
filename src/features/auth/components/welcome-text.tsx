export const WelcomeText = () => {
  return (
    <div className={'flex flex-col gap-2'}>
      <p
        className={
          'font-mono text-xs font-semibold tracking-wider text-accent uppercase'
        }
      >
        Bem-vindo de volta
      </p>
      <h2 className={'font-display text-3xl leading-none font-extrabold'}>
        Entrar
      </h2>
      <p className={'text-sm text-muted-foreground'}>
        Informe seu usuário e PIN para acessar a aplicação.
      </p>
    </div>
  );
};
