import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

const variants = {
  primary: 'bg-brand text-white hover:bg-blue-700',
  secondary: 'border border-slate-200 text-slate-800 hover:bg-slate-50',
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
