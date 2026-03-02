export interface Product {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: string;
  price: number;
  availability: 'En stock' | 'Sur commande' | 'Rupture' | 'Épuisé';
  description: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Pare-brise avant Mercedes Classe E',
    type: 'Pare-brise',
    brand: 'Mercedes',
    model: 'Classe E',
    year: '2020-2024',
    price: 450,
    availability: 'En stock',
    description:
      'Pare-brise avant de haute qualité pour Mercedes Classe E. Installation professionnelle recommandée. Vitre athermique avec capteur de pluie intégré.',
    image:
      'https://images.unsplash.com/photo-1757753465248-28f8994c28a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kc2hpZWxkJTIwZ2xhc3MlMjBhdXRvbW90aXZlfGVufDF8fHx8MTc3MjE0NjQ1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Premium',
  },
  {
    id: '2',
    name: 'Vitre latérale avant BMW Série 3',
    type: 'Vitre latérale',
    brand: 'BMW',
    model: 'Série 3',
    year: '2019-2023',
    price: 280,
    availability: 'En stock',
    description:
      'Vitre latérale avant conducteur pour BMW Série 3. Verre trempé de qualité OEM. Compatible avec lève-vitre électrique.',
    image:
      'https://images.unsplash.com/photo-1644017060552-728a4be83940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kb3clMjBzaWRlJTIwZ2xhc3N8ZW58MXx8fHwxNzcyMTQ1OTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Premium',
  },
  {
    id: '3',
    name: 'Lunette arrière Peugeot 308',
    type: 'Lunette arrière',
    brand: 'Peugeot',
    model: '308',
    year: '2021-2024',
    price: 350,
    availability: 'En stock',
    description:
      'Lunette arrière pour Peugeot 308. Vitre athermique avec dégivrage intégré. Installation avec joints inclus.',
    image:
      'https://images.unsplash.com/photo-1565376791568-d30e46523795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWFyJTIwd2luZG93JTIwZ2xhc3N8ZW58MXx8fHwxNzcyMTQ2NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Standard',
  },
  {
    id: '4',
    name: 'Pare-brise avant Renault Clio 5',
    type: 'Pare-brise',
    brand: 'Renault',
    model: 'Clio 5',
    year: '2019-2024',
    price: 320,
    availability: 'En stock',
    description:
      'Pare-brise avant pour Renault Clio 5. Vitre claire standard avec bande pare-soleil. Compatible tous modèles.',
    image:
      'https://images.unsplash.com/photo-1761881916867-8e12ac56b87f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZ2xhc3MlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzcyMTQ2NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Standard',
  },
  {
    id: '5',
    name: 'Pare-brise avant Audi A4',
    type: 'Pare-brise',
    brand: 'Audi',
    model: 'A4',
    year: '2020-2024',
    price: 520,
    availability: 'Sur commande',
    description:
      'Pare-brise avant premium pour Audi A4. Vitre acoustique et athermique. Capteur de pluie et de luminosité intégré.',
    image:
      'https://images.unsplash.com/photo-1741298264553-04a98a5574b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjB3aW5kc2hpZWxkfGVufDF8fHx8MTc3MjE0NjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Premium',
  },
  {
    id: '6',
    name: 'Vitre latérale arrière Citroën C3',
    type: 'Vitre latérale',
    brand: 'Citroën',
    model: 'C3',
    year: '2020-2024',
    price: 180,
    availability: 'En stock',
    description:
      'Vitre latérale arrière pour Citroën C3. Verre trempé teinté. Installation facile.',
    image:
      'https://images.unsplash.com/photo-1644017060552-728a4be83940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kb3clMjBzaWRlJTIwZ2xhc3N8ZW58MXx8fHwxNzcyMTQ1OTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Standard',
  },
  {
    id: '7',
    name: 'Lunette arrière Volkswagen Golf 8',
    type: 'Lunette arrière',
    brand: 'Volkswagen',
    model: 'Golf 8',
    year: '2020-2024',
    price: 380,
    availability: 'En stock',
    description:
      'Lunette arrière pour VW Golf 8. Système de dégivrage intégré. Vitre athermique de qualité supérieure.',
    image:
      'https://images.unsplash.com/photo-1565376791568-d30e46523795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWFyJTIwd2luZG93JTIwZ2xhc3N8ZW58MXx8fHwxNzcyMTQ2NDUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Standard',
  },
  {
    id: '8',
    name: 'Pare-brise avant Dacia Duster',
    type: 'Pare-brise',
    brand: 'Dacia',
    model: 'Duster',
    year: '2018-2024',
    price: 290,
    availability: 'En stock',
    description:
      'Pare-brise avant pour Dacia Duster. Excellent rapport qualité-prix. Vitre claire avec bande pare-soleil.',
    image:
      'https://images.unsplash.com/photo-1757753465248-28f8994c28a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kc2hpZWxkJTIwZ2xhc3MlMjBhdXRvbW90aXZlfGVufDF8fHx8MTc3MjE0NjQ1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Économique',
  },
  {
    id: '9',
    name: 'Vitre latérale avant Ford Fiesta',
    type: 'Vitre latérale',
    brand: 'Ford',
    model: 'Fiesta',
    year: '2017-2023',
    price: 200,
    availability: 'Sur commande',
    description:
      'Vitre latérale avant pour Ford Fiesta. Verre trempé de qualité OEM. Installation professionnelle.',
    image:
      'https://images.unsplash.com/photo-1644017060552-728a4be83940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kb3clMjBzaWRlJTIwZ2xhc3N8ZW58MXx8fHwxNzcyMTQ1OTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Économique',
  },
  {
    id: '10',
    name: 'Pare-brise avant Toyota Yaris',
    type: 'Pare-brise',
    brand: 'Toyota',
    model: 'Yaris',
    year: '2020-2024',
    price: 340,
    availability: 'En stock',
    description:
      'Pare-brise avant pour Toyota Yaris. Qualité constructeur. Compatible avec système de sécurité Toyota Safety Sense.',
    image:
      'https://images.unsplash.com/photo-1761881916867-8e12ac56b87f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZ2xhc3MlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzcyMTQ2NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Standard',
  },
];
