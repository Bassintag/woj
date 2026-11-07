export function ListProgress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex flex-col gap-2 px-layout">
      <p className="text-xs text-fg">
        {done} sur {total} dans le panier
      </p>
      <div className="h-4 overflow-hidden rounded-full bg-muted-bg">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: total ? `${(done / total) * 100}%` : 0 }}
        />
      </div>
    </div>
  );
}
