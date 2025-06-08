import { useState, useEffect } from "react"
import axios from "axios"

const Home = () => {
  const [visits, setVisits] = useState(0)

  useEffect(() => {
    const fetchVisits = async () => {
      const response = await axios.get('/api/visits');
      setVisits(response.data.num_visits)
    }
    fetchVisits()
  }, [])

const HalfBreak = () => <div className="h-2" />;

return (
  <div className="flex flex-col items-center gap-8">
    <div className="flex md:flex-row flex-col w-full md:my-8 my-4">
      <div className="flex flex-col gap-8 md:w-1/2 items-center">
        <img
          src="https://1q563ni2c3.ufs.sh/f/DFPZ9taLSVwPaMp5OXh8wVrzbn9GJdytcSsxNqf7OPT6D2FQ"
          className="w-full max-w-[28rem] aspect-square object-cover rounded-full"
          alt="profile picture of me!"
        />
        <div className="flex flex-col text-lg lg:text-xl gap-2 text-center">
          <h1>
            Exhaustive list of all my clicky stuffs: <a href = "https://linktr.ee/nakul_goyal" target = "_blank" rel="noopener noreferrer" className = "text-yellow-300 hover:text-[#fbbf24]">linktree <sup> 🔗</sup></a>
          </h1>
          <div>
            Play against&nbsp;
            <a href="https://chess.nakul.one" target="_blank" rel="noopener noreferrer" className = "hover:text-[#fbbf24] text-yellow-300">
              <span className="-skew-x-3 skew-y-3 inline-block ">
                personalized
              </span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="scale-x-150 inline-block">
                chess
              </span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="scale-y-150 inline-block">
                models <sup> 🔗</sup>
              </span>
            </a>
          </div>
          CS Interests: Leveraging AI + Full stack<br></br>
           and more recently: RL and Systems
        </div>
      </div>
      <div className="md:w-1/2 md:mr-20">
        <div className="text-center md:mt-4 mt-8">
          <h2 className="text-2xl mb-1">
            Total website visits since 6th Jan 2025:
          </h2>
          <div className="text-5xl mb-4 font-bold text-yellow-300">
            {visits}
          </div>
        </div>
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&bgcolor=%233dd3ae&hl=en_GB&mode=WEEK&showTitle=0&showPrint=0&src=bmdveWFsNzAxOUBnbWFpbC5jb20&color=%23039BE5"
          className="w-full h-[460px] border-2 border-solid rounded-lg"
          title="My Calendar"
        />
      </div>

    </div>

    {/* <div className="text-center md:w-3/5 my-4">
        <p className="text-center lg:font-serif leading-relaxed space-y-2">
          Go placidly amid the noise and the haste, and remember what peace there may be in silence. As far as possible, without surrender, be on good terms with all persons.
          <HalfBreak />

          Speak your truth quietly and clearly; and listen to others, even to the dull and the ignorant; they too have their story.
          <HalfBreak />

          Avoid loud and aggressive persons; they are vexatious to the spirit. If you compare yourself with others, you may become vain or bitter, for always there will be greater and lesser persons than yourself.
          <HalfBreak />

          Enjoy your achievements as well as your plans. Keep interested in your own career, however humble; it is a real possession in the changing fortunes of time.
          <HalfBreak />

          Exercise caution in your business affairs, for the world is full of trickery. But let this not blind you to what virtue there is; many persons strive for high ideals, and everywhere life is full of heroism.
          <HalfBreak />

          Be yourself. Especially do not feign affection. Neither be cynical about love; for in the face of all aridity and disenchantment, it is as perennial as the grass.
          <HalfBreak />

          Take kindly the counsel of the years, gracefully surrendering the things of youth.
          <HalfBreak />

          Nurture strength of spirit to shield you in sudden misfortune. But do not distress yourself with dark imaginings. Many fears are born of fatigue and loneliness.
          <HalfBreak />

          Beyond a wholesome discipline, be gentle with yourself. You are a child of the universe no less than the trees and the stars; you have a right to be here.
          <HalfBreak />

          And whether or not it is clear to you, no doubt the universe is unfolding as it should. Therefore be at peace with God, whatever you conceive Him to be. And whatever your labors and aspirations, in the noisy confusion of life, keep peace in your soul. With all its sham, drudgery and broken dreams, it is still a beautiful world. Be cheerful. Strive to be happy.
          <HalfBreak />
          <em>by Max Ehrmann, 1927</em>
        </p>
    </div> */}
  </div>
);

}

export default Home