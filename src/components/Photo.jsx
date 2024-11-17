const Photo = ({ path, onClick, onEnter, onLeave }) => {
    return (
      <div 
        className="cursor-pointer aspect-square" 
        onClick={onClick} 
        onMouseEnter={onEnter} 
        onMouseLeave={onLeave}
      >
        <img 
          src={path} 
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
    );
  };
  
  export default Photo;