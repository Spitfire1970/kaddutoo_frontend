import React from 'react';
import Tag from './Tag';
import { ChevronDown } from "lucide-react";


const Blog = React.memo(({ blog, isExpanded, onToggle }) => {
  const backgroundColor = `rgb(${255 * (1 - (blog.rating / 10))}, ${255 * blog.rating / 10}, 0)`;
  
  return (
    <div id = {blog.datetime} className="w-full">
      <div 
        onClick={onToggle}
        className="w-full transition-all duration-300 ease-in-out"
      >
        <div className={`rounded-lg border border-white hover:border-emerald-400 transition-colors overflow-hidden ${
          isExpanded ? 'bg-black' : ''
        }`}>
          <div className="p-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
              <div className="flex items-center justify-between md:justify-start gap-4">
                <time className="text-sm text-gray-300">{blog.datetime}</time>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Rating: {blog.rating}</span>
                  <a href={`#${encodeURIComponent(blog.datetime)}`}>
                    <div
                      className="w-4 h-4 rounded cursor-pointer hover:opacity-80"
                      style={{ backgroundColor }}
                    />
                  </a>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((tag, index) => (
                  <Tag
                    key={tag.label + index}
                    label={tag.label}
                    color={tag.color}
                  />
                ))}
              </div>
            </div>
            
            {isExpanded && (
              <div className="mt-2 text-white whitespace-pre-wrap">
                {blog.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Blog.displayName = 'Blog';
export default Blog;