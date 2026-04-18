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

        const playObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSpatialState(prev => prev !== 'unmounted' ? 'playing' : 'unmounted');
                } else {
                    setSpatialState(prev => prev === 'playing' ? 'buffered' : prev);
                }
            },
            { threshold: 0.1 }
        );

        const mountObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSpatialState(prev => prev === 'unmounted' ? 'buffered' : prev);
                } else {
                    setSpatialState('unmounted');
                }
            },
            { rootMargin: "200px 0px" }
        );

        playObserver.observe(element);
        mountObserver.observe(element);

        return () => {
            playObserver.disconnect();
            mountObserver.disconnect();
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
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        }
    }, [spatialState, handlePlay, handlePause]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden w-full h-full bg-black/5 ${className}`}
            style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        >
            {spatialState !== 'unmounted' ? (
                <video
                    ref={videoRef}
                    poster={poster}
                    muted={muted}
                    loop={loop}
                    playsInline={playsInline}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
                >
                    {srcWebm && <source src={srcWebm} type="video/webm" />}
                    {srcMp4 && <source src={srcMp4} type="video/mp4" />}
                </video>
            ) : (
                <div className="absolute inset-0 w-full h-full bg-white/10 animate-pulse backdrop-blur-sm"></div>
            )}
        </div>
    );
});

export default SmartVideo;