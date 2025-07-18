import { FcEngineering, FcGlobe } from 'react-icons/fc';
import React from 'react';

type BannerID = 'maintenance' | 'vacation';
interface BannerData {
    id: BannerID;
    visible: boolean;
    announce_from: string; // ISO date string
    date_start: string; // ISO date string
    date_end: string; // ISO date string
}
interface BannersConfigEntry {
    className?: string;
    icon: React.ReactNode;
    getText: (start: Date, end: Date) => string;
}

interface BannersProps {
    banners: BannerData[];
}

const bannerConfig: Record<BannerID, BannersConfigEntry> ={
    maintenance: {
        className: "bg-yellow-100 text-yellow-900",
        icon: <FcEngineering size={28} />,
        getText: (start, end) =>
            `W dniu ${start.toLocaleDateString('pl-PL')} w godz. ${start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} będą prowadzone prace serwisowe.`
    },
    vacation: {
        className: "bg-blue-100 text-blue-900",
        icon: <FcGlobe size={28} />,
        getText: (start, end) =>
            `W dniach ${start.toLocaleDateString('pl-PL')}–${end.toLocaleDateString('pl-PL')} jestem na urlopie.`
    }
};

export function Banner({ banners }: BannersProps) {
    const now = new Date();

    return (
        <>
            {banners
                .filter(({ visible, announce_from, date_end }) =>
                    visible &&
                    now >= new Date(announce_from) &&
                    now <= new Date(date_end)
                )
                .map(({ id, date_start, date_end }) => {
                    const cfg = bannerConfig[id];
                    if (!cfg) return null;
                    const start = new Date(date_start);
                    const end = new Date(date_end);
                    const content = cfg.getText(start, end);
                    if (!content) return null;
                    return (
                        <div key={id} className={`w-full py-3 px-4 flex items-center justify-center shadow ${cfg.className}`} role="status">
                            <span className="mr-3">{cfg.icon}</span>
                            <span>{content}</span>
                        </div>
                    );
                })}
        </>
    );
}
