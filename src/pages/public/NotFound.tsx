import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/primitives';

export function NotFound() {
  return (
    <div className="w-full bg-cream">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-serif text-[64px] leading-none text-forest-200">404</p>
        <h1 className="mt-3 font-serif text-[30px] text-ink">We couldn’t find that page</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          The link may be out of date, or the page may have moved. Try the homepage, or search from the portal if you were signed in.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/">
            <Button>Back to the homepage</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">Contact the school</Button>
          </Link>
        </div>
      </div>
    </div>);

}