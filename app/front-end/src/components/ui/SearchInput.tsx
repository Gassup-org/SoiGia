import { ArrowRight, Search } from 'lucide-react'

interface SearchInputProps {
  placeholder?: string
  popularTerms?: string[]
}

export function SearchInput({
  placeholder = 'Bạn muốn tìm gì hôm nay?',
  popularTerms = [],
}: SearchInputProps) {
  return (
    <div className="w-full space-y-4">
      <form className="relative w-full max-w-2xl" role="search">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
          strokeWidth={1.8}
        />
        <input
          aria-label="Tìm kiếm sản phẩm"
          className="h-14 w-full rounded-2xl border border-ink/10 bg-surface/95 pl-12 pr-16 text-base text-ink shadow-card outline-none transition-all duration-300 placeholder:text-ink-muted/60 focus:border-brand focus:ring-4 focus:ring-brand/15"
          placeholder={placeholder}
          type="search"
        />
        <button
          aria-label="Tìm kiếm"
          className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-brand text-white transition-all duration-300 hover:bg-brand-strong active:scale-95 md:w-auto md:px-4"
          type="submit"
        >
          <span className="hidden text-sm font-semibold md:inline">Tìm kiếm</span>
          <ArrowRight className="h-4 w-4 md:hidden" strokeWidth={2} />
        </button>
      </form>
      {popularTerms.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span className="font-medium text-ink">Phổ biến:</span>
          {popularTerms.map((term) => (
            <button
              className="rounded-full bg-surface px-3 py-1.5 font-medium text-ink-muted ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-strong hover:shadow-sm"
              key={term}
              type="button"
            >
              {term}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
