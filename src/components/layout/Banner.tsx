'use client'
import { FcEngineering, FcGlobe } from 'react-icons/fc';
import React, { useEffect, useState } from 'react';

type Mode = 'maintenance' | 'vacation';
interface BannerData {
    id: string;
    mode: Mode;
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

const bannerConfig: Record<Mode, BannersConfigEntry> = {
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
    const [closedIds, setClosedIds] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const closed = sessionStorage.getItem('closedBanners');
            if (closed) {
                setClosedIds(JSON.parse(closed));
            }
        }
    }, []);

    const handleClose = (id: string) => {
        const updated = [...closedIds, id];
        setClosedIds(updated);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('closedBanners', JSON.stringify(updated));
        }
    };

    return (
        <>
            {banners
                .filter(({ id, visible, announce_from, date_end }) =>
                    visible &&
                    !closedIds.includes(id) &&
                    now >= new Date(announce_from) &&
                    now <= new Date(date_end)
                )
                .map(({ id, mode, date_start, date_end }) => {
                    const cfg = bannerConfig[mode];
                    if (!cfg) return null;
                    const start = new Date(date_start);
                    const end = new Date(date_end);
                    const content = cfg.getText(start, end);
                    if (!content) return null;
                    return (
                        <div key={id} className={`w-full py-3 px-4 d-flex align-items-center justify-content-between shadow ${cfg.className}`} role="status">
                            <div className="d-flex align-items-center">
                                <span className="me-3">{cfg.icon}</span>
                                <span>{content}</span>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Zamknij baner"
                                onClick={() => handleClose(id)}
                            ></button>
                        </div>
                    );
                })}
        </>
    );
}