export interface GalleryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price?: number;
  featured?: boolean;
}

export const galleryItems: GalleryItem[] = [
  // Guitars
  {
    id: 'gallery-1',
    name: 'Acoustic Guitar',
    category: 'String',
    description: 'Beautiful handcrafted acoustic guitar with rosewood finish',
    imageUrl: 'https://storage.googleapis.com/stateless-blog-g4m-co-uk/2022/01/Student-Electro-Acoustic-Guitar-by-Gear4music.jpg',
    price: 15999,
    featured: true
  },
  {
    id: 'gallery-2',
    name: 'Electric Guitar',
    category: 'String',
    description: 'Professional electric guitar with stunning sunburst finish',
    imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop',
    price: 24999,
    featured: true
  },
  {
    id: 'gallery-3',
    name: 'Classical Guitar',
    category: 'String',
    description: 'Traditional nylon string classical guitar',
    imageUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&h=800&fit=crop',
    price: 12999
  },
  
  // Violins
  {
    id: 'gallery-4',
    name: 'Professional Violin',
    category: 'String',
    description: 'Handcrafted violin with premium maple wood',
    imageUrl: 'https://cdn.shopify.com/s/files/1/2397/6373/products/VIOLIN3-1_2048x.jpg?v=1510270633',
    price: 28999,
    featured: true
  },
  // Pianos & Keyboards
  {
    id: 'gallery-6',
    name: 'Grand Piano',
    category: 'Keyboard',
    description: 'Elegant grand piano with rich, resonant tone',
    imageUrl: 'https://carusopianos.com/images/stories/virtuemart/product/resized/steinway_b_547912_2__1626204013_455.jpg',
    price: 350000,
    featured: true
  },
  {
    id: 'gallery-7',
    name: 'Digital Piano',
    category: 'Keyboard',
    description: 'Modern digital piano with weighted keys',
    imageUrl: 'https://m.media-amazon.com/images/I/71B5eUoR17L.jpg',
    price: 45999
  },
  {
    id: 'gallery-8',
    name: 'Synthesizer',
    category: 'Keyboard',
    description: 'Professional synthesizer with multiple sound options',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/07/13/21/17/synthesizer-1515574_1280.jpg',
    price: 52999
  },
  
  // Drums & Percussion
  {
    id: 'gallery-9',
    name: 'Drum Kit',
    category: 'Percussion',
    description: 'Complete professional drum set',
    imageUrl: 'https://purepng.com/public/uploads/large/purepng.com-primer-drums-kitdrummusicinstrumentsmetallicdrums-kitprimer-1421526504449gg43r.png',
    price: 65999,
    featured: true
  },
  {
    id: 'gallery-10',
    name: 'Tabla Set',
    category: 'Traditional',
    description: 'Authentic Indian tabla with tuning hammer',
    imageUrl: 'https://media.musiciansfriend.com/is/image/MMGS7/Professional-Tabla-Set/584911000000000-00-750x750.jpg',
    price: 18999,
    featured: true
  },
  {
    id: 'gallery-11',
    name: 'Djembe',
    category: 'Percussion',
    description: 'Hand-carved African djembe drum',
    imageUrl: 'https://media.wwbw.com/is/image/MMGS7/Ramadan-Pro-African-Djembe-10-x-20-in./L70392000002000-00-1400x1400.jpg',
    price: 8999
  },
  
  // Wind Instruments
  {
    id: 'gallery-12',
    name: 'Saxophone',
    category: 'Wind',
    description: 'Alto saxophone with golden brass finish',
    imageUrl: 'https://media.wwbw.com/is/image/MMGS7/EBS-251-Student-Eb-Baritone-Saxophone-Lacquer-Nickel-Plated-Keys/M01382000001001-00-1400x1400.jpg',
    price: 42999,
    featured: true
  },
  {
    id: 'gallery-13',
    name: 'Trumpet',
    category: 'Wind',
    description: 'Professional trumpet with silver plating',
    imageUrl: 'https://i5.walmartimages.com/asr/4014487c-0e38-4713-b156-dfb099fa5531.d4498822bc1394c951b07dc32a29607a.jpeg',
    price: 32999
  },
  {
    id: 'gallery-14',
    name: 'Flute',
    category: 'Wind',
    description: 'Concert flute with precision keys',
    imageUrl: 'https://www.irishflutestore.com/cdn/shop/products/P1001682.jpg?v=1558582306&width=1500',
    price: 15999
  },
  {
    id: 'gallery-15',
    name: 'Bansuri',
    category: 'Traditional',
    description: 'Traditional Indian bamboo flute',
    imageUrl: 'https://1.bp.blogspot.com/-KzBYEC2UA8I/T0psHEvCkyI/AAAAAAAAAAM/7E8GCf8GYSw/s1600/Bansuri_bamboo_flute_23inch.jpg',
    price: 2499
  },
  
  // Traditional Instruments
  {
    id: 'gallery-16',
    name: 'Sitar',
    category: 'Traditional',
    description: 'Premium sitar with decorative carvings',
    imageUrl: 'https://www.chrisjmendez.com/content/images/2018/02/sitar.png',
    price: 45999,
    featured: true
  },
  {
    id: 'gallery-17',
    name: 'Harmonium',
    category: 'Traditional',
    description: 'Portable harmonium with rich sound',
    imageUrl: 'https://www.pngall.com/wp-content/uploads/4/Harmonium-PNG-Image-File.png',
    price: 12999
  },
  {
    id: 'gallery-18',
    name: 'Veena',
    category: 'Traditional',
    description: 'Classical Indian string instrument',
    imageUrl: 'https://png.pngtree.com/png-clipart/20230807/original/pngtree-vector-illustration-of-the-indian-plucked-string-instrument-veena-vector-picture-image_10089905.png',
    price: 38999
  },
  
  // Bass & Strings
  {
    id: 'gallery-19',
    name: 'Bass Guitar',
    category: 'String',
    description: 'Four-string electric bass guitar',
    imageUrl: 'https://img.freepik.com/premium-photo/bass-guitar_1017677-13316.jpg',
    price: 22999
  },
  {
    id: 'gallery-20',
    name: 'Ukulele',
    category: 'String',
    description: 'Hawaiian soprano ukulele',
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/048/038/577/non_2x/wooden-ukulele-front-view-png.png',
    price: 4999
  },
  {
    id: 'gallery-21',
    name: 'Mandolin',
    category: 'String',
    description: 'Acoustic mandolin with sunburst finish',
    imageUrl: 'https://cdn.pixabay.com/photo/2018/12/19/00/06/mandolin-3883302_1280.jpg',
    price: 9999
  },
  
  // More Percussion
  {
    id: 'gallery-22',
    name: 'Dholak',
    category: 'Traditional',
    description: 'Traditional Indian folk drum',
    imageUrl: 'https://wallpapercave.com/wp/wp10263798.jpg',
    price: 6999
  },
  {
    id: 'gallery-23',
    name: 'Cajon',
    category: 'Percussion',
    description: 'Peruvian box drum for acoustic sessions',
    imageUrl: 'https://i.pinimg.com/originals/9f/5e/92/9f5e924a670779f7dc3b9505ebe732b5.jpg',
    price: 7999
  },
  {
    id: 'gallery-24',
    name: 'Congas',
    category: 'Percussion',
    description: 'Set of Latin percussion congas',
    imageUrl: 'https://i.pinimg.com/originals/26/11/e3/2611e3d03f84567bdde9b3335476d740.jpg',
    price: 15999
  }
];

export const galleryCategories = [
  { id: 'all', name: 'All Instruments', icon: '🎵' },
  { id: 'string', name: 'String', icon: '🎸' },
  { id: 'wind', name: 'Wind', icon: '🎺' },
  { id: 'percussion', name: 'Percussion', icon: '🥁' },
  { id: 'keyboard', name: 'Keyboard', icon: '🎹' },
  { id: 'traditional', name: 'Traditional', icon: '🪕' }
];
