"use client";

/* Shared v2 ("Grid") nav + footer for the marketing subpages
   (contact / privacy / terms). Mirrors the landing chrome so every
   page shares one look. Render inside a .gbict-landing[data-dir="grid"] root. */

import Link from "next/link";

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const NAV = [
  { label: "How it works", href: "/#how" },
  { label: "Savings", href: "/#calculator" },
  { label: "App", href: "/#app" },
  { label: "Pricing", href: "/#pricing" },
];

export function SiteNav() {
  return (
    <nav className="nav nav--solid">
      <div className="nav-inner">
        <Link className="brand" href="/"><span className="mark"><Logo /></span> GBICT Energy</Link>
        <div className="nav-links">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </div>
        <div className="nav-cta">
          <Link className="btn btn-ghost" href="/login">Log in</Link>
          <Link className="btn btn-primary" href="/#pricing">Get started</Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link className="brand" href="/"><span className="mark"><Logo /></span> GBICT Energy</Link>
            <p className="fdesc">The operating system for home energy. Connecting batteries, solar and the grid into one intelligent, hardware-agnostic platform.</p>
          </div>
          <div className="fcol">
            <h4>Product</h4>
            <Link href="/#how">How it works</Link>
            <Link href="/#calculator">Savings calculator</Link>
            <Link href="/#app">The app</Link>
            <Link href="/#pricing">Pricing</Link>
          </div>
          <div className="fcol">
            <h4>Company</h4>
            <Link href="/about">About GBICT</Link>
            <Link href="/contact">Contact</Link>
            <a href="mailto:info@gbict.nl">info@gbict.nl</a>
          </div>
          <div className="fcol">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 GBICT Energy · Almere, Netherlands</span>
          <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/privacy">Cookies</Link></span>
        </div>
      </div>
    </footer>
  );
}
