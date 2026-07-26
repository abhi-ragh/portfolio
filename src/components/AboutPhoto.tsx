import React, { useState } from 'react';

interface AboutPhotoProps {
  initialUrl?: string | null;
}

export const AboutPhoto: React.FC<AboutPhotoProps> = ({ initialUrl }) => {
  const [loaded, setLoaded] = useState(false);

  if (!initialUrl) {
    return <div className="hidden md:block w-full max-w-[340px] h-[320px] justify-self-end" />;
  }

  return (
    <div className="about-photo-wrapper">
      <img
        src={initialUrl}
        alt="About"
        onLoad={() => setLoaded(true)}
        className={`about-photo ${loaded ? 'loaded' : ''}`}
      />
    </div>
  );
};

export default AboutPhoto;
