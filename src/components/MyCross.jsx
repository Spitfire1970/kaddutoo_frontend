const MyInput = ({f, ...props}) => {

    return (
        <button 
        className="text-3xl text-white hover:text-gray-300 transition-colors mr-2"
        onClick={() => f(false)}
        {...props}
        >
        ×
        </button>
    );
  }
  
  export default MyInput;