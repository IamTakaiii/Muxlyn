interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">{message}</div>
  );
}
