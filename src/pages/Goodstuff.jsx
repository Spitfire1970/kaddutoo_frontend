import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import MyCross from "../components/MyCross";
import MyArea from "../components/MyArea";

const Goodstuff = () => {
  const [quotes, setQuotes] = useState([]);
  const [add, setAdd] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  const [newYt, setNewYt] = useState('');
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const mainContentRef = useRef(null);
  const miniContentRef = useRef(null);
  const miniMapContainerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get('/api/goodstuff');
        setQuotes(response.data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    const calculateViewportHeight = () => {
      if (!mainContentRef.current || !miniMapContainerRef.current) return;
      const { clientHeight, scrollHeight } = mainContentRef.current;
      const miniMapHeight = miniMapContainerRef.current.clientHeight;
      const ratio = clientHeight / scrollHeight;
      setViewportHeight(miniMapHeight * ratio *4.5);
    };

    calculateViewportHeight();
    window.addEventListener('resize', calculateViewportHeight);
    return () => window.removeEventListener('resize', calculateViewportHeight);
  }, [quotes]);

  const updateScrollPosition = (newPosition) => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!mainContentRef.current || !miniContentRef.current) return;

      const normalizedPosition = Math.max(0, Math.min(1, newPosition));
      
      // Update main scroll
      const mainMaxScroll = mainContentRef.current.scrollHeight - mainContentRef.current.clientHeight;
      mainContentRef.current.scrollTop = mainMaxScroll * normalizedPosition;

      // Update mini content position
      const miniMaxScroll = miniContentRef.current.scrollHeight - miniMapContainerRef.current.clientHeight;
      miniContentRef.current.style.transform = `translateY(-${miniMaxScroll * normalizedPosition}px)`;

      setScrollPosition(normalizedPosition);
      isUpdatingRef.current = false;
    });
  };

  const handleMainScroll = (e) => {
    if (!mainContentRef.current || isUpdatingRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const newPosition = scrollTop / (scrollHeight - clientHeight);
    updateScrollPosition(newPosition);
  };

  const handleMiniMapInteraction = (e) => {
    e.preventDefault();
    if (!miniMapContainerRef.current) return;

    const { top, height } = miniMapContainerRef.current.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newPosition = (clientY - top) / height;
    updateScrollPosition(newPosition);
  };

  const yt = 'https://www.youtube-nocookie.com/embed/';

  const add_quote = () => {
    if (!add) {
      setAdd(true);
    } else if (!newQuote) {
      return;
    } else {
      const quoteObject = { text: newQuote, vid: newYt };
      axios.post('/api/goodstuff', quoteObject)
        .then(response => {
          setQuotes(quotes.concat(response.data));
          setNewQuote('');
          setNewYt('');
          setAdd(false);
        });
    }
  };

  const MainQuoteContent = ({ quote }) => (
    <div className="flex flex-col items-center gap-8">
      <p className="text-2xl md:text-4xl text-center leading-relaxed">
      “ {quote.text} ”
      </p>
      {quote.vid && (
        <div className="w-full max-w-3xl">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={yt + quote.vid}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="text-center mt-2 text-white">(video for more context)</p>
        </div>
      )}
    </div>
  );

  const MiniQuoteContent = ({ quote }) => (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[6px] max-w-[120px] text-center leading-[8px]">
      ” {quote.text} ”
      </p>
      {quote.vid && (
        <div className="w-[120px]">
          <div className="aspect-video bg-gray-800 overflow-hidden">
            <img 
              src={`https://img.youtube.com/vi/${quote.vid}/mqdefault.jpg`}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-[60vh]">
      {/* Mini-map navigation */}
      <div 
        ref={miniMapContainerRef}
        className="cursor-pointer relative w-full md:w-48 h-48 md:h-full overflow-hidden select-none"
        onMouseDown={(e) => {
          e.preventDefault();
          handleMiniMapInteraction(e);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleMiniMapInteraction(e);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          handleMiniMapInteraction(e);
        }}
        onTouchMove={handleMiniMapInteraction}
      >
        {/* Mini content */}
        <div 
          ref={miniContentRef}
          className="absolute inset-x-0 transition-transform duration-100 ease-out"
        >
          <div className="flex flex-col items-center justify-start gap-4 py-2">
            {quotes.map((quote, index) => (
              <div key={index} className="w-full px-2">
                <MiniQuoteContent quote={quote} />
              </div>
            ))}
          </div>
        </div>

        {/* Viewport indicator */}
        <div 
          className="absolute inset-x-0 bg-white/10 pointer-events-none border border-white/20 transition-transform duration-100 ease-out"
          style={{
            height: `${viewportHeight}px`,
            transform: `translateY(${scrollPosition * (miniMapContainerRef.current?.clientHeight - viewportHeight)}px)`
          }}
        />
      </div>

      {/* Main content */}
      <div 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleMainScroll}
      >
        <div className="flex flex-col items-center justify-start gap-24 py-12">
          {quotes.map((quote, index) => (
            <div key={index} className="w-full max-w-4xl px-4">
              <MainQuoteContent quote={quote} />
            </div>
          ))}
        </div>
      </div>

      {/* Add quote modal */}
      {add && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-xl">
            <div className="flex justify-end">
              <MyCross f={setAdd} />
            </div>
            <div className="flex flex-col gap-4">
              <MyArea rows="5" placeholder="Add quote" f={setNewQuote} />
              <MyInput placeholder="Add yt video id" f={setNewYt} />
              <MyButton onClick={add_quote} text_false="add new entry" />
            </div>
          </div>
        </div>
      )}

      {/* Add quote button */}
      {!add && (
        <button
          onClick={add_quote}
          className="fixed bottom-8 right-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg z-40"
        >
          Add Quote
        </button>
      )}
    </div>
  );
};

export default Goodstuff;