/**
 * 7-day forecast for a course, by suburb.
 * Data: MET Norway Locationforecast (CC BY 4.0). Credit is shown on the page.
 * Coordinates are suburb centres to 4 decimals, so the forecast is for the area, not the exact tee.
 */
const SUBURB_COORDS: Record<string, [number, number]> = {
  "Little Bay": [-33.98, 151.25], "Colebee": [-33.73, 150.88], "Collaroy": [-33.73, 151.3],
  "Mona Vale": [-33.68, 151.3], "Allambie Heights": [-33.77, 151.25], "Bardwell Park": [-33.94, 151.12],
  "Northbridge": [-33.8, 151.22], "Woolooware": [-34.05, 151.14], "Cabramatta": [-33.89, 150.94],
  "Milperra": [-33.94, 150.99], "Palm Beach": [-33.6, 151.32], "North Manly": [-33.77, 151.27],
  "Asquith": [-33.69, 151.1], "St Marys": [-33.77, 150.77], "Rose Bay": [-33.87, 151.27],
  "Moore Park": [-33.89, 151.22], "Gledswood Hills": [-34.01, 150.78], "Lidcombe": [-33.86, 151.05],
  "Macquarie Links": [-33.99, 150.88], "Glen Alpine": [-34.09, 150.8], "Earlwood": [-33.92, 151.13],
  "Sylvania": [-34.01, 151.1], "Eastlakes": [-33.92, 151.22], "Beverley Park": [-33.98, 151.12],
  "Greystanes": [-33.82, 150.94], "Richmond": [-33.6, 150.75], "Beverly Hills": [-33.95, 151.08],
  "Avalon Beach": [-33.64, 151.33], "Balgowlah": [-33.79, 151.26], "Werrington": [-33.76, 150.74],
  "South Windsor": [-33.6, 150.78], "Warriewood": [-33.69, 151.3], "Canada Bay": [-33.86, 151.12],
  "Mulgoa": [-33.85, 150.65], "Bexley": [-33.95, 151.12], "North Bondi": [-33.89, 151.28],
  "North Rocks": [-33.78, 151.03], "Leonay": [-33.77, 150.64], "Concord": [-33.85, 151.1],
  "Girraween": [-33.81, 150.95], "Malabar": [-33.97, 151.25], "North Ryde": [-33.79, 151.13],
  "Narellan": [-34.04, 150.74], "Ebenezer": [-33.52, 150.87], "Pitt Town": [-33.6, 150.85],
  "Moorebank": [-33.94, 150.95], "Parramatta": [-33.82, 151.0], "Banksmeadow": [-33.95, 151.2],
  "Auburn": [-33.85, 151.03], "Guildford": [-33.85, 150.99], "Gordon": [-33.76, 151.15],
  "Glenmore Park": [-33.79, 150.67], "Castle Cove": [-33.78, 151.2], "Cammeray": [-33.82, 151.21],
  "Chatswood West": [-33.8, 151.17], "Bankstown Aerodrome": [-33.92, 150.99], "Miranda": [-34.03, 151.1],
  "Wallacia": [-33.87, 150.64], "Lane Cove": [-33.82, 151.16], "Mortdale": [-33.97, 151.08],
  "Prairiewood": [-33.87, 150.91],
};

export type Day = {
  date: string;
  label: string;
  hi: number;
  lo: number;
  rainMm: number;
  windKmh: number;
  sky: string;
  good: boolean;
};

const TZ = "Australia/Sydney";
const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false });
const dayFmt = new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short", day: "numeric" });

function skyOf(code: string): string {
  const c = code.replace(/_(day|night|polartwilight)$/, "");
  if (c.includes("thunder")) return "Storms";
  if (c.includes("snow") || c.includes("sleet")) return "Wintry";
  if (c.includes("heavyrain")) return "Heavy rain";
  if (c.includes("rain")) return "Showers";
  if (c === "fog") return "Fog";
  if (c === "clearsky") return "Sunny";
  if (c === "fair") return "Mostly sunny";
  if (c === "partlycloudy") return "Partly cloudy";
  if (c === "cloudy") return "Cloudy";
  return "Mixed";
}

type Step = {
  time: string;
  data: {
    instant: { details: { air_temperature?: number; wind_speed?: number } };
    next_1_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
    next_6_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
  };
};

export async function getForecast(suburb: string): Promise<Day[] | null> {
  const pt = SUBURB_COORDS[suburb];
  if (!pt) return null;
  try {
    const res = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${pt[0].toFixed(4)}&lon=${pt[1].toFixed(4)}`,
      { headers: { "User-Agent": "GolfMe/1.0 golfme.com.au sam@sbfractionalmarketing.com" }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { properties?: { timeseries?: Step[] } };
    const series = json.properties?.timeseries ?? [];
    const byDay = new Map<string, { temps: number[]; wind: number[]; rain: number; codes: string[]; label: string }>();
    for (const s of series) {
      const t = new Date(s.time);
      const key = ymd.format(t);
      const hr = Number(hourFmt.format(t)) % 24;
      const g = byDay.get(key) ?? { temps: [], wind: [], rain: 0, codes: [], label: dayFmt.format(t) };
      const temp = s.data.instant.details.air_temperature;
      if (temp !== undefined) g.temps.push(temp);
      if (hr >= 6 && hr < 18) {
        const w = s.data.instant.details.wind_speed;
        if (w !== undefined) g.wind.push(w * 3.6);
        const hourly = s.data.next_1_hours;
        if (hourly) g.rain += hourly.details?.precipitation_amount ?? 0;
        const code = (s.data.next_6_hours ?? hourly)?.summary?.symbol_code;
        if (code && hr >= 8 && hr <= 14) g.codes.push(code);
      }
      byDay.set(key, g);
    }
    const days: Day[] = [];
    for (const [date, g] of byDay) {
      if (g.temps.length < 4) continue;
      const windKmh = g.wind.length ? g.wind.reduce((a, b) => a + b, 0) / g.wind.length : 0;
      const rainMm = Math.round(g.rain * 10) / 10;
      const code = g.codes.length ? g.codes[Math.floor(g.codes.length / 2)] : "";
      days.push({
        date,
        label: g.label,
        hi: Math.round(Math.max(...g.temps)),
        lo: Math.round(Math.min(...g.temps)),
        rainMm,
        windKmh: Math.round(windKmh),
        sky: code ? skyOf(code) : "Mixed",
        good: rainMm < 1 && windKmh < 25,
      });
    }
    days.sort((a, b) => a.date.localeCompare(b.date));
    return days.length >= 3 ? days.slice(0, 7) : null;
  } catch {
    return null;
  }
}
