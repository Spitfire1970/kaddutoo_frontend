const Dotted = ({ text }) => {
  const parts = text.split('i');
  
  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="relative inline-block">
              i
              <span className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[0.2em] h-[0.2em] bg-[#3DD3AE] rounded-full" />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
export default Dotted