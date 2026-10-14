export function PageHeader({ title, help }: { title: string; help: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">{title}</h1>
      <p className="mt-1 text-sm sm:text-base text-stone-600 max-w-3xl">{help}</p>
    </div>
  );
}
