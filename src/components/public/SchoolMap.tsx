import { ExternalLinkIcon, MapPinIcon } from 'lucide-react';
import { SCHOOL } from '../../data/school';

const MAP_URL = 'https://www.openstreetmap.org/export/embed.html?bbox=36.807%2C-1.210%2C36.875%2C-1.175&layer=mapnik&marker=-1.192%2C36.841';
const DIRECTIONS_URL = 'https://www.openstreetmap.org/directions?from=&to=-1.192%2C36.841';

export function SchoolMap({ compact = false }: {compact?: boolean;}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200 bg-sky-50">
      <iframe title="Map showing St. Ann Lifred Academy Schools on Kiambu Road" src={MAP_URL} className={compact ? 'h-40 w-full border-0' : 'h-64 w-full border-0'} loading="lazy" />
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="flex items-start gap-2 text-[13px] text-ink-muted"><MapPinIcon size={16} className="mt-0.5 shrink-0 text-orange" />{SCHOOL.address}</p>
        <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy hover:text-orange-dark">Get directions <ExternalLinkIcon size={14} /></a>
      </div>
    </div>
  );
}
