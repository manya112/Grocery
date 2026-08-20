import React from 'react';

/** Skeleton loading card — matches ProductCard layout */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line w-1-3" />
        <div className="skeleton skeleton-line w-full" style={{ height: 16 }} />
        <div className="skeleton skeleton-line w-1-2" />
        <div className="skeleton skeleton-line w-1-3" />
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="skeleton skeleton-line w-1-3" style={{ height: 18 }} />
          <div className="skeleton" style={{ width: 70, height: 30, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}
