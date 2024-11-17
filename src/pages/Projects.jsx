import ColoredLink from '../components/ColoredLink';

const Projects = () => {
  const projects = [
    { url: 'https://spitfire1970.github.io/octris/', title: 'Octris!', description: 'A funkier tetris where you can place two blocks simultaneously leading to a lot more possiblities' },
    { url: 'https://spitfire1970.github.io/typing_game/', title: 'Typing Game', description: 'Type fast to eliminate the words before they catch you!' },
    { url: 'https://spitfire1970.github.io/pixels2ascii/', title: 'Image to ASCII Art', description: 'Pixels to characters ez.' },
    { url: 'https://spitfire1970.github.io/birbs/', title: 'Birbs', description: 'Classic boids simulation but with a predator' },
  ];

  return (
    <div id="projects" className="container mx-auto px-4 py-6 max-w-4xl">
      <p id="note" className="text-xl mb-6 mx-4">
        I wish I could show <i>all</i> my projects here but for now this only contains my js-based projects
      </p>
      <hr className="border-gray-700 mb-6" />
      
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.title} className="group">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <span className="text-xl font-semibold text-amber-400">{project.title}</span>
              <div className="flex items-center gap-4">
                <ColoredLink 
                  to={project.url.split('/')[3]}
                  className="text-white hover:underline transition-all duration-200"
                >
                  Try it
                </ColoredLink>
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline transition-all duration-200"
                >
                  Visit
                </a>
              </div>
            </div>
            <p className="text-gray-400 mt-2">{project.description}</p>
            <hr className="border-gray-700 mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;