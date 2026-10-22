/**
 * Sydney search areas. Nearby suburbs are bundled so a golfer searching "Manly, Balgowlah,
 * Freshwater" also finds coaches in Fairlight, Seaforth and the other suburbs listed with it.
 * The three names in `headline` become the label. Areas are listed alphabetically.
 */
export type Area = { id: string; label: string; suburbs: string[] };

function area(headline: [string, string, string], also: string[] = []): Area {
  return {
    id: headline[0].toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: headline.join(", "),
    suburbs: [...headline, ...also],
  };
}

export const areas: Area[] = [
  area(["Alexandria", "Waterloo", "Zetland"], ["Green Square", "Rosebery", "Mascot", "Eveleigh", "Beaconsfield"]),
  area(["Ashfield", "Burwood", "Strathfield"], ["Croydon", "Summer Hill", "Concord", "Homebush", "Enfield", "Croydon Park", "Haberfield"]),
  area(["Balmain", "Rozelle", "Leichhardt"], ["Lilyfield", "Annandale", "Glebe", "Birchgrove", "Drummoyne", "Five Dock"]),
  area(["Blacktown", "Seven Hills", "Rooty Hill"], ["Mount Druitt", "Doonside", "Prospect", "Quakers Hill", "Marsden Park", "Toongabbie"]),
  area(["Bondi", "Bronte", "Tamarama"], ["Bondi Junction", "Waverley", "North Bondi", "Queens Park", "Bondi Beach"]),
  area(["Campbelltown", "Camden", "Narellan"], ["Macarthur", "Ingleburn", "Minto", "Leumeah", "Oran Park", "Gregory Hills"]),
  area(["Castle Hill", "Baulkham Hills", "Kellyville"], ["Bella Vista", "Rouse Hill", "Norwest", "Dural", "West Pennant Hills", "Cherrybrook", "The Ponds"]),
  area(["Chatswood", "Willoughby", "Artarmon"], ["Naremburn", "Castlecrag", "Northbridge", "Roseville", "Middle Cove"]),
  area(["Coogee", "Randwick", "Maroubra"], ["Clovelly", "Kensington", "Kingsford", "Matraville", "Malabar", "South Coogee"]),
  area(["Cronulla", "Caringbah", "Miranda"], ["Gymea", "Kirrawee", "Woolooware", "Taren Point", "Sylvania", "Kurnell"]),
  area(["Dee Why", "Collaroy", "Narrabeen"], ["Curl Curl", "Brookvale", "Cromer", "Wheeler Heights", "North Narrabeen", "Warriewood"]),
  area(["Epping", "Eastwood", "Ryde"], ["Macquarie Park", "West Ryde", "Denistone", "Marsfield", "Gladesville", "Meadowbank", "North Ryde"]),
  area(["Frenchs Forest", "Belrose", "Forestville"], ["Davidson", "Killarney Heights", "Allambie Heights", "Terrey Hills"]),
  area(["Hornsby", "Asquith", "Berowra"], ["Waitara", "Mount Colah", "Mount Kuring-gai", "Normanhurst", "Thornleigh"]),
  area(["Lane Cove", "Longueville", "Greenwich"], ["Riverview", "Hunters Hill", "Woolwich", "Northwood", "Linley Point"]),
  area(["Lindfield", "Killara", "Gordon"], ["Pymble", "Turramurra", "Wahroonga", "Warrawee", "St Ives", "East Lindfield", "Roseville Chase"]),
  area(["Liverpool", "Casula", "Moorebank"], ["Hoxton Park", "Prestons", "Cabramatta", "Warwick Farm", "Chipping Norton", "Lurnea"]),
  area(["Manly", "Balgowlah", "Freshwater"], ["Fairlight", "Queenscliff", "Seaforth", "Clontarf", "Manly Vale", "Balgowlah Heights"]),
  area(["Marrickville", "Newtown", "Enmore"], ["Erskineville", "St Peters", "Sydenham", "Tempe", "Dulwich Hill", "Stanmore", "Petersham"]),
  area(["Mona Vale", "Newport", "Avalon"], ["Bilgola", "Palm Beach", "Church Point", "Bayview", "Clareville", "Whale Beach"]),
  area(["Mosman", "Cremorne", "Neutral Bay"], ["Balmoral", "Cammeray", "Kirribilli", "Milsons Point", "Clifton Gardens"]),
  area(["North Sydney", "Lavender Bay", "Waverton"], ["Wollstonecraft", "McMahons Point", "Crows Nest", "St Leonards"]),
  area(["Paddington", "Woollahra", "Double Bay"], ["Edgecliff", "Darling Point", "Rose Bay", "Bellevue Hill", "Vaucluse", "Watsons Bay", "Point Piper"]),
  area(["Parramatta", "Westmead", "Harris Park"], ["Granville", "Auburn", "Wentworthville", "Northmead", "Rydalmere", "Merrylands", "Lidcombe"]),
  area(["Penrith", "St Marys", "Emu Plains"], ["Glenmore Park", "Jamisontown", "Cranebrook", "Kingswood", "Werrington", "Mulgoa"]),
  area(["Rockdale", "Kogarah", "Hurstville"], ["Arncliffe", "Banksia", "Bexley", "Carlton", "Penshurst", "Mortdale", "Beverly Hills", "Brighton-Le-Sands"]),
  area(["Sutherland", "Engadine", "Menai"], ["Heathcote", "Loftus", "Jannali", "Bangor", "Illawong", "Como"]),
  area(["Sydney CBD", "Pyrmont", "Surry Hills"], ["Darlinghurst", "Potts Point", "Ultimo", "Redfern", "Haymarket", "Barangaroo", "Woolloomooloo", "Sydney"]),
  area(["Bankstown", "Padstow", "Revesby"], ["Condell Park", "Yagoona", "Punchbowl", "Panania", "Chullora", "Greenacre"]),
].sort((a, b) => a.label.localeCompare(b.label));

export const OTHER_AREA_ID = "other";

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function areaOfSuburb(suburb: string): Area | undefined {
  const key = norm(suburb);
  return areas.find((a) => a.suburbs.some((s) => norm(s) === key));
}

/** True when a coach's suburb belongs to the chosen area id. "other" matches unlisted suburbs. */
export function suburbInArea(suburb: string, areaId: string) {
  const found = areaOfSuburb(suburb);
  return areaId === OTHER_AREA_ID ? !found : found?.id === areaId;
}
