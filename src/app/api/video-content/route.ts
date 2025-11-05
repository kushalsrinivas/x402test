// API Route: /api/video-content
// Serves the protected video content

import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you might check a session token or JWT here
  // For this demo, we'll return the content data
  
  return NextResponse.json({
    success: true,
    message: 'Payment verified! Access granted.',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Premium Video Content',
      description: 'You have successfully paid $0.10 in cryptocurrency to access this content.',
    },
  });
}

