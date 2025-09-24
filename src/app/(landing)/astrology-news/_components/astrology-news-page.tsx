'use client';

import React from 'react';
import Image from 'next/image';

const newsArticles = [
  {
    id: 1,
    title: 'Lorem Ipsum',
    description: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla consequetur ipsum nulla consectetur aleet. Tellus on ut libero lorem imperdiet egestas lectus.',
    featured: true,
    image: '/images/article1.png'
  },
  {
    id: 2,
    title: 'Lorem Ipsum',
    description: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla consequetur ipsum nulla consectetur aleet. Tellus on ut libero lorem imperdiet egestas lectus.',
    featured: false,
    image: '/images/article2.png'
  },
  {
    id: 3,
    title: 'Lorem Ipsum',
    description: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla consequetur ipsum nulla consectetur aleet. Tellus on ut libero lorem imperdiet egestas lectus.',
    featured: false,
    image: '/images/article3.png'
  },
  {
    id: 4,
    title: 'Lorem Ipsum',
    description: 'Lorem ipsum dolor sit amet consectetur. Nullam nulla consequetur ipsum nulla consectetur aleet. Tellus on ut libero lorem imperdiet egestas lectus.',
    featured: false,
    image: '/images/article4.png'
  }
];

export default function AstrologyNewsPage() {
  const featuredArticle = newsArticles.find(article => article.featured);
  const otherArticles = newsArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-white font-default">
      {/* Page Title */}
      <div className="text-center py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black px-4">
          Astromegistus News
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Article with Background Image */}
        <div className="relative mb-8 md:mb-12 mx-auto w-full max-w-[1160px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[578px]">
          {/* Featured Article Image */}
          {featuredArticle && (
            <div className="absolute inset-0">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Featured Article Content */}
          {featuredArticle && (
            <div className="relative z-10 h-full flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="text-white max-w-full sm:max-w-md">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
                  {featuredArticle.title}
                </h2>
                
                <p className="text-xs sm:text-sm md:text-base opacity-90 leading-relaxed">
                  {featuredArticle.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Three Article Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 md:mb-16 max-w-6xl mx-auto">
          {otherArticles.map((article) => (
            <div 
              key={article.id}
              className="relative overflow-hidden shadow-md hover:shadow-lg transition-shadow w-full h-[250px] sm:h-[287px] max-w-[348px] mx-auto"
            >
              {/* Article Image - Full Background */}
              <img
                src={article.image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Article Content - Overlay on Image */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                <div className="text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 line-clamp-3">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}