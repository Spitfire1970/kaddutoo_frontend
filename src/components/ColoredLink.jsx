import { Link, useLocation } from 'react-router-dom';

const ColoredLink = ({ to, children, className = '', ...props }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`${className} ${isActive ? 'text-[#3DD3AE]' : 'text-white'}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export default ColoredLink;