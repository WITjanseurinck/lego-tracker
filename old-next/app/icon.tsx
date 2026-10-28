import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#FFC52E', borderRadius: 14, display: 'flex', flexWrap: 'wrap', padding: 10, gap: 6 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: '#E8AC10' }} />)}
      </div>
    ),
    { ...size },
  );
}
