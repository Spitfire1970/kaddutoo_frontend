const MyButton = ({ type, onClick, variable, text_true, text_false }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-emerald-400 hover:bg-emerald-500 text-black rounded-lg transition-colors duration-200"
      type={type}
    >
      {variable ? text_true : text_false}
    </button>
  );
};

export default MyButton;