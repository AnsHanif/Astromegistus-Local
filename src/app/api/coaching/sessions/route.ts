import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with your actual data source
const coachingSessions = [
  {
    id: '1',
    name: 'Personal Astrology Reading',
    description: 'Get personalized insights into your life path and future',
    price: 120,
    duration: '60 minutes',
    imageUrl: '/images/coaching-1.jpg',
    type: 'coaching',
    category: 'Personal Reading'
  },
  {
    id: '2',
    name: 'Relationship Guidance',
    description: 'Understand your relationships through astrological insights',
    price: 150,
    duration: '90 minutes',
    imageUrl: '/images/coaching-2.jpg',
    type: 'coaching',
    category: 'Relationship'
  },
  {
    id: '3',
    name: 'Career Path Analysis',
    description: 'Discover your ideal career path using astrology',
    price: 100,
    duration: '45 minutes',
    imageUrl: '/images/coaching-3.jpg',
    type: 'coaching',
    category: 'Career'
  },
  {
    id: '4',
    name: 'Spiritual Growth Session',
    description: 'Deep dive into your spiritual journey and purpose',
    price: 180,
    duration: '120 minutes',
    imageUrl: '/images/coaching-4.jpg',
    type: 'coaching',
    category: 'Spiritual'
  },
  {
    id: '5',
    name: 'Family Dynamics Reading',
    description: 'Understand family relationships and dynamics',
    price: 130,
    duration: '75 minutes',
    imageUrl: '/images/coaching-5.jpg',
    type: 'coaching',
    category: 'Family'
  },
  {
    id: '6',
    name: 'Health & Wellness Guidance',
    description: 'Astrological insights for better health and wellness',
    price: 110,
    duration: '50 minutes',
    imageUrl: '/images/coaching-6.jpg',
    type: 'coaching',
    category: 'Health'
  },
  {
    id: '7',
    name: 'Financial Planning Session',
    description: 'Use astrology to make better financial decisions',
    price: 140,
    duration: '80 minutes',
    imageUrl: '/images/coaching-7.jpg',
    type: 'coaching',
    category: 'Finance'
  },
  {
    id: '8',
    name: 'Life Purpose Discovery',
    description: 'Find your true life purpose and calling',
    price: 160,
    duration: '100 minutes',
    imageUrl: '/images/coaching-8.jpg',
    type: 'coaching',
    category: 'Purpose'
  },
  {
    id: '9',
    name: 'Past Life Regression',
    description: 'Explore your past lives and their impact on present',
    price: 200,
    duration: '150 minutes',
    imageUrl: '/images/coaching-9.jpg',
    type: 'coaching',
    category: 'Past Life'
  },
  {
    id: '10',
    name: 'Meditation & Mindfulness',
    description: 'Combine astrology with meditation practices',
    price: 90,
    duration: '40 minutes',
    imageUrl: '/images/coaching-10.jpg',
    type: 'coaching',
    category: 'Meditation'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '4');
    
    // Validate parameters
    if (page < 1) {
      return NextResponse.json(
        { error: 'Page number must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 20' },
        { status: 400 }
      );
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated data
    const paginatedSessions = coachingSessions.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const totalItems = coachingSessions.length;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    // Response data
    const response = {
      success: true,
      data: {
        sessions: paginatedSessions,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          limit,
          hasNextPage,
          hasPreviousPage,
          nextPage: hasNextPage ? page + 1 : null,
          previousPage: hasPreviousPage ? page - 1 : null
        }
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching coaching sessions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}