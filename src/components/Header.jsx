import ColoredLink from './ColoredLink';

const Header = () => {
  return (
    <header className="mt-5 flex w-4/5 justify-between px-4 mx-auto">
      <ColoredLink 
        to="/login" 
        className="hover:underline cursor-pointer"
      >
        are you Nakul? (log in)
      </ColoredLink>
      <ColoredLink 
        to="/donation" 
        className="hover:underline cursor-pointer"
      >
        buy me a coffee
      </ColoredLink>
    </header>
  );
}

export default Header