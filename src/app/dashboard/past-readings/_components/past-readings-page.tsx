import React from 'react';
import SessionCard from '../../_components/session-card';

export default function PastReadingsPage() {
  return (
    <div className="py-10">
      <h1 className="text-size-heading md:text-size-heading font-semibold">
        Past Readings <span className="text-sm font-medium">(1)</span>
      </h1>

      <SessionCard type="completed" />
    </div>
  );
}
