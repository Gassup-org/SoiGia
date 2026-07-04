import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/20',
  secondary:
    'bg-surface text-ink ring-1 ring-ink/10 hover:bg-surface-soft hover:shadow-md hover:shadow-ink/5',
  ghost: 'text-ink-muted hover:bg-brand-soft hover:text-brand-strong',
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
