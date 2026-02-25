export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium transition";

  const styles = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    outline: "border border-zinc-300 text-zinc-900 hover:bg-zinc-50",

    brand:
      "bg-[var(--base-color)] text-white hover:opacity-90",
  };

  return (
    <button
      className={`${baseClasses} ${styles[variant] ?? styles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}