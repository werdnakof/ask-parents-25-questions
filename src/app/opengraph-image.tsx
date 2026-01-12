import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Parent Stories - Capture Your Parents\' Life Stories';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafaf9',
          backgroundImage: 'linear-gradient(to bottom right, #fafaf9, #f5f5f4)',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: 'rgba(128, 128, 77, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: 'rgba(128, 128, 77, 0.08)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 80px',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#80804d',
              marginBottom: 24,
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Parent Stories
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#80804d',
              marginBottom: 24,
            }}
          >
            Know their story before the chapter closes
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: '#666666',
              maxWidth: 800,
            }}
          >
            Capture your parents' life stories through meaningful questions
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#80804d',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
