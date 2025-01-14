const Footer = () => {
    const socialLinks = [
      { href: 'mailto:ngoyal7019@gmail.com', img: 'https://utfs.io/f/b69b000b-7a89-4034-a9a4-85eaf653d6f2-bm4a8d.png', id: 'mail' },
      { href: 'https://github.com/Spitfire1970', img: 'https://utfs.io/f/46ec3250-b2e5-406e-9e4d-b5a0bd57cff9-8zmc69.png', id: 'github' },
      { href: 'https://www.linkedin.com/in/nakul404/', img: 'https://utfs.io/f/6302d782-4f86-470a-be18-f6d051d2d43c-je4fvq.png', id: 'linkedin' },
      { href: 'https://www.instagram.com/na_kewl', img: 'https://utfs.io/f/69e7ac22-dc89-4dad-bd01-2db8fc4ffb54-l8hj5e.png', id: 'instagram' },
      { href: 'https://www.youtube.com/channel/UCrUiOmNXqH5eGrRUN9DjBXQ', img: 'https://utfs.io/f/6bd3eaec-21bb-4a35-b7b1-cbac2f7164a3-oa22gw.png', id: 'youtube' },
      { href: 'https://www.duolingo.com/profile/spitfire7019', img: 'https://utfs.io/f/181e1465-241d-4354-9cac-08af700a4a79-x9lx7z.png', id: 'duo' },
      { href: 'https://letterboxd.com/spitfire7019/', img: 'https://1q563ni2c3.ufs.sh/f/DFPZ9taLSVwPHdBJgM7k9I8S7WhjoUet1NazgPdluyKBD4vE', id: 'letterboxd' },
      // { href: 'https://www.chess.com/member/spitfire7019', img: 'https://1q563ni2c3.ufs.sh/f/DFPZ9taLSVwP7y2HDdYQZIKd9JDqB6z0TtNunmCgsxjwV3Pe', id: 'chess' },
      { href: 'https://leetcode.com/u/Spitfire1970/', img: 'https://1q563ni2c3.ufs.sh/f/DFPZ9taLSVwP2KpOwWF0qNmpiXZY5WJdx7hDVjLec1gfG9KI', id: 'leetcode' },
      // { href: 'https://www.strava.com/athletes/129254689', img: 'https://1q563ni2c3.ufs.sh/f/DFPZ9taLSVwPiqKI8LPcTygKrXiB85I4Wv0U9hQsmazeZCER', id: 'strava' },
    ];
  
    return (
      <footer className="flex h-[50px] w-4/5 mb-5 mt-8 gap-8 sm:gap-12 justify-center flex-wrap mx-auto">
        {socialLinks.map(({ href, img, id }) => (
          <a
            key={id}
            href={href}
            target={href.startsWith('mailto:') ? undefined : "_blank"}
            rel={href.startsWith('mailto:') ? undefined : "noopener noreferrer"}
            className="flex justify-center items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={img}
              alt={id}
              className="h-5 w-auto flex-shrink-0"
            />
          </a>
        ))}
      </footer>
    );
  }

export default Footer