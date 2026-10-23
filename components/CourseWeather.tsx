import { getForecast } from "@/lib/weather";

export default async function CourseWeather({ suburb }: { suburb: string }) {
  const days = await getForecast(suburb);
  if (!days) return null;
  return (
    <section className="mt-10">
      <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">7 day forecast</h2>
      <p className="mt-1 text-sm text-white/60">Forecast for {suburb}. Daytime wind and rain, 6am to 6pm.</p>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((d) => (
          <li key={d.date} className="glass rounded-2xl p-3 text-center">
            <p className="text-xs uppercase tracking-[0.14em] text-white/50">{d.label}</p>
            <p className="mt-1 text-sm font-semibold">{d.sky}</p>
            <p className="mt-1 font-display text-2xl">
              {d.hi}° <span className="text-base text-white/50">{d.lo}°</span>
            </p>
            <p className="mt-1 text-xs text-white/70">Wind {d.windKmh} km/h</p>
            <p className="text-xs text-white/70">Rain {d.rainMm} mm</p>
            {d.good && <p className="mt-2 text-xs font-bold text-lime">Good golf day</p>}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-white/50">
        Weather data from{" "}
        <a href="https://api.met.no/" target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
          MET Norway
        </a>{" "}
        under CC BY 4.0. Area forecast only, so check conditions with the club before you travel.
      </p>
      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(`weather ${suburb} NSW 14 day`)}`}
        target="_blank"
        rel="noopener"
        className="mt-3 inline-block text-sm font-semibold text-lime underline-offset-4 hover:underline"
      >
        See more days for {suburb}
      </a>
    </section>
  );
}
