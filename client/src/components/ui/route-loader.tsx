'use client';

// import { useRouter } from "next/router";
import { useEffect, useRef, useState } from 'react';
import Loader from './loader';

interface RouteLoaderProps {
  delay?: number;
}

export default function RouteLoader({ delay = 400 }: RouteLoaderProps) {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const start = () => {
      timer.current = setTimeout(() => setLoading(true), delay);
    };
    const end = () => {
      if (timer.current) clearTimeout(timer.current);
      setLoading(false);
    };

    // router.events.on("routeChangeStart", start);
    // router.events.on("routeChangeComplete", end);
    // router.events.on("routeChangeError", end);
    return () => {
      // router.events.off("routeChangeStart", start);
      // router.events.off("routeChangeComplete", end);
      // router.events.off("routeChangeError", end);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delay]);

  if (!loading) return null;
  return <Loader delay={0} className="fixed inset-0 z-50" />;
}
