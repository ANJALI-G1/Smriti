const VARIANTS = {
  primary: 'bg-brand-teal hover:bg-brand-tealDark text-brand-ivory shadow-sm hover:shadow-md',
  secondary:
    'border border-brand-borderDark hover:border-brand-teal bg-white/70 hover:bg-white text-brand-charcoal',
  inverse: 'bg-brand-ivory text-brand-teal hover:bg-white shadow-lg',
  inverseOutline: 'bg-brand-tealDark/80 hover:bg-brand-tealDark text-white border border-white/20',
};

const SIZES = {
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex justify-center items-center gap-2 rounded-md font-medium transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
