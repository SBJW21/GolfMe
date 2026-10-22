import { areaOfSuburb } from "./areas";
import { slugify } from "./suburbs";

export type Region =
  | "Northern Beaches"
  | "North Shore"
  | "Eastern Suburbs"
  | "Inner West"
  | "Western Sydney"
  | "Hawkesbury"
  | "South West"
  | "Southern Sydney";

export const regions: Region[] = [
  "Northern Beaches",
  "North Shore",
  "Eastern Suburbs",
  "Inner West",
  "Western Sydney",
  "Hawkesbury",
  "South West",
  "Southern Sydney",
];

const regionOfSuburb: Record<string, Region> = {
  "Little Bay": "Eastern Suburbs", "Rose Bay": "Eastern Suburbs", "Moore Park": "Eastern Suburbs",
  "Eastlakes": "Eastern Suburbs", "North Bondi": "Eastern Suburbs", "Malabar": "Eastern Suburbs",
  "Banksmeadow": "Eastern Suburbs",
  "Collaroy": "Northern Beaches", "Mona Vale": "Northern Beaches", "Allambie Heights": "Northern Beaches",
  "Palm Beach": "Northern Beaches", "North Manly": "Northern Beaches", "Avalon Beach": "Northern Beaches",
  "Balgowlah": "Northern Beaches", "Warriewood": "Northern Beaches",
  "Northbridge": "North Shore", "Asquith": "North Shore", "North Ryde": "North Shore", "Gordon": "North Shore",
  "Castle Cove": "North Shore", "Cammeray": "North Shore", "Chatswood West": "North Shore", "Lane Cove": "North Shore",
  "Earlwood": "Inner West", "Canada Bay": "Inner West", "Concord": "Inner West",
  "Colebee": "Western Sydney", "St Marys": "Western Sydney", "Lidcombe": "Western Sydney", "Greystanes": "Western Sydney",
  "Werrington": "Western Sydney", "Mulgoa": "Western Sydney", "North Rocks": "Western Sydney", "Leonay": "Western Sydney",
  "Girraween": "Western Sydney", "Parramatta": "Western Sydney", "Auburn": "Western Sydney", "Guildford": "Western Sydney",
  "Glenmore Park": "Western Sydney", "Wallacia": "Western Sydney", "Prairiewood": "Western Sydney",
  "Richmond": "Hawkesbury", "South Windsor": "Hawkesbury", "Ebenezer": "Hawkesbury", "Pitt Town": "Hawkesbury",
  "Cabramatta": "South West", "Milperra": "South West", "Gledswood Hills": "South West", "Macquarie Links": "South West",
  "Glen Alpine": "South West", "Narellan": "South West", "Moorebank": "South West", "Bankstown Aerodrome": "South West",
  "Bardwell Park": "Southern Sydney", "Woolooware": "Southern Sydney", "Sylvania": "Southern Sydney",
  "Beverley Park": "Southern Sydney", "Beverly Hills": "Southern Sydney", "Bexley": "Southern Sydney",
  "Miranda": "Southern Sydney", "Mortdale": "Southern Sydney",
};

export function regionOf(c: { suburb: string }): Region {
  return regionOfSuburb[c.suburb] ?? "Western Sydney";
}

export type Course = {
  slug: string;
  name: string;
  suburb: string;
  holes?: number;
  par?: number;
  website?: string;
};

/** Course names, suburbs, holes and par as listed by Fairway Finders (checked 22 Oct 2026). Blank means not stated there. */
export const courses: Course[] = [
  { slug: "st-michael-s-golf-club", name: "St. Michael's Golf Club", suburb: "Little Bay", holes: 18, par: 72 },
  { slug: "stonecutters-ridge-golf-club", name: "Stonecutters Ridge Golf Club", suburb: "Colebee", holes: 18, par: 71 },
  { slug: "long-reef-golf-course", name: "Long Reef Golf Course", suburb: "Collaroy", holes: 18, par: 71 },
  { slug: "mona-vale-golf-club", name: "Mona Vale Golf Club", suburb: "Mona Vale", holes: 18, par: 73 },
  { slug: "wakehurst-golf-club", name: "Wakehurst Golf Club", suburb: "Allambie Heights", holes: 18, par: 72 },
  { slug: "bardwell-valley-golf-club", name: "Bardwell Valley Golf Club", suburb: "Bardwell Park", holes: 18, par: 62 },
  { slug: "northbridge-golf-club", name: "Northbridge Golf Club", suburb: "Northbridge" },
  { slug: "the-coast-golf-club", name: "The Coast Golf Club", suburb: "Little Bay" },
  { slug: "woolooware-golf-course", name: "Woolooware Golf Course", suburb: "Woolooware" },
  { slug: "cabramatta-golf-club", name: "Cabramatta Golf Club", suburb: "Cabramatta" },
  { slug: "bankstown-golf-club", name: "Bankstown Golf Club", suburb: "Milperra" },
  { slug: "palm-beach-golf-club", name: "Palm Beach Golf Club", suburb: "Palm Beach" },
  { slug: "warringah-golf-club", name: "Warringah Golf Club", suburb: "North Manly" },
  { slug: "asquith-golf-club", name: "Asquith Golf Club", suburb: "Asquith" },
  { slug: "dunheved-golf-club", name: "Dunheved Golf Club", suburb: "St Marys" },
  { slug: "woollahra-golf-club", name: "Woollahra Golf Club", suburb: "Rose Bay" },
  { slug: "moore-park-golf", name: "Moore Park Golf", suburb: "Moore Park", holes: 18, par: 70, website: "https://mooreparkgolf.com.au" },
  { slug: "lakeside-golf-club-camden", name: "Lakeside Golf Club Camden", suburb: "Gledswood Hills" },
  { slug: "carnarvon-golf-course", name: "Carnarvon Golf Course", suburb: "Lidcombe" },
  { slug: "macquarie-links-international-golf-club", name: "Macquarie Links International Golf Club", suburb: "Macquarie Links" },
  { slug: "campbelltown-golf-club", name: "Campbelltown Golf Club", suburb: "Glen Alpine" },
  { slug: "marrickville-golf-club", name: "Marrickville Golf Club", suburb: "Earlwood" },
  { slug: "kareela-golf-course", name: "Kareela Golf Course", suburb: "Sylvania" },
  { slug: "eastlake-golf-course", name: "Eastlake Golf Course", suburb: "Eastlakes" },
  { slug: "beverley-park-golf-club", name: "Beverley Park Golf Club", suburb: "Beverley Park" },
  { slug: "cumberland-country-golf-club", name: "Cumberland Country Golf Club", suburb: "Greystanes" },
  { slug: "richmond-golf-club", name: "Richmond Golf Club", suburb: "Richmond" },
  { slug: "canterbury-public-golf-course", name: "Canterbury Public Golf Course", suburb: "Beverly Hills" },
  { slug: "avalon-golf-course", name: "Avalon Golf Course", suburb: "Avalon Beach" },
  { slug: "balgowlah-golf-club", name: "Balgowlah Golf Club", suburb: "Balgowlah" },
  { slug: "colonial-golf-and-footgolf-course", name: "Colonial Golf and Footgolf Course", suburb: "Werrington" },
  { slug: "windsor-golf-club", name: "Windsor Golf Club", suburb: "South Windsor" },
  { slug: "pittwater-golf-centre", name: "Pittwater Golf Centre", suburb: "Warriewood" },
  { slug: "barnwell-park-golf-club", name: "Barnwell Park Golf Club", suburb: "Canada Bay" },
  { slug: "glenmore-heritage-valley-golf-club", name: "Glenmore Heritage Valley Golf Club", suburb: "Mulgoa" },
  { slug: "bexley-golf-club", name: "Bexley Golf Club", suburb: "Bexley" },
  { slug: "bondi-golf-and-diggers-club", name: "Bondi Golf & Diggers Club", suburb: "North Bondi" },
  { slug: "muirfield-golf-club", name: "Muirfield Golf Club", suburb: "North Rocks" },
  { slug: "leonay-golf-course", name: "Leonay Golf Course", suburb: "Leonay" },
  { slug: "massey-park-golf-course", name: "Massey Park Golf Course", suburb: "Concord" },
  { slug: "fox-hills-golf-club", name: "Fox Hills Golf Club", suburb: "Girraween" },
  { slug: "randwick-golf-course", name: "Randwick Golf Course", suburb: "Malabar" },
  { slug: "north-ryde-golf-club", name: "North Ryde Golf Club", suburb: "North Ryde" },
  { slug: "camden-golf-club", name: "Camden Golf Club", suburb: "Narellan" },
  { slug: "hawkesbury-waters-golf-course", name: "Hawkesbury Waters Golf Course", suburb: "Ebenezer" },
  { slug: "lynwood-golf-and-country-club", name: "Lynwood Golf & Country Club", suburb: "Pitt Town", holes: 18, par: 72 },
  { slug: "brighton-lakes-recreation-and-golf-club", name: "Brighton Lakes Recreation & Golf Club", suburb: "Moorebank", holes: 18, par: 70 },
  { slug: "royal-australian-engineers-golf-club", name: "Royal Australian Engineers Golf Club", suburb: "Moorebank" },
  { slug: "parramatta-golf-club", name: "Parramatta Golf Club", suburb: "Parramatta" },
  { slug: "botany-golf-course", name: "Botany Golf Course", suburb: "Banksmeadow" },
  { slug: "auburn-golf-course", name: "Auburn Golf Course", suburb: "Auburn" },
  { slug: "woodville-public-golf-course", name: "Woodville Public Golf Course", suburb: "Guildford" },
  { slug: "gordon-golf-club", name: "Gordon Golf Club", suburb: "Gordon" },
  { slug: "penrith-golf-club", name: "Penrith Golf Club", suburb: "Glenmore Park" },
  { slug: "castle-cove-golf-club", name: "Castle Cove Golf Club", suburb: "Castle Cove" },
  { slug: "cammeray-golf-club", name: "Cammeray Golf Club", suburb: "Cammeray" },
  { slug: "macarthur-grange-country-club", name: "Macarthur Grange Country Club", suburb: "Gledswood Hills" },
  { slug: "newgreens-chatswood-golf-club", name: "Newgreens Chatswood Golf Club", suburb: "Chatswood West" },
  { slug: "georges-river-golf-course", name: "Georges River Golf Course", suburb: "Bankstown Aerodrome" },
  { slug: "sylvania-par-3-golf-and-soccer", name: "Sylvania Par 3 Golf and Soccer", suburb: "Miranda" },
  { slug: "wallacia-country-club", name: "Wallacia Country Club", suburb: "Wallacia" },
  { slug: "lane-cove-golf-club", name: "Lane Cove Golf Club", suburb: "Lane Cove" },
  { slug: "hurstville-golf-course", name: "Hurstville Golf Course", suburb: "Mortdale" },
  { slug: "fairfield-city-golf-course", name: "Fairfield City Golf Course", suburb: "Prairiewood" },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function coursesInArea(areaId: string) {
  return courses.filter((c) => areaOfSuburb(c.suburb)?.id === areaId);
}

export function courseSuburbSlug(c: Course) {
  return areaOfSuburb(c.suburb) ? slugify(c.suburb) : null;
}
