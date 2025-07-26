import CTAButton from "@/components/CTAButton";
import Image from "next/image";
import { Autour_One } from "next/font/google";
import Link from 'next/link';
import FuzzyText from "@/components/FuzzyText";

import { Metadata } from "next";

const autourOne = Autour_One({
    subsets: ['latin'],
    weight: ['400'],
});

export default function NotFound() {
    return (
        <>
            <div className="container text-center my-5">
                <div className={`${autourOne.className} error-page `}>
                    <h1>
                        <FuzzyText
                            color="inherit"
                            fontFamily="inherit"
                            hoverIntensity={0.3}
                        >
                            404
                        </FuzzyText>
                    </h1>
                    <h5>Taka strona nie istnieje.</h5>
                </div>
                <Image
                    src="/img/404.svg"
                    alt="404 - Strona nie znaleziona"
                    className="img-fluid my-4"
                    height={189}
                    width={250}
                />
                <div className="my-4">
                    <p>Przepraszamy, ale strona, której szukasz, nie została znaleziona.</p>
                    <p>Możesz wrócić do <Link href="/" aria-label='Strona główna'>strony głównej</Link> lub skorzystać z menu nawigacyjnego.</p>
                </div>
                <div className="mt-4">
                    <CTAButton
                        type='button'
                        text="Wróć do strony głównej"
                        variant="primary"
                        size="lg"
                        to="/"
                    />
                </div>
            </div>
        </>
    );
}
export const metadata: Metadata = {
    title: '404 - Strona nie znaleziona',
    description: 'Strona, której szukasz, nie istnieje.',
};