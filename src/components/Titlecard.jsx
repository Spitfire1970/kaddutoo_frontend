import { useState } from 'react';
import { Link } from 'react-router-dom';
import Dotted from './Dotted';

const Titlecard = () => {
  const [clickedPronounce, setClickedPronounce] = useState(false);
  
  const pronounceClick = () => {
    new Audio("https://ssl.gstatic.com/dictionary/static/pronunciation/2024-04-19/audio/na/nakul_en_in_1.mp3").play();
  };

  return (
    <div className="my-6 px-4 flex justify-center">
      <div className="inline-flex flex-col items-center">
        <div className="flex justify-center items-baseline">
          {/* Name container */}
          <div>
            <Link to="/" className="no-underline">
              <p className="text-4xl md:text-5xl lg:text-7xl text-white m-0 p-0 leading-none">
                Nakul&apos;s
              </p>
            </Link>
          </div>

          {/* Mind text - baseline aligned with Nakul's */}
          <div className="ml-4">
            <Link to="/" className="no-underline">
              <p className="text-4xl md:text-5xl lg:text-7xl text-white leading-none">
                <Dotted text="mind" />
              </p>
            </Link>
          </div>
        </div>

        {/* Pronunciation guide positioned relative to the flex container */}
        <div className="relative h-8 mt-1 self-start -translate-x-[-5%]">
          <p
            className={`text-base cursor-pointer text-center transition-opacity duration-200 whitespace-nowrap ${
              clickedPronounce ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={pronounceClick}
            onMouseEnter={() => setClickedPronounce(true)}
            onMouseLeave={() => setClickedPronounce(false)}
          >
            नकुल | not-cool | knuckle(s)
          </p>
          
          <p
            className={`absolute inset-0 text-base cursor-pointer text-center transition-opacity duration-200 ${
              clickedPronounce ? 'opacity-100' : 'opacity-0'
            }`}
            title="click to hear pronunciation!"
            onClick={pronounceClick}
            onMouseEnter={() => setClickedPronounce(true)}
            onMouseLeave={() => setClickedPronounce(false)}
          >
            nuh·kul
          </p>
        </div>
      </div>
    </div>
  );
};

export default Titlecard;