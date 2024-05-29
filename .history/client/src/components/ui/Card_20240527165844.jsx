export function Card({ children, className }) {
  return <div className={`bg-[#a855f7] text-white max-w-md w-full p-10 rounded-md shadow-md ${className}`}>{children}</div>;
}
