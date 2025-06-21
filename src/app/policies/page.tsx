import Link from "next/link";
import styles from "@/styles/policies.module.scss";
import { LiaAngleDoubleRightSolid } from "react-icons/lia";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Polityki i regulaminy',
    description: 'Zbiór Polityk i regulaminów AKNETH Studio',
    keywords: [
        'Polityka prywatności',
        'Regulamin',
        'RODO',
        'AKNETH Studio'
    ]
};

export default function PoliciesPage() {
    return (
        <>
            <div className={`${styles.policiesSection} my-3`}>
                <h1 className={styles.heading}>Polityki i regulaminy</h1>
                <div className={styles.policiesList}>
                    <PolicyCard
                        title="Polityka prywatności"
                        description="Jak przetwarzamy i chronimy Twoje dane osobowe."
                        href="/policies/privacy"
                    />
                    <PolicyCard
                        title="RODO"
                        description="Informacje o przetwarzaniu danych zgodnie z RODO."
                        href="/policies/rodo"
                    />
                    <PolicyCard
                        title="Regulamin"
                        description="Warunki korzystania z serwisu i usług AKNETH Studio."
                        href="/policies/terms"
                    />
                </div>
            </div>
        </>
    );
}

function PolicyCard({ title, description, href }: { title: string; description: string; href: string }) {
    return (
        <Link href={href} className={styles.policyCard}>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            <LiaAngleDoubleRightSolid size={32} className={styles.arrow} aria-hidden />
        </Link>
    );
}