import React from 'react';
import CoachingDetailPage from './_components/coaching-detail-page';

export interface CoachingDetailPageProps {
  params: Promise<{
    coachingId: string;
  }>;
}

const ProductDetail = async ({ params }: CoachingDetailPageProps) => {
  const { coachingId } = await params;
  return <CoachingDetailPage coachingId={coachingId} />;
};

export default ProductDetail;
