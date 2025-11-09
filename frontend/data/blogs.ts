export interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
  source: 'YouTube' | 'Blog' | 'Article';
  date: string;
  readTime?: string;
}

export const blogPosts: BlogPost[] = [
  // YouTube Videos
  {
    id: 'blog-1',
    title: 'How to Choose Your First Guitar - Complete Beginner Guide',
    description: 'Learn everything about selecting the perfect guitar for beginners, from acoustic to electric guitars.',
    category: 'Guitar',
    image: '/images/blog/guitar-guide.jpg',
    link: 'https://www.youtube.com/results?search_query=how+to+choose+first+guitar+beginner+guide',
    source: 'YouTube',
    date: '2024-01-15',
    readTime: '15 min'
  },
  {
    id: 'blog-2',
    title: 'Tabla Learning for Beginners - Traditional Indian Percussion',
    description: 'Master the basics of tabla playing with expert guidance and traditional techniques.',
    category: 'Percussion',
    image: '/images/blog/tabla-learning.jpg',
    link: 'https://www.youtube.com/results?search_query=tabla+learning+beginners+tutorial',
    source: 'YouTube',
    date: '2024-01-20',
    readTime: '20 min'
  },
  {
    id: 'blog-3',
    title: 'Flute Playing Techniques - Bansuri Mastery',
    description: 'Discover the art of playing bamboo flute with proper breathing and finger techniques.',
    category: 'Wind',
    image: '/images/blog/flute-technique.jpg',
    link: 'https://www.youtube.com/results?search_query=bansuri+flute+playing+techniques',
    source: 'YouTube',
    date: '2024-01-25',
    readTime: '18 min'
  },
  {
    id: 'blog-4',
    title: 'Piano Lessons - From Basics to Advanced',
    description: 'Complete piano course covering scales, chords, and popular songs for all skill levels.',
    category: 'Keyboard',
    image: '/images/blog/piano-lessons.jpg',
    link: 'https://www.youtube.com/results?search_query=piano+lessons+beginners+to+advanced',
    source: 'YouTube',
    date: '2024-02-01',
    readTime: '25 min'
  },
  
  // Blog Articles
  {
    id: 'blog-5',
    title: 'Top 10 Classical Indian Instruments You Should Know',
    description: 'Explore the rich heritage of Indian classical music through these timeless instruments.',
    category: 'Traditional',
    image: '/images/blog/indian-instruments.jpg',
    link: 'https://www.google.com/search?q=classical+indian+musical+instruments+guide',
    source: 'Blog',
    date: '2024-02-05',
    readTime: '10 min'
  },
  {
    id: 'blog-6',
    title: 'Harmonium Buying Guide - What to Look For',
    description: 'Essential tips for purchasing the right harmonium based on quality, sound, and budget.',
    category: 'Wind',
    image: '/images/blog/harmonium-guide.jpg',
    link: 'https://www.google.com/search?q=harmonium+buying+guide+tips',
    source: 'Blog',
    date: '2024-02-10',
    readTime: '12 min'
  },
  {
    id: 'blog-7',
    title: 'Sitar Music - History and Playing Techniques',
    description: 'Journey through the history of sitar and learn about its unique playing style.',
    category: 'String',
    image: '/images/blog/sitar-history.jpg',
    link: 'https://www.google.com/search?q=sitar+music+history+playing+techniques',
    source: 'Article',
    date: '2024-02-15',
    readTime: '15 min'
  },
  {
    id: 'blog-8',
    title: 'Violin Care and Maintenance - Keep Your Instrument Perfect',
    description: 'Learn proper violin maintenance, cleaning, and storage techniques to preserve your instrument.',
    category: 'String',
    image: '/images/blog/violin-care.jpg',
    link: 'https://www.google.com/search?q=violin+care+maintenance+guide',
    source: 'Blog',
    date: '2024-02-20',
    readTime: '8 min'
  },
  {
    id: 'blog-9',
    title: 'Dholak Rhythms - Traditional Indian Beats',
    description: 'Master traditional dholak rhythms and beats used in Indian folk music and celebrations.',
    category: 'Percussion',
    image: '/images/blog/dholak-rhythms.jpg',
    link: 'https://www.youtube.com/results?search_query=dholak+rhythms+traditional+beats',
    source: 'YouTube',
    date: '2024-02-25',
    readTime: '20 min'
  },
  {
    id: 'blog-10',
    title: 'Music Theory Basics - Understanding Notes and Scales',
    description: 'Foundation of music theory covering notes, scales, and how they apply to any instrument.',
    category: 'General',
    image: '/images/blog/music-theory.jpg',
    link: 'https://www.youtube.com/results?search_query=music+theory+basics+notes+scales',
    source: 'YouTube',
    date: '2024-03-01',
    readTime: '30 min'
  },
  {
    id: 'blog-11',
    title: 'Acoustic vs Electric Guitar - Which One Should You Choose?',
    description: 'Comprehensive comparison to help you decide between acoustic and electric guitar.',
    category: 'Guitar',
    image: '/images/blog/acoustic-electric.jpg',
    link: 'https://www.google.com/search?q=acoustic+vs+electric+guitar+comparison',
    source: 'Article',
    date: '2024-03-05',
    readTime: '10 min'
  },
  {
    id: 'blog-12',
    title: 'Tanpura - The Soul of Indian Classical Music',
    description: 'Understanding the importance and playing techniques of tanpura in classical music.',
    category: 'Traditional',
    image: '/images/blog/tanpura.jpg',
    link: 'https://www.google.com/search?q=tanpura+indian+classical+music+guide',
    source: 'Blog',
    date: '2024-03-10',
    readTime: '12 min'
  }
];

export const blogCategories = [
  { id: 'all', name: 'All Blogs', count: blogPosts.length },
  { id: 'guitar', name: 'Guitar', count: blogPosts.filter(b => b.category === 'Guitar').length },
  { id: 'percussion', name: 'Percussion', count: blogPosts.filter(b => b.category === 'Percussion').length },
  { id: 'wind', name: 'Wind Instruments', count: blogPosts.filter(b => b.category === 'Wind').length },
  { id: 'keyboard', name: 'Keyboard', count: blogPosts.filter(b => b.category === 'Keyboard').length },
  { id: 'string', name: 'String Instruments', count: blogPosts.filter(b => b.category === 'String').length },
  { id: 'traditional', name: 'Traditional', count: blogPosts.filter(b => b.category === 'Traditional').length },
];
