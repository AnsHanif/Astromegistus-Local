'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import MagicWandIcon from '@/components/assets/svg-icons/magic-wand-icon';
import SessionTypeIcon from '@/components/assets/svg-icons/session-type-icon';
import ClockIcon from '@/components/assets/svg-icons/clock-icon';

// Dummy data object
const getPageData = (type: 'reading' | 'session') => ({
  title: type === 'reading' ? 'Reading Details' : 'Session Details',
  subtitle: type === 'reading'
    ? 'Automatically generated insights, charts, and narration.'
    : 'Live session recording with transcript and insights.',
  astrologer: {
    name: 'Pauline Nader',
    image: '/astrologist.png',
    details: [
      {
        icon: 'magic-wand',
        label: 'Booked Reading',
        value: 'Life Coaching',
      },
      {
        icon: 'session-type',
        label: 'Session Type',
        value: 'Live Session',
      },
      {
        icon: 'clock',
        label: 'Time',
        value: '30 + 60 minutes',
      },
    ],
  },
  narration: {
    title: 'Narration & Transcript',
    preview: [
      "Welcome to your personalized astrological reading. I'm Pauline Nader, and today we'll be exploring the cosmic influences that shape your journey through life. Your birth chart reveals a fascinating tapestry of planetary alignments that occurred at the exact moment you entered this world.",
      "Looking at your Sun sign in Leo, you carry the energy of natural leadership and creative expression. The Sun represents your core identity, your life force, and with it positioned in Leo, you're blessed with confidence, warmth, and a magnetic personality that draws others to you naturally.",
      "Your Moon in Pisces adds a deeply intuitive and emotional layer to your personality. This placement suggests you have powerful psychic abilities and can easily tap into the collective unconscious. You're highly empathetic, often absorbing the emotions of those around you, which can be both a gift and a challenge.",
    ],
    fullContent: [
      "Welcome to your personalized astrological reading. I'm Pauline Nader, and today we'll be exploring the cosmic influences that shape your journey through life. Your birth chart reveals a fascinating tapestry of planetary alignments that occurred at the exact moment you entered this world.",
      "Looking at your Sun sign in Leo, you carry the energy of natural leadership and creative expression. The Sun represents your core identity, your life force, and with it positioned in Leo, you're blessed with confidence, warmth, and a magnetic personality that draws others to you naturally.",
      "Your Moon in Pisces adds a deeply intuitive and emotional layer to your personality. This placement suggests you have powerful psychic abilities and can easily tap into the collective unconscious. You're highly empathetic, often absorbing the emotions of those around you, which can be both a gift and a challenge.",
      "Mercury in Virgo indicates a precise, analytical mind. You have an exceptional ability to organize information, pay attention to details, and communicate with clarity and purpose. This placement suggests you'd excel in fields requiring systematic thinking and practical problem-solving.",
      'Venus in Cancer shows your approach to love and relationships is deeply nurturing and protective. You seek emotional security in partnerships and have a tendency to express love through caring actions and creating a comfortable, safe environment for your loved ones.',
      'Mars in Scorpio gives you incredible determination and willpower. When you set your mind to something, you pursue it with unwavering intensity. This placement also suggests you have strong regenerative abilities and can transform challenges into opportunities for growth.',
      "Jupiter in Sagittarius expands your horizons through travel, higher learning, and philosophical exploration. You're naturally drawn to understanding different cultures, belief systems, and ways of life. This placement often indicates success in fields related to education, publishing, or international affairs.",
      'Saturn in Capricorn in your chart represents lessons around responsibility, discipline, and building lasting foundations. This placement teaches you the value of hard work, patience, and systematic progress toward your long-term goals.',
      "Uranus in Aquarius brings innovative thinking and humanitarian ideals to your personality. You're likely ahead of your time in many ways, with unique insights into social progress and technological advancement. This placement suggests you're meant to be a catalyst for positive change.",
      'Neptune in Pisces heightens your spiritual sensitivity and creative imagination. You have a direct connection to the divine realm and may experience prophetic dreams, psychic insights, or profound mystical experiences throughout your life.',
      "Pluto's position indicates areas of your life where you'll experience deep transformation. These changes, while sometimes challenging, are ultimately meant to help you evolve into your highest potential and discover your true power.",
      'Your rising sign, or Ascendant, represents the mask you wear in public and how others first perceive you. It also influences your physical appearance and your instinctive reactions to new situations and people.',
      'The houses in your chart show where different life themes play out. Your first house represents your identity and appearance, while your seventh house governs partnerships and marriage. The tenth house relates to your career and public reputation.',
      'Aspects between planets reveal how different parts of your personality work together or create tension. Harmonious aspects like trines and sextiles indicate natural talents and easy energy flow, while challenging aspects like squares and oppositions point to areas for growth and development.',
      'Looking at your current transits, Jupiter is moving through your second house of finances and self-worth, indicating a time of expansion in your material resources and growing confidence in your abilities. This is an excellent time to invest in yourself and your future.',
      "Saturn's current position suggests you're in a period of restructuring and building new foundations in your life. While this may feel restrictive at times, it's ultimately preparing you for greater stability and success in the years ahead.",
      'The upcoming eclipses will activate significant changes in your relationships and career sectors. Eclipse energy is powerful and transformative, often bringing sudden shifts that redirect your life path in positive ways.',
      "Your North Node represents your soul's purpose in this lifetime - the qualities and experiences you're meant to develop. Embracing this energy will bring you the greatest fulfillment and sense of meaning in your life journey.",
      'In terms of timing, the next six months show particular significance for romantic relationships and creative projects. Venus will be highlighting your fifth house, bringing opportunities for love, artistic expression, and joyful experiences.',
      'Remember that astrology is a tool for self-understanding and empowerment. Your birth chart reveals potentials and tendencies, but you always have free will to make choices that align with your highest good. Use this knowledge to make informed decisions and embrace your unique gifts and talents.',
    ],
    showFullTranscriptText: 'Show Full Transcript',
    showLessTranscriptText: 'Show Less',
  },
  videoRecording: {
    title: 'Video Recording',
    description: 'Watch the complete session recording with audio narration',
    buttonText: 'Watch Recording',
  },
  completeReading: {
    title: 'Complete Reading',
    description: 'Narration, charts, and data in one comprehensive file',
    buttonText: 'Download Reading',
  },
});

interface ViewReadingPageProps {
  type: 'reading' | 'session';
}

export default function ViewReadingPage({ type }: ViewReadingPageProps) {
  const router = useRouter();
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const readingData = getPageData(type);

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => router.back()}
          className="hover:text-golden-glow transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-size-heading md:text-size-primary font-semibold">
            {readingData.title}
          </h1>
          <p className="text-size-tertiary font-normal">
            {readingData.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Panel - Astrologer Info */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={readingData.astrologer.image}
                  alt={readingData.astrologer.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-size-large font-semibold">
                {readingData.astrologer.name}
              </h3>
            </div>

            <div className="space-y-4">
              {readingData.astrologer.details.map((detail, index) => {
                let IconComponent;
                switch (detail.icon) {
                  case 'magic-wand':
                    IconComponent = MagicWandIcon;
                    break;
                  case 'session-type':
                    IconComponent = SessionTypeIcon;
                    break;
                  case 'clock':
                    IconComponent = ClockIcon;
                    break;
                  default:
                    IconComponent = MagicWandIcon;
                }
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-size-secondary font-normal">
                        {detail.label}
                      </span>
                    </div>
                    <span className="text-size-secondary font-normal text-white">
                      {detail.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Narration & Complete Reading */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Narration Section - Only show for sessions */}
          {type === 'session' && (
            <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
              <h2 className="text-size-heading font-semibold mb-4">
                {readingData.narration.title}
              </h2>

              <div className="space-y-4 text-size-secondary font-normal leading-relaxed">
                {(showFullTranscript
                  ? readingData.narration.fullContent
                  : readingData.narration.preview
                ).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent text-size-secondary font-semibold mt-6 transition-colors hover:opacity-80"
              >
                {showFullTranscript
                  ? readingData.narration.showLessTranscriptText
                  : readingData.narration.showFullTranscriptText}
              </button>
            </div>
          )}

          {/* Video Recording Section - Only show for sessions */}
          {type === 'session' && (
            <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-size-heading font-semibold mb-2">
                    {readingData.videoRecording.title}
                  </h2>
                  <p className="text-size-secondary font-normal">
                    {readingData.videoRecording.description}
                  </p>
                </div>

                <Button className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 font-semibold text-size-tertiary sm:text-size-secondary bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {readingData.videoRecording.buttonText}
                </Button>
              </div>
            </div>
          )}

          {/* Complete Reading Section - Only show for readings */}
          {type === 'reading' && (
            <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-size-heading font-semibold mb-2">
                    {readingData.completeReading.title}
                  </h2>
                  <p className="text-size-secondary font-normal">
                    {readingData.completeReading.description}
                  </p>
                </div>

                <Button className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 font-semibold text-size-tertiary sm:text-size-secondary bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black">
                  {readingData.completeReading.buttonText}
                </Button>
              </div>
            </div>
          )}

          {/* Show message if no sections are displayed */}
          {type !== 'reading' && type !== 'session' && (
            <div className="bg-[var(--bg)] p-4 sm:p-6 text-white text-center">
              <p className="text-size-secondary text-white/60">
                Invalid type provided. Please specify either 'reading' or 'session'.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
