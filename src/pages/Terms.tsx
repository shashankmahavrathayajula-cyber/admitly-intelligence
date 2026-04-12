export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground font-sans">
          Coming soon — contact{' '}
          <a href="mailto:support@useadmitly.com" className="text-[hsl(var(--coral))] hover:underline">
            support@useadmitly.com
          </a>{' '}
          for questions.
        </p>
      </div>
    </div>
  );
}
