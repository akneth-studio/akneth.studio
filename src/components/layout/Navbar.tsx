'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Autour_One } from "next/font/google";

const autourone = Autour_One({
  style: 'normal',
  subsets: ['latin-ext'],
  weight: '400',
});

const menuItems = [
  { href: "/", label: "Strona główna" },
  { href: "/about", label: "O mnie" },
  { href: "/services", label: "Usługi" },
  { href: "/contact", label: "Kontakt" },
]

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm"
      aria-label="Offcanvas navbar large"
    >
      <div className="container-xxl">
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <Image
            src="/img/logo_revert.svg"
            alt="AKNETH Studio Katarzyna Pawłowska-Malesa logo"
            height={55}
            width={55}
            className="me-2"
          />
          <span className={`${autourone.className} d-none d-md-flex justify-content-center align-items-center flex-column my-auto`} >
            <span className="fw-bold fs-3 lh-1">AKNETH ~Studio~</span>
            <span className="fw-normal brand-sub">Katarzyna Pawłowska-Malesa</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Otwórz menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <Link href="/">
              <Image
                src="/img/logo_revert.svg"
                alt="AKNETH Studio Katarzyna Pawłowska-Malesa logo"
                height={35}
                width={35}
                className="me-2"
              />
            </Link>
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Zamknij"
            ></button>
          </div>

          <div className="offcanvas-body">
            <ul
              className="navbar-nav nav-pills justify-content-end flex-grow-1 pe-3"
              role="tablist"
            >
              {menuItems.map(item => (
                <li className="nav-item mx-1" key={item.href}>
                  <Link
                    className={`nav-link${pathname === item.href ? " active" : ""}`}
                    href={item.href}
                    data-bs-dismiss="offcanvas"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="my-3 opacity-20" />

            <div className="text-center d-block d-md-none">
              <Image
                src="/img/logo_akneth_w.svg"
                alt="Logo AKNETH Studio"
                height={200}
                width={200}
                className="mx-auto p1"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
