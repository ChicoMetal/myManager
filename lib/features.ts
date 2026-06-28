import { useEyeRestStore } from '@/store/eye-rest.store';

export type Feature = {
  id: string;
  title: string;
  icon: string;
  route: string;
  accentColor: string;
  useStatus: () => string;
};

export const FEATURES: Feature[] = [
  {
    id: 'eye-rest',
    title: 'Eye Rest',
    icon: 'Eye',
    route: '/(features)/eye-rest',
    accentColor: '#a2d2ff',
    useStatus: () => useEyeRestStore(s => s.getStatusLine()),
  },
];
