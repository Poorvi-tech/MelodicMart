export interface Review {
  id: string;
  customerName: string;
  customerImage: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  reviewType: 'text' | 'image' | 'video';
  reviewText: string;
  images?: string[];
  videoUrl?: string;
  verified: boolean;
  helpful: number;
}

export const reviews: Review[] = [
  // Text Reviews
  {
    id: 'review-1',
    customerName: 'Rajesh Kumar',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: '2024-10-15',
    productName: 'Professional Sitar',
    reviewType: 'text',
    reviewText: 'Absolutely wonderful sitar! The craftsmanship is exceptional and the sound quality is amazing. Perfect for classical performances. Highly recommended!',
    verified: true,
    helpful: 45
  },
  {
    id: 'review-2',
    customerName: 'Priya Sharma',
    customerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    location: 'Delhi, Delhi',
    rating: 5,
    date: '2024-10-20',
    productName: 'Acoustic Guitar',
    reviewType: 'text',
    reviewText: 'Best acoustic guitar in this price range! The tone is rich and warm. Great for beginners and intermediate players. Fast delivery too!',
    verified: true,
    helpful: 38
  },
  
  // Image Reviews
  {
    id: 'review-3',
    customerName: 'Arjun Patel',
    customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    location: 'Bangalore, Karnataka',
    rating: 5,
    date: '2024-10-18',
    productName: 'Tabla Set',
    reviewType: 'image',
    reviewText: 'Received my tabla set today! The sound is crystal clear and the finish is beautiful. Sharing some pics of the unboxing.',
    images: [
      'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=400&fit=crop'
    ],
    verified: true,
    helpful: 52
  },
  {
    id: 'review-4',
    customerName: 'Sneha Reddy',
    customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    location: 'Hyderabad, Telangana',
    rating: 5,
    date: '2024-10-22',
    productName: 'Professional Violin',
    reviewType: 'image',
    reviewText: 'My dream violin finally arrived! The wood quality is premium and it sounds heavenly. Attaching photos of this beauty.',
    images: [
      'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=600&h=400&fit=crop'
    ],
    verified: true,
    helpful: 67
  },
  
  // Video Reviews
  {
    id: 'review-5',
    customerName: 'Vikram Singh',
    customerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    date: '2024-10-25',
    productName: 'Grand Piano',
    reviewType: 'video',
    reviewText: 'This piano exceeded all my expectations! Here\'s a short video of me playing it. The keys feel amazing and the sound is professional grade.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verified: true,
    helpful: 89
  },
  {
    id: 'review-6',
    customerName: 'Aisha Khan',
    customerImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    location: 'Pune, Maharashtra',
    rating: 5,
    date: '2024-10-23',
    productName: 'Bansuri Flute',
    reviewType: 'video',
    reviewText: 'Watch me play this beautiful bansuri! The tone quality is outstanding and it\'s very easy to play. Perfect for classical music.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verified: true,
    helpful: 71
  },

  // More Text Reviews
  {
    id: 'review-7',
    customerName: 'Amit Desai',
    customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    date: '2024-10-21',
    productName: 'Electric Guitar',
    reviewType: 'text',
    reviewText: 'Fantastic electric guitar! The pickups are top-notch and the action is smooth. Great for rock and metal. Worth every penny!',
    verified: true,
    helpful: 42
  },
  {
    id: 'review-8',
    customerName: 'Kavita Menon',
    customerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    date: '2024-10-19',
    productName: 'Harmonium',
    reviewType: 'text',
    reviewText: 'Beautiful harmonium with excellent sound quality. Perfect for bhajans and classical music. The bellows work smoothly and keys are responsive.',
    verified: true,
    helpful: 55
  },

  // More Image Reviews
  {
    id: 'review-9',
    customerName: 'Rahul Verma',
    customerImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
    location: 'Kolkata, West Bengal',
    rating: 5,
    date: '2024-10-24',
    productName: 'Drum Kit',
    reviewType: 'image',
    reviewText: 'Just set up my new drum kit! The sound is incredible and build quality is solid. Check out these photos!',
    images: [
      'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=400&fit=crop'
    ],
    verified: true,
    helpful: 63
  },
  {
    id: 'review-10',
    customerName: 'Neha Kapoor',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    location: 'Chandigarh, Punjab',
    rating: 5,
    date: '2024-10-26',
    productName: 'Ukulele',
    reviewType: 'image',
    reviewText: 'Cutest ukulele ever! Perfect size and amazing sound. My daughter loves it. Sharing pictures of our first jam session!',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&h=400&fit=crop'
    ],
    verified: true,
    helpful: 48
  },

  // More Mixed Reviews
  {
    id: 'review-11',
    customerName: 'Sanjay Malhotra',
    customerImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
    location: 'Lucknow, Uttar Pradesh',
    rating: 5,
    date: '2024-10-17',
    productName: 'Saxophone',
    reviewType: 'text',
    reviewText: 'Professional quality saxophone at an affordable price! The tone is rich and the keys are very responsive. Highly recommended for jazz musicians!',
    verified: true,
    helpful: 36
  },
  {
    id: 'review-12',
    customerName: 'Deepika Iyer',
    customerImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop',
    location: 'Bangalore, Karnataka',
    rating: 5,
    date: '2024-10-16',
    productName: 'Veena',
    reviewType: 'image',
    reviewText: 'Authentic veena with beautiful craftsmanship! The resonance is perfect for Carnatic music. Pictures don\'t do justice to its beauty!',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/3/35/Veena.png','https://4.imimg.com/data4/XA/AE/ANDROID-9199833/product-500x500.jpeg'
    ],
    verified: true,
    helpful: 58
  }
];
