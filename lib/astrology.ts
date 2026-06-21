import "server-only";
import type { AstroProfile, BirthInfo } from "@/lib/types";

const ZODIAC: { sign: string; from: [number, number]; to: [number, number] }[] = [
  { sign: "Capricorn", from: [12, 22], to: [1, 19] },
  { sign: "Aquarius", from: [1, 20], to: [2, 18] },
  { sign: "Pisces", from: [2, 19], to: [3, 20] },
  { sign: "Aries", from: [3, 21], to: [4, 19] },
  { sign: "Taurus", from: [4, 20], to: [5, 20] },
  { sign: "Gemini", from: [5, 21], to: [6, 20] },
  { sign: "Cancer", from: [6, 21], to: [7, 22] },
  { sign: "Leo", from: [7, 23], to: [8, 22] },
  { sign: "Virgo", from: [8, 23], to: [9, 22] },
  { sign: "Libra", from: [9, 23], to: [10, 22] },
  { sign: "Scorpio", from: [10, 23], to: [11, 21] },
  { sign: "Sagittarius", from: [11, 22], to: [12, 21] },
];

/** Deterministic tropical sun sign from a YYYY-MM-DD string. */
export function sunSignFromDate(birthDate: string): string {
  const [, mStr, dStr] = birthDate.split("-");
  const m = Number(mStr);
  const d = Number(dStr);
  if (!m || !d) return "Unknown";
  for (const z of ZODIAC) {
    if (z.sign === "Capricorn") {
      if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricorn";
      continue;
    }
    const [fm, fd] = z.from;
    const [tm, td] = z.to;
    if ((m === fm && d >= fd) || (m === tm && d <= td)) return z.sign;
  }
  return "Unknown";
}

interface GeoResult {
  latitude: number;
  longitude: number;
  label: string;
}

/** Free, key-less geocoding via Open-Meteo. Returns null on any failure. */
async function geocode(place: string): Promise<GeoResult | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      place,
    )}&count=1&language=en&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data?.results?.[0];
    if (!hit) return null;
    return {
      latitude: hit.latitude,
      longitude: hit.longitude,
      label: [hit.name, hit.admin1, hit.country].filter(Boolean).join(", "),
    };
  } catch {
    return null;
  }
}

/** Compute moon + rising (and a flavor note) using a local ephemeris library. */
async function computeNatal(
  birthDate: string,
  birthTime: string,
  geo: GeoResult,
): Promise<{ moonSign?: string; risingSign?: string; chartNote?: string }> {
  try {
    const mod: any = await import("circular-natal-horoscope-js");
    const Origin = mod.Origin ?? mod.default?.Origin;
    const Horoscope = mod.Horoscope ?? mod.default?.Horoscope;
    if (!Origin || !Horoscope) return {};

    const [y, mo, d] = birthDate.split("-").map(Number);
    const [hh, mm] = birthTime.split(":").map(Number);

    const origin = new Origin({
      year: y,
      month: mo - 1, // library expects 0-indexed month
      date: d,
      hour: hh,
      minute: mm,
      latitude: geo.latitude,
      longitude: geo.longitude,
    });

    const horoscope = new Horoscope({
      origin,
      houseSystem: "whole-sign",
      zodiac: "tropical",
      aspectPoints: [],
      aspectWithPoints: [],
      aspectTypes: [],
      language: "en",
    });

    const bodies = horoscope.CelestialBodies ?? {};
    const moonSign: string | undefined = bodies?.moon?.Sign?.label;
    const risingSign: string | undefined = horoscope?.Ascendant?.Sign?.label;

    const extras: string[] = [];
    const mercury = bodies?.mercury?.Sign?.label;
    const venus = bodies?.venus?.Sign?.label;
    const mars = bodies?.mars?.Sign?.label;
    if (mercury) extras.push(`Mercury in ${mercury}`);
    if (venus) extras.push(`Venus in ${venus}`);
    if (mars) extras.push(`Mars in ${mars}`);

    return {
      moonSign,
      risingSign,
      chartNote: extras.length
        ? `${extras.join(", ")} (chart for ${geo.label})`
        : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Build the astrological profile. Sun sign is always derived from the date.
 * If a birth time AND place are supplied, attempt a fuller chart (moon/rising).
 * Degrades gracefully to sun-sign-only on any failure.
 */
export async function buildAstroProfile(birth: BirthInfo): Promise<AstroProfile> {
  const sunSign = sunSignFromDate(birth.birthDate);

  if (birth.birthTime && birth.birthPlace) {
    const geo = await geocode(birth.birthPlace);
    if (geo) {
      const natal = await computeNatal(birth.birthDate, birth.birthTime, geo);
      if (natal.moonSign || natal.risingSign) {
        return {
          sunSign,
          moonSign: natal.moonSign ?? null,
          risingSign: natal.risingSign ?? null,
          chartNote: natal.chartNote ?? null,
          hasFullChart: true,
        };
      }
    }
  }

  return {
    sunSign,
    moonSign: null,
    risingSign: null,
    chartNote: null,
    hasFullChart: false,
  };
}
