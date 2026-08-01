import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  error?: string
}

type TextFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement>
type TextAreaFieldProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>

const fieldClasses = (hasError: boolean) => `
  bg-white border rounded-standard px-3 py-2 text-sm font-body
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1
  ${hasError ? 'border-tertiary focus-visible:outline-tertiary' : 'border-outline/50 focus-visible:outline-primary'}
`

export function TextField({ label, error, id, ...props }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-body text-on-surface-variant">
      <span className="uppercase tracking-wide font-semibold">{label}</span>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClasses(Boolean(error))}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="text-tertiary text-xs normal-case font-normal">
          {error}
        </span>
      )}
    </label>
  )
}

export function TextAreaField({ label, error, id, ...props }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-body text-on-surface-variant">
      <span className="uppercase tracking-wide font-semibold">{label}</span>
      <textarea
        id={id}
        rows={4}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClasses(Boolean(error))}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="text-tertiary text-xs normal-case font-normal">
          {error}
        </span>
      )}
    </label>
  )
}