import apodFallback from '../assets/placeholders/apod-fallback.svg?url'
import marsFallback from '../assets/placeholders/mars-fallback.svg?url'
import earthFallback from '../assets/placeholders/earth-fallback.svg?url'

export const demoApod = {
  date: '2025-10-01',
  title: 'Filaments de la nébuleuse du Voile',
  url: apodFallback,
  media_type: 'image',
  explanation: `Remnant de supernova dans la constellation du Cygne. Ce panorama met en évidence les structures filamenteuses balayées par l’onde de choc.`,
}

export const demoApodRange = [
  demoApod,
  {
    date: '2025-09-30',
    title: 'Arche de la Voie lactée depuis le Chili',
    url: apodFallback,
    media_type: 'image',
    explanation: 'Panorama 180° révélant le bulbe central et le centre galactique.',
  },
  {
    date: '2025-09-29',
    title: 'La Carène en émission',
    url: apodFallback,
    media_type: 'image',
    explanation: 'Nuages de poussières ionisés par les étoiles massives du complexe de la Carène.',
  },
  {
    date: '2025-09-28',
    title: 'Blue Moon sur Rome',
    url: apodFallback,
    media_type: 'image',
    explanation: 'La pleine lune « bleue » encadre le Colisée sous un ciel limpide.',
  },
]

export const demoRovers = [
  { name: 'Curiosity', status: 'active' },
  { name: 'Perseverance', status: 'active' },
  { name: 'Opportunity', status: 'complete' },
  { name: 'Spirit', status: 'complete' },
]

export const demoEpicDates = [
  '2024-09-16',
  '2024-09-15',
  '2024-09-14',
  '2024-09-13',
  '2024-09-12',
]

export const demoNeoHistory = {
  history: [2, 3, 1, 4, 5, 2, 3],
  today: 3,
}

export const demoSolarEvents = [
  {
    activityID: 'DEMO-FLR-2024',
    title: 'Éruption classe M2.1',
    time: '2024-09-15T13:20Z',
    instruments: ['GOES-16'],
    type: 'FLR',
  },
  {
    activityID: 'DEMO-CME-2024',
    title: 'CME rapide détectée',
    time: '2024-09-14T09:10Z',
    instruments: ['SOHO/LASCO C2'],
    type: 'CME',
  },
]

export const demoRoverPhotos = {
  curiosity: [
    {
      id: 102693,
      img_src: marsFallback,
      rover: { name: 'Curiosity' },
      camera: { name: 'MAST', full_name: 'Mast Camera' },
      sol: 2530,
      earth_date: '2019-08-09',
    },
    {
      id: 102694,
      img_src: marsFallback,
      rover: { name: 'Curiosity' },
      camera: { name: 'NAVCAM', full_name: 'Navigation Camera' },
      sol: 2510,
      earth_date: '2019-07-20',
    },
  ],
  perseverance: [
    {
      id: 754621,
      img_src: marsFallback,
      rover: { name: 'Perseverance' },
      camera: { name: 'MCZ_RIGHT', full_name: 'Mastcam-Z Right' },
      sol: 435,
      earth_date: '2022-05-05',
    },
    {
      id: 754622,
      img_src: marsFallback,
      rover: { name: 'Perseverance' },
      camera: { name: 'MCZ_LEFT', full_name: 'Mastcam-Z Left' },
      sol: 435,
      earth_date: '2022-05-05',
    },
  ],
  opportunity: [
    {
      id: 185585,
      img_src: marsFallback,
      rover: { name: 'Opportunity' },
      camera: { name: 'PANCAM', full_name: 'Panoramic Camera' },
      sol: 511,
      earth_date: '2005-05-21',
    },
  ],
  spirit: [
    {
      id: 211223,
      img_src: marsFallback,
      rover: { name: 'Spirit' },
      camera: { name: 'PANCAM', full_name: 'Panoramic Camera' },
      sol: 600,
      earth_date: '2005-09-10',
    },
  ],
}

export const roverCameraMap = {
  curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'NAVCAM'],
  perseverance: ['MCZ_LEFT', 'MCZ_RIGHT', 'FRONT_HAZCAM_LEFT_A', 'FRONT_HAZCAM_RIGHT_A', 'NAVCAM_LEFT', 'NAVCAM_RIGHT'],
  opportunity: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
  spirit: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES'],
}

export const demoEarthImagery = {
  url: earthFallback,
  date: '2023-05-18',
}

export const guidedScenes = [
  {
    id: 'apod',
    title: 'Fenêtre cosmique',
    description: 'Lance la session avec l’image du jour et son contexte.\n      Lis la narration audio pour ressentir la profondeur du cosmos.',
    route: { name: 'apod' },
    accent: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
  {
    id: 'mars',
    title: 'Exploration martienne',
    description: 'Switch vers les rovers et déverrouille les panoramas 360°.\n      Les filtres sol/jour terrestre te guident dans les archives.',
    route: { name: 'mars' },
    accent: 'from-orange-400 via-rose-500 to-red-600',
  },
  {
    id: 'epic',
    title: 'Orbites terrestres',
    description: 'Observe la Terre en temps quasi-réel avec EPIC.\n      Compare les modes natural et enhanced pour suivre les nuances atmosphériques.',
    route: { name: 'epic' },
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
  },
]

export const observatoryPresets = [
  {
    id: 'apod',
    label: 'APOD',
    description: 'Image astronomique du jour et explication détaillée.',
    route: { name: 'apod' },
  },
  {
    id: 'mission-control',
    label: 'Mission Control',
    description: 'Suivi orbital, météo spatiale et alertes clés.',
    route: { name: 'mission-control' },
  },
  {
    id: 'mars',
    label: 'Mars Rovers',
    description: 'Chronologie photo des rovers martiens.',
    route: { name: 'mars' },
  },
  {
    id: 'neo',
    label: 'NEO Watch',
    description: 'Surveillance des objets proches de la Terre.',
    route: { name: 'neo' },
  },
  {
    id: 'library',
    label: 'Médiathèque',
    description: 'Collection d’images, vidéos et sons NASA.',
    route: { name: 'library' },
  },
]
