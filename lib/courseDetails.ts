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
    bookingUrl: "https://longreefgolfclub.com.au/green-fees-publicsocial/",
    holeData: [
      { n: 1, par: 5, metres: 450 }, { n: 2, par: 3, metres: 152 }, { n: 3, par: 4, metres: 315 },
      { n: 4, par: 4, metres: 393 }, { n: 5, par: 4, metres: 352 }, { n: 6, par: 4, metres: 271 },
      { n: 7, par: 3, metres: 178 }, { n: 8, par: 4, metres: 298 }, { n: 9, par: 5, metres: 444 },
      { n: 10, par: 3, metres: 217 }, { n: 11, par: 4, metres: 374 }, { n: 12, par: 4, metres: 347 },
      { n: 13, par: 3, metres: 138, note: "Signature hole" }, { n: 14, par: 4, metres: 390 },
      { n: 15, par: 5, metres: 462 }, { n: 16, par: 4, metres: 415 }, { n: 17, par: 4, metres: 400 },
      { n: 18, par: 4, metres: 359 },
    ],
    checked: "23 October 2026",
    source: "https://longreefgolfclub.com.au/course-tour/",
  },
  "avalon-golf-course": {
    social: "Fully licensed with catering and BBQ",
    highlights: ["Public 9 hole course, established 1926", "Three heritage-listed buildings on site"],
    checked: "23 October 2026",
    source: "https://www.golf.org.au/avalon-golf-course",
  },
  "palm-beach-golf-club": {
    highlights: [
      "Sheltered by Barrenjoey Lighthouse between Pittwater and Palm Beach",
      "Hosts Pro-Am events",
    ],
    bookingUrl: "https://palmbeachgolf.miclub.com.au/cms/public-bookings/",
    checked: "23 October 2026",
    source: "https://www.sydney.com",
  },
  "mona-vale-golf-club": {
    bookingUrl: "https://mvgc.com.au/online-social-tee-bookings/",
    checked: "23 October 2026",
  },
  "wakehurst-golf-club": {
    highlights: ["Bushland setting with views over Manly Dam"],
    checked: "23 October 2026",
    source: "https://www.northernbeaches.nsw.gov.au/things-to-do/recreation-area",
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
    bookingUrl: "https://gordongolfcourse.com.au/cms/",
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
    social: "Clubhouse serving food and local drinks",
    highlights: ["Old-style links course with coastal views"],
    checked: "23 October 2026",
    source: "https://golf.org.au/bondi-golf-club-",
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
    highlights: ["Nine holes, described by the club as the fastest and friendliest on the Northern Beaches", "Daily social tee times can be booked online through the club's site or the pro shop"],
    checked: "23 October 2026",
    source: "http://www.balgowlahgolfclub.com.au/",
  },
};
