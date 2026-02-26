import React, { useEffect } from 'react';

interface AdSenseProps {
    slot: string;
    style?: React.CSSProperties;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    responsive?: 'true' | 'false';
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

/**
 * Reusable Google AdSense component.
 * @param slot The ad slot ID from your AdSense dashboard.
 * @param style Optional CSS styles for the internal ins tag.
 * @param format Ad format (auto, fluid, etc.).
 * @param responsive Whether the ad should be responsive.
 */
const AdSense: React.FC<AdSenseProps> = ({
    slot,
    style = { display: 'block' },
    format = 'auto',
    responsive = 'true',
    className = ''
}) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense component error:", e);
        }
    }, [slot]); // Re-run if slot changes, though usually static

    return (
        <div className={`adsense-container overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-0808645077387366"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};

export default AdSense;
