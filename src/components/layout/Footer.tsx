'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);

  const policyLinks = [
    { href: "/policies/privacy", title: "Polityka prywatności" },
    { href: "/policies/terms", title: "Regulamin" },
    { href: "/policies/rodo", title: "RODO" },
  ];

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-dark py-4 mt-auto shadow-sm">
      <div className="container-xxl d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="d-flex flex-column rightside">
          <div className="align-items-center d-flex mb-1">
            <Image
              src="/img/logo_revert.svg"
              alt="AKNETH Studio Katarzyna Pawłowska-Malesa logo"
              height={25}
              width={25}
              className="me-2"
            />
            <p className="mb-0 text-white">&copy; {year ?? ""} AKNETH Studio.</p>
          </div>
          <div className="hr-footer mx-5 px-5">
            <hr />
          </div>
          <div className="align-items-center d-flex adnotations">
            <p className="mb-0 text-white">Icons by <Link href="https://icons8.com/" className="icon8" target="_blank" rel="noopener noreferrer">Icons8</Link>.<br />
              Free SVG Backgrounds and Patterns by <Link href="https://www.svgbackgrounds.com/set/free-svg-backgrounds-and-patterns/" className="icon8"> SVGBackgrounds.com</Link>.</p>
          </div>
        </div>
        <div className="hr-footer mx-5 px-5">
          <hr />
        </div>
        <ul className="nav flex-column flex-md-row align-items-center">
          {policyLinks.map(({ href, title }) => (
            <li className="nav-item" key={href}>
              <Link href={href} className="nav-link px-2" aria-label={title} title={title}>{`${title}`}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
