const MyInput = ({placeholder, f, ...props}) => {

    return (
        <input
        placeholder={placeholder}
        onChange={(e) => f(e.target.value)}
        className="px-3 py-1.5 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none focus:border-transparent"
        {...props}
        />
    );
  }
  
  export default MyInput;