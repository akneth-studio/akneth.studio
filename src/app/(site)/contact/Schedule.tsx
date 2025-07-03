'use client';

import React from 'react';

const scheduleUrl = process.env.NEXT_PUBLIC_SCHEDULE_URL;

export default function Schedule() {
    if (!scheduleUrl) {
        return (
            <div className="alert alert-warning text-center my-3" style={{ fontSize: '0.95rem', color: '#738a96' }} role="alert">
                <p>Harmonogram spotkań jest chwilowo niedostępny. Skontaktuj się mailowo <a href="mailto:akneth.studio@gmail.com">akneth.studio@gmail.com</a> lub skorzystaj z formularza kontaktowego.</p>
            </div>
        );
    }

    return (
        <section aria-label="Harmonogram spotkań" style={{ width: '100%' }} className="schedule my-5">
            <div style={{ position: 'relative', paddingBottom: '70%', height: 0, overflow: 'hidden', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(52,58,64,0.08)' }}>
                <iframe
                    src={scheduleUrl}
                    title="Umów spotkanie"
                    width="100%"
                    height="100%"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '1rem',
                        background: '#fff',
                    }}
                    loading="lazy"
                    allow="clipboard-write"
                />
            </div>
        </section>
    );
}
