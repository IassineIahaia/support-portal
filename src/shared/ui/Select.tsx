import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function Select({ label, id, className = '', children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-body text-on-surface-variant">
      <span className="uppercase tracking-wide font-semibold">{label}</span>
      <select
        id={id}
        className={`
          bg-white border border-outline/50 rounded-standard
          px-3 py-2 text-sm text-on-surface font-body
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}