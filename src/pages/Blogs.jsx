import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Blog from '../components/Blog';
import Tag from '../components/Tag';
import ViewOptions from "../components/ViewOptions";
import MyInput from "../components/MyInput";
import MyArea from "../components/MyArea";
import MyButton from "../components/MyButton";
import MyCross from "../components/MyCross";

const viewModes = {
  HIDE_ALL: 'hide_all',
  SHOW_ALL: 'show_all',
  SHOW_LATEST: 'show_latest'
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [add, setAdd] = useState(false);
  const [newBlog, setNewBlog] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTags, setNewTags] = useState([]);
  const [newColors, setNewColors] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newBackground, setNewBackground] = useState("#3DD3AE");
  const [viewMode, setViewMode] = useState(viewModes.SHOW_LATEST);
  const [expandedBlogs, setExpandedBlogs] = useState(new Set());

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const [daily_blogs, tags, colors] = useMemo(() => {
    const daily_blogs = blogs.filter((blog) => !blog.type).reverse();
    const temp_tags = new Set();
    const temp_colors = new Set();
    for (let i = 0; i < daily_blogs.length; i++) {
      const blog_tags = daily_blogs[i].tags;
      for (let j = 0; j < blog_tags.length; j++) {
        temp_tags.add(blog_tags[j].label);
        temp_colors.add(blog_tags[j].color);
      }
    }
    return [daily_blogs, [...temp_tags], [...temp_colors]];
  }, [blogs]);

  useEffect(() => {
    if (viewMode === viewModes.SHOW_ALL) {
      setExpandedBlogs(new Set(daily_blogs.map(blog => blog.datetime)));
    } else if (viewMode === viewModes.HIDE_ALL) {
      setExpandedBlogs(new Set());
    } else if (viewMode === viewModes.SHOW_LATEST && daily_blogs.length > 0) {
      setExpandedBlogs(new Set([daily_blogs[0].datetime]));
    }
  }, [viewMode, daily_blogs]);

    useEffect(() => {
      if (!daily_blogs.length) return;
  
      const handleHashChange = () => {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        console.log(hash)
        if (hash) {
          const blogExists = daily_blogs.some(blog => blog.datetime === hash);
          console.log(blogExists)
          if (blogExists) {
            setExpandedBlogs(new Set([hash]));
            requestAnimationFrame(() => {
              const element = document.getElementById(hash);
              console.log(element)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            });
          }
        }
      };
  
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, [daily_blogs]);

  const toggleBlog = (datetime) => {
    const newExpanded = new Set(expandedBlogs);
    if (newExpanded.has(datetime)) {
      newExpanded.delete(datetime);
    } else {
      newExpanded.add(datetime);
    }
    setExpandedBlogs(newExpanded);
  };
  
  const add_blog = () => {
    if (!add) {
      setAdd(true);
    } else if (!newBlog) {
      return;
    } else {
      let updatedTags = [...newTags];
      let updatedColors = [...newColors];
      if (newTag.length > 0) {
        updatedTags = [...updatedTags, newTag];
        updatedColors = [...updatedColors, newBackground];
      }
      const datetime = new Date();
      const blogObject = {
        content: newBlog,
        tags: updatedTags.map((tag, index) => ({ label: tag, color: updatedColors[index] })),
        datetime: datetime.toLocaleString('en-UK', {
          month: "short", year: "numeric", day: "numeric",
          hour: "numeric", minute: "numeric", second: "numeric", hour12: true
        }),
        rating: newRating
      };
      axios
        .post('/api/blogs', blogObject)
        .then(response => {
          setBlogs(blogs.concat(response.data));
          setNewBlog('');
          setNewTag('');
          setNewBackground('#3DD3AE');
          setNewRating(5);
          setNewTags([]);
          setNewColors([]);
        });
      setAdd(false);
    }
  };

  const choose_tag = (tag, color) => {
    return () => {
      if (newTags.includes(tag)) {
        setNewTags(newTags.filter((tagg) => tagg !== tag));
        setNewColors(newColors.filter((colorr) => colorr !== color));
      } else {
        setNewTags(newTags.concat(tag));
        setNewColors(newColors.concat(color));
      }
    };
  };

  return (
    <div className="flex flex-col justify-between items-center space-y-4 w-full py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ViewOptions viewMode = {viewMode} setViewMode={setViewMode} viewModes = {viewModes}/>

      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="flex-1 space-y-2">
          {daily_blogs.map((blog) => (
            <Blog
              key={blog.blog_id}
              blog={blog}
              isExpanded={expandedBlogs.has(blog.datetime)}
              onToggle={() => toggleBlog(blog.datetime)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-start w-full max-w-2xl">

        {add && (
          <MyCross 
            f={setAdd}
          />
        )}
        <div className="flex flex-col items-center space-y-4 w-full">
          {add && (
            <>
              <MyArea
                rows="5"
                f={setNewBlog}
                placeholder="Write your blog post..."
              />
              <div className="flex items-center w-full relative">
                <MyInput
                  className="w-full accent-emerald-400"
                  value={newRating}
                  f={setNewRating}
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                />
                <span className="absolute -right-8 text-white">{newRating}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white">Choose tags:</span>
                {tags.map((tag, index) => (
                  <Tag
                    className={newTags.includes(tag) ? 'animate-tag-dance' : ''}
                    onClick={choose_tag(tag, colors[index])}
                    key={tag + tags.length}
                    label={tag}
                    color={colors[index]}
                  />
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-white">New tag:</span>
                <MyInput
                  placeholder="Enter tag name"
                  value={newTag}
                  f={setNewTag}
                />
                <MyInput
                  type="color"
                  value={newBackground}
                  f={setNewBackground}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </>
          )}
          <MyButton
            onClick={add_blog}
            variable={add}
            text_true='Add blog'
            text_false='New blog'
          />
        </div>
      </div>
    </div>
  );
};

export default Blogs;