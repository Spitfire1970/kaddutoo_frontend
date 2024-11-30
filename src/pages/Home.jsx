const Home = () => {
    return (
      <div className="container mx-auto px-4 md:py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">

          <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">

            <div className="text-lg md:text-xl text-center">
              Hello hello. I am Nakul and this is my (sort of) personal website!
              I made this as part of my journey in learning fullstack web development but it has gradually turned into my playground for trying out cool things!
              Look around and stay tuned for more :) <br></br>
              Stuff in works: <span className="rotate-12 inline-block">Socket</span><span className="-skew-x-3 -skew-y-3 inline-block">-based</span> <span className="text-[#3DD3AE] scale-y-150 inline-block">Chess</span>
            </div>

            <div className="text-lg md:text-xl text-center">

            </div>

            <div className="text-gray-400 text-base md:text-lg text-center">
              <div className="underline mb-2">For admissions/recruiters 👇:</div>
              <p className="mb-4">
                I am graduating in June 2025 with a BSc in Computer Science from University College London (UCL) 
                with an expected first class honours. <br></br>
                {/* and I am interested in doing a fullstack job immediately upon graduation.  */}
                Please get in touch with me at my{' '}
                <a href="mailto:ngoyal7019@gmail.com" className="underline hover:text-gray-300 transition-colors">
                  email
                </a>.
              </p>
              <p className="mb-4">
                Tech stack used in this website&apos;s development: React, Express, MongoDB, Tailwind, Docker
              </p>
              <p>
                Tech stack I use these days: Nextjs, Tailwind, Express/Hono, Node.js, Postgres/MongoDB with 
                Prisma/Mongoose, Typescript, Docker, Turborepos/Monorepos
              </p>
            </div>
          </div>
  
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="text-lg md:text-xl mb-4">
              My calendar these days:
            </div>
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&bgcolor=%233dd3ae&hl=en_GB&mode=WEEK&showTitle=0&showPrint=0&src=bmdveWFsNzAxOUBnbWFpbC5jb20&color=%23039BE5"
              className="w-full h-[400px] border-2 border-solid"
              title="My Calendar"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;