const Tag = ({ label, color, className = "", ...props }) => {
  function shouldUseWhiteText(backgroundHex) {
    const hex = backgroundHex.replace(/^#/, '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance <= 0.5;
  }

  return (
    <div
      className={`
        px-2.5 py-1 
        rounded-lg 
        text-sm font-medium 
        cursor-pointer 
        transition-transform hover:scale-105
        ${className}
      `}
      title="Filter by tag!"
      style={{
        backgroundColor: color,
        color: shouldUseWhiteText(color) ? 'rgb(211, 211, 211)' : 'rgb(0, 0, 0)'
      }}
      {...props}
    >
      {label}
    </div>
  );
};

export default Tag;