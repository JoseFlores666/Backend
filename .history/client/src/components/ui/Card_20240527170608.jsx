export function Card({ children, className }) {
  return (
    <div
      className={`max-w-md w-full p-10 rounded-md shadow-md ${className}`}
      style={{ backgroundColor: '#5e636a', color: '#FFFFFF' }} // color gris oscuro con texto blanco
    >
      {children}
    </div>
  );
}
