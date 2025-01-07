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

  const HalfBreak = () => {
    return (<>
      <div className="h-2"></div>
      </>
    )
  }
  return (
    <div className="content-center mx-auto lg:mx-6 align-center pt-4 max-w">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-xl lg:text-2xl text-center font-semibold">
              Any technology distinguishable from magic is insufficiently advanced
            </h1>
          </div>

          <div className="text-lg lg:text-xl text-center">
            Stuff in works: {' '}
            <span className="rotate-12 inline-block">Socket</span>
            <span className="-skew-x-3 -skew-y-3 inline-block">-based</span> {' '}
            <span className="text-[#3DD3AE] scale-y-150 inline-block">Chess</span>
          </div>

          <div>
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&bgcolor=%233dd3ae&hl=en_GB&mode=WEEK&showTitle=0&showPrint=0&src=bmdveWFsNzAxOUBnbWFpbC5jb20&color=%23039BE5"
              className="w-full h-[400px] border-2 border-solid rounded-lg"
              title="My Calendar"
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl mb-1">Total website visits since 6th Jan 2025:</h2>
            <div className="text-5xl font-bold text-yellow-300">{visits}</div>
          </div>
        </div>

        <div className="flex items-start justify-center">
          <div className="max-w">
            <p className="text-base text-center lg:font-serif italic leading-relaxed">
              Go placidly amid the noise and the haste, and remember what peace there may be in silence. As far as possible, without surrender, be on good terms with all persons.<HalfBreak/>

              Speak your truth quietly and clearly; and listen to others, even to the dull and the ignorant; they too have their story.<HalfBreak/>

              Avoid loud and aggressive persons; they are vexatious to the spirit. If you compare yourself with others, you may become vain or bitter, for always there will be greater and lesser persons than yourself.<HalfBreak/>

              Enjoy your achievements as well as your plans. Keep interested in your own career, however humble; it is a real possession in the changing fortunes of time.<HalfBreak/>

              Exercise caution in your business affairs, for the world is full of trickery. But let this not blind you to what virtue there is; many persons strive for high ideals, and everywhere life is full of heroism.<HalfBreak/>

              Be yourself. Especially do not feign affection. Neither be cynical about love; for in the face of all aridity and disenchantment, it is as perennial as the grass.<HalfBreak/>

              Take kindly the counsel of the years, gracefully surrendering the things of youth.<HalfBreak/>

              Nurture strength of spirit to shield you in sudden misfortune. But do not distress yourself with dark imaginings. Many fears are born of fatigue and loneliness.<HalfBreak/>

              Beyond a wholesome discipline, be gentle with yourself. You are a child of the universe no less than the trees and the stars; you have a right to be here.<HalfBreak/>

              And whether or not it is clear to you, no doubt the universe is unfolding as it should. Therefore be at peace with God, whatever you conceive Him to be. And whatever your labors and aspirations, in the noisy confusion of life, keep peace in your soul. With all its sham, drudgery and broken dreams, it is still a beautiful world. Be cheerful. Strive to be happy.<HalfBreak/>
              by Max Ehrmann, 1927
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home