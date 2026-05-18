import React, { useRef, useState, useEffect, useCallback } from 'react';

const SmartVideo = React.memo(function SmartVideo({
    srcWebm,
    srcMp4,
    poster,
    className = "",
    loop = true,
    muted = true,
    playsInline = true
}) {
    const containerRef = useRef(null);
    const videoRef = useRef(null);

    const [spatialState, setSpatialState] = useState('unmounted');

    const handlePlay = useCallback(() => {
        if (videoRef.current && spatialState === 'playing') {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => { });
            }
        }
    }, [spatialState]);

    const handlePause = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, []);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const rect = entry.boundingClientRect;
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                const isInViewport = rect.bottom > 0 && rect.top < viewportHeight;

                if (!entry.isIntersecting) {
                    setSpatialState('unmounted');
                } else if (isInViewport) {
                    setSpatialState('playing');
                } else {
                    setSpatialState('buffered');
                }
            },
            { rootMargin: "200px 0px", threshold: 0.01 }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (spatialState === 'playing') {
            handlePlay();
        } else if (spatialState === 'buffered') {
            handlePause();
        } else if (spatialState === 'unmounted') {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }, [spatialState, handlePlay, handlePause]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden w-full h-full bg-black/5 ${className}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        >
            <video
                ref={videoRef}
                poster={poster}
                muted={muted}
                loop={loop}
                playsInline={playsInline}
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover scale-[1.03] transition-opacity duration-500 ${spatialState === 'unmounted' ? 'opacity-0' : 'opacity-100'}`}
            >
                {spatialState !== 'unmounted' && srcWebm && <source src={srcWebm} type="video/webm" />}
                {spatialState !== 'unmounted' && srcMp4 && <source src={srcMp4} type="video/mp4" />}
            </video>

            {spatialState === 'unmounted' && (
                <div className="absolute inset-0 w-full h-full bg-white/10 animate-pulse backdrop-blur-sm z-10"></div>
            )}
        </div>
    );
});

export default SmartVideo;
