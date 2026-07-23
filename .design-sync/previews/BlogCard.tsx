import { BlogCard } from '@mav/design-system';

const wrap = { display: 'flex', gap: 26, flexWrap: 'wrap' as const, width: 560, maxWidth: '100%' };

export const Active = () => (
  <div className="blog" style={{ width: 260 }}>
    <BlogCard
      badge="Course"
      date="May 14, 2026"
      title="AI-Driven Fraud Detection: Balancing Speed and False Positives in Real-Time Payments"
      image="../app/assets/blog/blob.png"
    />
  </div>
);

export const ActiveAndRead = () => (
  <div className="blog" style={wrap}>
    <BlogCard
      badge="Course"
      date="May 12, 2026"
      title="Open Banking APIs: A Practical Security Checklist for Fintech Teams"
      image="../app/assets/blog/plane.png"
    />
    <BlogCard
      badge="Course"
      date="May 09, 2026"
      title="Instant Settlement Rails and What They Mean for Transaction Fees"
      image="../app/assets/blog/refresh.png"
      read
    />
  </div>
);
