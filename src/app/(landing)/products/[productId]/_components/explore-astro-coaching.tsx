import { AstrologyCoachingImage } from '@/components/assets';
import { Button } from '@/components/ui/button';

export default function ExploreAstroCoaching() {
  return (
    <div
      className="bg-cover bg-center text-white px-4 sm:px-8 flex flex-col items-center justify-center text-center gap-4 py-8 md:py-16"
      style={{ backgroundImage: `url(${AstrologyCoachingImage.src})` }}
    >
      <h3 className="text-size-heading md:text-size-primary font-bold">
        Explore Astrology-Based Coaching
      </h3>
      <p className="text-sm">
        Discover how personalized astrology-based coaching can guide your
        personal growth, career decisions, and relationships.
      </p>
      <div>
        <Button variant="default" className="w-full px-4 md:px-8 text-black">
          Astrology Coaching
        </Button>
      </div>
    </div>
  );
}
