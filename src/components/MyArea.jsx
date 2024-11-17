const MyArea = ({placeholder, rows, f, ...props}) => {

    return (
        <textarea
        rows={rows}
        onChange={(e) => f(e.target.value)}
        autoFocus
        className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 outline-none focus:ring-emerald-400 focus:border-transparent"
        placeholder={placeholder}
        {...props}
      />
    );
  }
  
  export default MyArea;