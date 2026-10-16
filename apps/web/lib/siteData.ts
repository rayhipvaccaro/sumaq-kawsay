import { useCMS } from '@/lib/cmsContext';
import {
  ANCESTRAL_ZONES,
  ECOTOURISM_SERVICES,
  HOW_TO_REACH,
  SEASONS_DATA,
  type AncestralZone,
  type EcotourismService,
  type HowToReachStep,
  type SeasonInfo,
} from '@/data/inkaLabData';

export interface SiteDataLists {
  seasons: SeasonInfo[];
  zones: AncestralZone[];
  services: EcotourismService[];
  reach: HowToReachStep[];
}
export type SiteData = Partial<SiteDataLists>;

export const DEFAULT_SITE_DATA: SiteDataLists = {
  seasons: SEASONS_DATA,
  zones: ANCESTRAL_ZONES,
  services: ECOTOURISM_SERVICES,
  reach: HOW_TO_REACH,
};

// Lo que editó el administrador; si no hay nada, los datos originales.
export function useSiteData(): SiteDataLists {
  const { cmsRawData } = useCMS();
  const d = cmsRawData.siteData;
  return {
    seasons: d?.seasons?.length ? d.seasons : SEASONS_DATA,
    zones: d?.zones?.length ? d.zones : ANCESTRAL_ZONES,
    services: d?.services?.length ? d.services : ECOTOURISM_SERVICES,
    reach: d?.reach?.length ? d.reach : HOW_TO_REACH,
  };
}