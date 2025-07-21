'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Badge } from 'react-bootstrap'
import Link from 'next/link'
import styles from '@/styles/Privacy.module.scss'

interface PolicyContentProps {
    h1Text: string;
    content: string;
    lastUpdated: string;
}

export default function PolicyContent({ h1Text, content, lastUpdated }: PolicyContentProps) {
    return (
        <article className={`${styles.article} p-3 p-md-5`}>
            <h1 className='page-title'>{h1Text}</h1>
            <div className='text-center' id='last-updated'>
                <Badge
                    bg='secondary'
                    text='light'
                    as='p'
                    style={{ fontSize: '0.9rem' }}
                    className='mx-auto px-3 py-2 fw-normal lh-base shadow-sm'
                >
                    Data ostatniej aktualizacji: <br className='d-block d-md-none py-1' />
                    <span className='fw-bold'>{lastUpdated}</span>
                </Badge>
            </div>
            <hr />
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                    a: ({ href, children, title, ...props }) => {
                        const isInternal = href?.startsWith('/')
                        const ariaLabel = title || (typeof children === 'string' ? children : undefined)
                        if (isInternal) {
                            return (
                                <Link href={href ?? '#'} {...props} title={title} aria-label={ariaLabel}>
                                    {children}
                                </Link>
                            )
                        }
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer" {...props} title={title} aria-label={ariaLabel}>
                                {children}
                            </a>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}