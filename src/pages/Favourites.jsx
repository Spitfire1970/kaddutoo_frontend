import {useState, useEffect} from 'react'
import axios from 'axios'
import Favourite from '../components/Favourite'
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import MyButton from '../components/MyButton';
import MyInput from '../components/MyInput';
import MyCross from '../components/MyCross';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [add, setAdd] = useState(false);
  const [result, setResult] = useState('');
  const [newFavourite, setNewFavourite] = useState('');
  const [alert, setAlert] = useState(true);
  const [gridCols, setGridCols] = useState(4);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setInitLoading(true);
        const response = await axios.get('/api/favourites');
        setInitLoading(false);
        setFavourites(response.data.reverse());
      } catch (error) {
        console.error('Error fetching favourites:', error);
      }
    };
    fetchFavourites();
  }, []);

  useEffect(() => {
    const calculateGridCols = () => {
      const itemCount = favourites.length;
      const width = window.innerWidth;
      
      if (width < 640) return 2;
      if (width < 768) return 3;
      if (itemCount <= 4) return 2;
      if (itemCount <= 9) return 3;
      if (itemCount <= 16) return 4;
      return 5;
    };

    const handleResize = () => {
      setGridCols(calculateGridCols());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [favourites]);

  const addFavourite = () => {
    if (!add) {
      setAdd(true);
    } else if (!newFavourite) {
      return;
    } else {
      setLoading(true);
      const favouriteObject = { title: newFavourite };
      
      axios
        .post('/api/favourites', favouriteObject)
        .then(response => {
          if (response.data) {
            setResult('added! :)');
            setFavourites(favourites.concat(response.data));
          } else {
            setResult("couldn't scrape properly :(");
          }
          setNewFavourite('');
          setLoading(false);
          setAdd(false);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center space-y-6" style={{ maxHeight: '90vh' }}>
      {initLoading && (
        <div className="text-center text-gray-600">
          loading... please don&apos;t leave :D
        </div>
      )}

      <div className="w-full overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
        <div 
          className="grid gap-4 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            maxWidth: '1400px'
          }}
        >
          {favourites.map((favourite) => (
            <Favourite
              key={favourite.favourite_id}
              {...favourite}
            />
          ))}
        </div>
      </div>

      {!initLoading && alert && (
        <Alert 
          severity="warning" 
          onClose={() => setAlert(false)}
          className="w-full max-w-2xl"
        >
          Unfortunately, I can&apos;t get the scraping to work on my hosting service due to browser driver issues (puppeteer things) so the below button won&apos;t do anything. I can only add new stuff from localhost.
        </Alert>
      )}

      {result && (
        <div className="text-center" style={{ color: '#3DD3AE' }}>{result}</div>
      )}

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-64">
            <div className="mb-2">adding new recommendation (let him cook)...</div>
            <LinearProgress style={{ color: '#3DD3AE' }} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {add && (
              <>
                <MyCross
                  f = {setAdd}
                />
                <MyInput value = {newFavourite} placeholder='' f={setNewFavourite} autoFocus/>
              </>
            )}
            <MyButton
              variable = {add}
              onClick={addFavourite}
              text_true = 'add to favourites'
              text_false = 'new favourite'
            >
            </MyButton>
          </div>
        )}
      </div>
    </div>
  );
};


export default Favourites;