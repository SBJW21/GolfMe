/**
 * Extra course details, keyed by course slug. Only facts stated by the club's own site or an
 * official source are recorded. Anything unknown is left out and simply not shown.
 */
export type HoleInfo = { n: number; par?: number; metres?: number; note?: string };

export type CourseDetails = {
  bar?: string;
  social?: string;
  parking?: string;
  nearestTrain?: string;
  nearestBus?: string;
  highlights?: string[];
  /** Coach-written note on how the course plays. Only shown when present. */
  howItPlays?: string;
  howItPlaysBy?: string;
  bookingUrl?: string;
  holeData?: HoleInfo[];
  checked?: string;
  source?: string;
};

export const courseDetails: Record<string, CourseDetails> = {
  "long-reef-golf-course": {
    social: "Café overlooking Fisherman's Beach and Long Reef Headland, plus a function centre and outdoor terrace",
    highlights: [
      "Links course with ocean views, founded in 1921",
      "The 13th is the signature hole",
      "Known as one of Sydney's best wet-weather courses",
    ],
    holeData: [
      { n: 1, par: 5, metres: 450, note: "Out of bounds and a creek. Ladies' tees 433 m" }, { n: 2, par: 3, metres: 152, note: "Narrow two tier green. Ladies' tees 134 m" },
      { n: 3, par: 4, metres: 315, note: "Sharp dogleg left. Ladies' tees 261 m" }, { n: 4, par: 4, metres: 393, note: "Fairway bunkers. Par 5 from the ladies' tees (366 m)" },
      { n: 5, par: 4, metres: 352, note: "Water left, two tier green. Ladies' tees 292 m" }, { n: 6, par: 4, metres: 271, note: "Birdie chance, creek at the front of the green. Ladies' tees 257 m" },
      { n: 7, par: 3, metres: 178, note: "Bunkers and water to carry. Ladies' tees 120 m" }, { n: 8, par: 4, metres: 298, note: "Short par 4, small green. Ladies' tees 286 m" },
      { n: 9, par: 5, metres: 444, note: "Short par 5, usually into the wind. Ladies' tees 426 m" }, { n: 10, par: 3, metres: 217, note: "Long and uphill. Ladies' tees 169 m" },
      { n: 11, par: 4, metres: 374, note: "Slight downhill dogleg right. Ladies' tees 358 m" }, { n: 12, par: 4, metres: 347, note: "Bunkers on fairway and green. Ladies' tees 302 m" },
      { n: 13, par: 3, metres: 138, note: "Signature hole, wind is the key. Ladies' tees 99 m" }, { n: 14, par: 4, metres: 390, note: "Downhill with cross bunkers. Ladies' tees 372 m" },
      { n: 15, par: 5, metres: 462, note: "Uphill par 5, reachable by big hitters. Ladies' tees 372 m" }, { n: 16, par: 4, metres: 415, note: "Out of bounds and sea left. Par 5 from the ladies' tees (404 m)" },
      { n: 17, par: 4, metres: 400, note: "Thin fairway, raised green. Ladies' tees 340 m" }, { n: 18, par: 4, metres: 359, note: "Bunkered fairway, good finishing hole. Ladies' tees 312 m" },
    ],
    checked: "24 October 2026",
    source: "https://longreefgolfclub.com.au/course-tour/",
  },

  "avalon-golf-course": {
    social: "Fully licensed with catering and BBQ",
    highlights: ["Public 9 hole course, established 1926", "Three heritage-listed buildings on site", "Hole by hole par and lengths published by the course"],
    holeData: [
      { n: 1, par: 3, metres: 121, note: "Aim left so the ball drifts to the green" }, { n: 2, par: 4, metres: 334, note: "Signature hole. Narrow gap in the trees, favour the right" },
      { n: 3, par: 3, metres: 98, note: "Uphill over water to a two tier green" }, { n: 4, par: 3, metres: 128, note: "Uphill, often plays a club longer" },
      { n: 5, par: 3, metres: 96, note: "Short, but a miss can roll 30 m back" }, { n: 6, par: 4, metres: 242, note: "Iron off the tee is the smart play" },
      { n: 7, par: 4, metres: 285, note: "Elevated tee, green slopes front to back" }, { n: 8, par: 5, metres: 359, note: "Plays long, straight up the hill" },
      { n: 9, par: 3, metres: 128, note: "Scenic finish, land it on the right" },
    ],
    checked: "24 October 2026",
    source: "https://avalongolfcourse.com.au/course/",
  },

  "palm-beach-golf-club": {
    highlights: ["Sheltered by Barrenjoey Lighthouse between Pittwater and Palm Beach", "Nine holes, par 64, 4,240 m, slope 115 as listed by the club", "Public golf is booked by phone with the club"],
    checked: "24 October 2026",
    source: "https://www.palmbeachgolf.com.au/golf",
  },

  "mona-vale-golf-club": {
    highlights: ["Hole by hole par and lengths published by the club for 18 holes"],
    holeData: [
      { n: 1, par: 5, metres: 485, note: "Ladies' tees 376 m" }, { n: 2, par: 3, metres: 172, note: "Ladies' tees 146 m" }, { n: 3, par: 5, metres: 458, note: "Ladies' tees 413 m" },
      { n: 4, par: 4, metres: 336, note: "Ladies' tees 300 m" }, { n: 5, par: 5, metres: 505, note: "Ladies' tees 385 m" }, { n: 6, par: 3, metres: 177, note: "Ladies' tees 158 m" },
      { n: 7, par: 4, metres: 310, note: "Ladies' tees 299 m" }, { n: 8, par: 3, metres: 170, note: "Ladies' tees 136 m" }, { n: 9, par: 4, metres: 364, note: "Ladies' tees 358 m" },
      { n: 10, par: 4, metres: 323, note: "Ladies' tees 279 m" }, { n: 11, par: 5, metres: 480, note: "Ladies' tees 443 m" }, { n: 12, par: 4, metres: 329, note: "Ladies' tees 309 m" },
      { n: 13, par: 5, metres: 470, note: "Ladies' tees 430 m" }, { n: 14, par: 3, metres: 134, note: "Ladies' tees 109 m" }, { n: 15, par: 4, metres: 408, note: "Ladies' tees 379 m. Par 5 from the ladies' tees" },
      { n: 16, par: 3, metres: 133, note: "Ladies' tees 109 m" }, { n: 17, par: 4, metres: 373, note: "Ladies' tees 314 m" }, { n: 18, par: 4, metres: 378, note: "Ladies' tees 330 m" },
    ],
    checked: "24 October 2026",
    source: "https://www.mvgc.com.au/cms/course/hole-1/",
  },
  "wakehurst-golf-club": {
    highlights: ["Bushland setting with views over Manly Dam", "Hole by hole par and lengths published by the club for 18 holes (Black tees shown)"],
    holeData: [
      { n: 1, par: 4, metres: 288, note: "Dogleg left, out of bounds right. Ladies' tees 257 m" }, { n: 2, par: 4, metres: 366, note: "Elevated tee, two tier green. Ladies' tees 314 m" },
      { n: 3, par: 4, metres: 355, note: "Water in front of the green. Ladies' tees 307 m" }, { n: 4, par: 5, metres: 503, note: "Blind second shot. Ladies' tees 388 m" },
      { n: 5, par: 3, metres: 134, note: "Narrow green, aim right third. Ladies' tees 119 m" }, { n: 6, par: 4, metres: 313, note: "Out of bounds right all the way. Ladies' tees 307 m" },
      { n: 7, par: 4, metres: 300, note: "Water in front of the green, lay up. Ladies' tees length not listed" }, { n: 8, par: 5, metres: 528, note: "Dogleg left, two tier green. Ladies' tees 447 m" },
      { n: 9, par: 4, metres: 286, note: "Uphill dogleg right to an elevated green. Ladies' tees 269 m" }, { n: 10, par: 4, metres: 320, note: "Steep drop and out of bounds right. Ladies' tees 285 m" },
      { n: 11, par: 4, metres: 395, note: "Out of bounds left, penalty area to carry. Ladies' tees 356 m" }, { n: 12, par: 4, metres: 394, note: "Downhill, out of bounds left. Ladies' tees 391 m" },
      { n: 13, par: 3, metres: 155, note: "Elevated tee, bush around the green. Ladies' tees 118 m" }, { n: 14, par: 4, metres: 407, note: "Hidden hazard left of the fairway. Ladies' tees 379 m" },
      { n: 15, par: 5, metres: 470, note: "Dogleg right, tiered green. Ladies' tees 444 m" }, { n: 16, par: 3, metres: 198, note: "Water in front of the green. Ladies' tees 136 m" },
      { n: 17, par: 4, metres: 378, note: "Trees both sides, bunker right of the green. Ladies' tees 350 m" }, { n: 18, par: 4, metres: 344, note: "Slight dogleg left to an elevated green. Ladies' tees 323 m" },
    ],
    checked: "24 October 2026",
    source: "https://www.wakehurstgolf.com.au/cms/course/hole-1/",
  },

  "north-ryde-golf-club": {
    highlights: ["Public course with tight, undulating tree-lined fairways, water hazards and bunkers", "5,323 metres from the back tees"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/north-ryde-golf-club/",
  },
  "asquith-golf-club": {
    highlights: ["Public course set in bushland near Hornsby, just off the Mount Colah exit of the Sydney to Newcastle expressway"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/asquith-golf-club",
  },
  "gordon-golf-club": {
    social: "Clubhouse with an Italian restaurant and venue hire",
    highlights: ["Pro shop with drive carts, pull buggies and club hire", "Private lessons available from the club pros"],
    checked: "23 October 2026",
    source: "https://www.krg.nsw.gov.au/Things-to-do/Parks-playgrounds-and-sportsfields/Gordon-Golf-Course",
  },
  "northbridge-golf-club": {
    social: "Restaurant plus function and conference spaces",
    highlights: ["Harbour views over Middle Harbour, about 10 minutes from the Sydney CBD"],
    checked: "23 October 2026",
    source: "https://www.sydney.com/destinations/sydney/sydney-north/attractions/northbridge-golf-club",
  },
  "castle-cove-golf-club": {
    highlights: ["Public 9 hole course with views of bushland and native birdlife", "Visitors welcome"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/castlecove-country-club/",
  },
  "cammeray-golf-club": {
    bar: "Two beer gardens overlooking the course",
    social: "Lusso Kitchen serving pizza and burgers",
    highlights: ["Public 9 hole par 3 course", "Pro shop on site"],
    checked: "23 October 2026",
    source: "https://cammeraygolf.com.au/about",
  },
  "lane-cove-golf-club": {
    bar: "Clubhouse with bar, dining and function facilities",
    social: "Large terrace overlooking the 9th and 18th fairway",
    highlights: ["Public 9 hole course with two alternative tees and greens", "Visitors welcome"],
    checked: "23 October 2026",
    source: "https://golf.org.au/lane-cove-golf-club",
  },
  "st-michael-s-golf-club": {
    social: "Clubhouse built in 1963",
    highlights: ["Par 72 course along the shores of Little Bay, with the first nine opened in 1938", "Has hosted the Australian PGA and the NSW Open"],
    checked: "23 October 2026",
    source: "https://stmichaelsgolf.com.au/cms/?p=167",
  },
  "bondi-golf-and-diggers-club": {
    social: "Bar and bistro on site",
    highlights: ["Old-style links course with 360 degree views of the Tasman Sea, Sydney skyline and Bondi Beach", "Nine par 3 holes", "Public social play, no booking needed for individuals. Groups of 10 or more book with the pro shop"],
    holeData: [
      { n: 1, par: 3 }, { n: 2, par: 3 },
      { n: 3, par: 3 }, { n: 4, par: 3 },
      { n: 5, par: 3 }, { n: 6, par: 3 },
      { n: 7, par: 3 }, { n: 8, par: 3 },
      { n: 9, par: 3 },
    ],
    checked: "24 October 2026",
    source: "https://www.bondigolf.com.au/cms/play-golf/",
  },

  "randwick-golf-course": {
    social: "Bay Window Restaurant",
    highlights: ["Par 59, 3,545 metres, an easy walk", "A round takes about four hours", "Open to the public all day Monday and Friday and in the afternoons on other days"],
    checked: "23 October 2026",
    source: "https://www.sydney.com/destinations/sydney/sydney-east/maroubra/attractions/randwick-golf",
  },
  "barnwell-park-golf-club": {
    social: "On-site restaurant and pro shop, with social and corporate bookings welcome",
    highlights: ["Par 61 for men and 62 for women, 3,400 metres", "Open 7 days from sunrise to sunset, weekend bookings essential", "Group and individual lessons for adults and juniors from the pro shop", "Footgolf offered"],
    checked: "23 October 2026",
    source: "https://www.canadabay.nsw.gov.au/community/community-services/golf-courses",
  },
  "massey-park-golf-course": {
    social: "Pro shop with club, pull buggy and motorised cart hire",
    highlights: ["Relatively flat, easy-to-walk course with views of Exile Bay and the city skyline", "Just under 5,000 metres"],
    checked: "23 October 2026",
    source: "https://www.canadabay.nsw.gov.au/community/community-services/golf-courses",
  },
  "stonecutters-ridge-golf-club": {
    social: "Clubhouse that the closing holes lead back to",
    highlights: ["Greg Norman and Bob Harrison design from 2012, 6,257 metres", "Wetlands and water hazards on about half the holes", "Hosted the NSW Open twice", "Public access"],
    checked: "23 October 2026",
    source: "https://golf.org.au/stonecutters-ridge-golf-club-",
  },
  "parramatta-golf-club": {
    highlights: ["9 hole par 31 course of 1,897 metres, less than 1 km from Parramatta city centre"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/parramatta-golf-club/",
  },
  "richmond-golf-club": {
    social: "Clubhouse for casual dining, functions and weddings",
    nearestTrain: "East Richmond station, next to the clubhouse",
    highlights: ["Championship and social tee options", "Bentgrass greens with kikuyu fairways", "Corporate packages with lesson clinics from the club's PGA professional"],
    checked: "23 October 2026",
    source: "https://www.golfaustralia.com.au/news/review-richmond-golf-club-427763",
  },
  "cabramatta-golf-club": {
    highlights: ["Penncross bent greens with kikuyu and couch fairways", "Water on many holes and elevated tees", "Bookings essential, soft spikes required"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/cabramatta-golf-club/",
  },
  "woolooware-golf-course": {
    social: "Clubhouse overlooking the course",
    highlights: ["Public 18 hole course", "Disabled access available, contact the operator for details"],
    checked: "23 October 2026",
    source: "https://www.sydney.com/destinations/sydney/sydney-south/cronulla/attractions/woolooware-golf-course",
  },
  "bexley-golf-club": {
    social: "Pro shop with food and drinks",
    highlights: ["Three six-hole loops, so shorter rounds are possible", "4,097 metres with tree-lined fairways and two dams", "Coaching programs including clinics, ladies, seniors and junior MyGolf"],
    checked: "23 October 2026",
    source: "https://www.insidegolf.com.au/course-reviews/club-of-the-month-time-friendly-and-unique/",
  },
  "canterbury-public-golf-course": {
    social: "Snacks and drinks at the shop, plus BBQ facilities",
    highlights: ["Council-run 9 hole course open seven days a week", "Motorised carts, clubs and buggies for hire, with professional advice and tuition"],
    checked: "23 October 2026",
    source: "https://www.cbcity.nsw.gov.au/canterbury-golf-course",
  },
  "botany-golf-course": {
    social: "Pro shop with snacks and drinks",
    nearestBus: "Bus stop near the building entrance",
    parking: "Limited, on the road and onsite",
    highlights: ["9 hole par 33 course of 2,300 metres", "No booking needed, open seven days and first come, first served", "Groups limited to four players", "Open 6am to 7pm September to April, 6:30am to 5pm May to August"],
    checked: "23 October 2026",
    source: "https://www.bayside.nsw.gov.au/recreation/places/sporting-facilities/botany-golf-course",
  },
  "bardwell-valley-golf-club": {
    social: "Clubhouse with balconies overlooking the course",
    highlights: ["Par 62 course about 12 km south of the Sydney CBD"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/bardwell-valley-golf-club-/",
  },
  "moore-park-golf": {
    social: "Six Palms eat and drink, with function and corporate spaces",
    highlights: ["Driving range with Trackman bays, chipping and putting greens", "Adult and junior lesson programs, club fitting and regripping", "Free mobile app"],
    holeData: [{ n: 1, par: 4 }, { n: 2, par: 3 }, { n: 3, par: 4 }, { n: 4, par: 5 }, { n: 5, par: 3 }, { n: 6, par: 5 }, { n: 7, par: 3 }, { n: 8, par: 4 }, { n: 9, par: 4 }, { n: 10, par: 3 }, { n: 11, par: 5 }, { n: 12, par: 4 }, { n: 13, par: 3 }, { n: 14, par: 4 }, { n: 15, par: 3 }, { n: 16, par: 5 }, { n: 17, par: 4 }, { n: 18, par: 4 }],
    checked: "23 October 2026",
    source: "https://www.mooreparkgolf.com.au/play/the-course/",
  },
  "carnarvon-golf-course": {
    social: "Clubhouse with a restaurant overlooking the course",
    highlights: ["Kikuyu fairways and poa greens with mounds, bunkers and water hazards", "Public play times can change, so contact the club before arriving"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/carnarvon-golf-club-nsw",
  },
  "muirfield-golf-club": {
    highlights: ["Public course established in 1953", "About 10 minutes from Parramatta and 25 minutes from the Sydney CBD"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/muirfield-golf-club/",
  },
  "macquarie-links-international-golf-club": {
    highlights: ["Par 72 championship course", "Native grasslands, gum trees, creeks and lakes with a mix of links and bushland character"],
    checked: "23 October 2026",
    source: "https://www.sydney.com/destinations/sydney/sydney-west/campbelltown/attractions/macquarie-links-international-golf-club",
  },
  "lakeside-golf-club-camden": {
    social: "Clubhouse extension",
    highlights: ["Creeping bentgrass greens, couch fairways and pot bunkers"],
    checked: "23 October 2026",
    source: "https://www.australiangolfdigest.com.au/course-review-lakeside-golf-club-camden/",
  },
  "camden-golf-club": {
    bar: "Bar and restaurant, with Happy Grillmore Bistro open Tuesday to Sunday",
    highlights: ["5,903 metres for men and 5,383 metres for women"],
    checked: "23 October 2026",
    source: "https://www.nsw.gov.au/visiting-and-exploring-nsw/locations-and-attractions/camden-golf-club",
  },
  "colonial-golf-and-footgolf-course": {
    parking: "Car park on site",
    highlights: ["Bookings are essential and wet weather may affect the course"],
    checked: "23 October 2026",
    source: "https://www.nsw.gov.au/visiting-and-exploring-nsw/locations-and-attractions/colonial-golf-and-footgolf-course",
  },
  "balgowlah-golf-club": {
    highlights: ["Nine holes played twice for 18, described by the club as the fastest and friendliest on the Northern Beaches", "Hole by hole par and lengths published by the club (Blue tees shown)", "Social tee times can be booked online through the club site or the pro shop"],
    holeData: [
      { n: 1, par: 4, metres: 327, note: "Downhill, pond right of the green. Red tees 318 m" }, { n: 2, par: 3, note: "Creek left, pond right. Club page lengths for this hole are inconsistent so none shown" },
      { n: 3, par: 3, metres: 215, note: "One of the toughest par 3s on the Northern Beaches. Red tees 195 m" }, { n: 4, par: 4, metres: 259, note: "Shortest par 4 but tight. Red tees 243 m" },
      { n: 5, par: 4, metres: 312, note: "Shared double fairway with the 6th. Red tees 297 m" }, { n: 6, par: 4, metres: 411, note: "Stroke index 1 and the longest hole. Par 5 from the ladies' tees. Red tees 395 m" },
      { n: 7, par: 4, metres: 300, note: "Short par 4 over a hill. Red tees 279 m" }, { n: 8, par: 3, metres: 115, note: "Uphill, plays longer than it looks. Red tees 103 m" },
      { n: 9, par: 4, metres: 286, note: "Out of bounds left, slight dogleg. Red tees 275 m" },
    ],
    checked: "24 October 2026",
    source: "https://www.balgowlahgolfclub.com.au/cms/course/",
  },

  "warringah-golf-club": {
    highlights: ["Established 1936", "Easy to walk with one small hill at one end", "Hole by hole par and lengths published by the club (Men's Yellow tees shown)"],
    holeData: [
      { n: 1, par: 4, metres: 256 }, { n: 2, par: 4, metres: 396 },
      { n: 3, par: 5, metres: 454 }, { n: 4, par: 4, metres: 299 },
      { n: 5, par: 3, metres: 120 }, { n: 6, par: 4, metres: 340 },
      { n: 7, par: 3, metres: 144 }, { n: 8, par: 3, metres: 198 },
      { n: 9, par: 4, metres: 287 }, { n: 10, par: 5, metres: 404 },
      { n: 11, par: 4, metres: 241 }, { n: 12, par: 3, metres: 106 },
      { n: 13, par: 4, metres: 335 }, { n: 14, par: 3, metres: 111 },
      { n: 15, par: 5, metres: 421 }, { n: 16, par: 4, metres: 230 },
      { n: 17, par: 3, metres: 135 }, { n: 18, par: 4, metres: 360 },
    ],
    checked: "24 October 2026",
    source: "https://www.warringahgolfclub.com.au/the-course",
  },
};
