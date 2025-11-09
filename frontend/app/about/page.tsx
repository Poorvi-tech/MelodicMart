import Link from 'next/link';
import { Music, Award, Users, Heart, Target, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Music Haven</h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              Your trusted destination for authentic musical instruments. 
              For over 25 years, we've been bringing the joy of music to thousands of musicians across India.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Story</span>
              </h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  Founded in 1999, Music Haven began as a small workshop dedicated to handcrafting traditional 
                  Indian instruments. Our passion for music and commitment to quality quickly earned us a 
                  reputation among musicians.
                </p>
                <p>
                  Today, we're proud to be one of India's leading online music stores, offering a carefully 
                  curated collection of both traditional and modern instruments. Every instrument in our 
                  collection is selected or crafted with the same dedication to quality that started it all.
                </p>
                <p>
                  From classical musicians to beginners taking their first steps, we serve a diverse community 
                  of music lovers, united by their passion for authentic sound and craftsmanship.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-12 flex items-center justify-center">
              <div className="text-9xl">🎼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Quality First',
                description: 'We never compromise on quality. Every instrument meets our strict standards for craftsmanship and sound.',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Passion for Music',
                description: 'Music is our life. We understand musicians because we are musicians ourselves.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Customer Care',
                description: 'Your satisfaction is our success. We go the extra mile to ensure you find your perfect instrument.',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Authenticity',
                description: '100% genuine instruments. We work directly with master craftsmen and trusted manufacturers.',
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Excellence',
                description: 'From product selection to delivery, we strive for excellence in every detail.',
              },
              {
                icon: <Music className="w-8 h-8" />,
                title: 'Tradition & Innovation',
                description: 'Honoring traditional craftsmanship while embracing modern innovations in music.',
              },
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 text-white" style={{ background: 'linear-gradient(to right, #00897b, #00acc1, #00bcd4)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <div className="text-purple-100">Happy Musicians</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">25+</div>
              <div className="text-purple-100">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Instruments</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9</div>
              <div className="text-purple-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Promise</span>
          </h2>
          <div className="text-lg text-gray-700 space-y-4 mb-8">
            <p>
              At Music Haven, we promise to deliver authentic, high-quality musical instruments that 
              inspire and delight. Every purchase is backed by our commitment to excellence and our 
              passion for music.
            </p>
            <p>
              We're not just selling instruments – we're helping you find the perfect companion for 
              your musical journey. Whether you're a beginner or a seasoned professional, we're here 
              to support you every step of the way.
            </p>
          </div>
          <Link
            href="/categories/string-instruments"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
