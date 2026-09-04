'use client';

import NextLink from 'next/link';
import { useParams as useNextParams, usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation';
import { Children, createContext, isValidElement, useContext, useEffect, useMemo, useRef } from 'react';

const ParamsContext = createContext({});

function matchRoute(pattern, pathname) {
  if (pattern === '*') return {};
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const part = patternParts[index];
    if (part.startsWith(':')) params[part.slice(1)] = decodeURIComponent(pathParts[index]);
    else if (part !== pathParts[index]) return null;
  }
  return params;
}

function rememberState(destination, state) {
  if (!state || typeof window === 'undefined') return;
  sessionStorage.setItem(`navigation-state:${destination}`, JSON.stringify(state));
}

export function BrowserRouter({ children }) {
  return children;
}

export function Route() {
  return null;
}

export function Routes({ children }) {
  const pathname = usePathname();
  let fallback = null;
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    if (child.props.path === '*') {
      fallback = child;
      continue;
    }
    const params = matchRoute(child.props.path, pathname);
    if (params) return <ParamsContext.Provider value={params}>{child.props.element}</ParamsContext.Provider>;
  }
  return fallback?.props.element ?? null;
}

export function Navigate({ to, replace = false, state }) {
  const navigate = useNavigate();
  useEffect(() => navigate(to, { replace, state }), [navigate, replace, state, to]);
  return null;
}

export function Link({ to, state, children, onClick, ...props }) {
  return <NextLink href={to} {...props} onClick={(event) => { rememberState(to, state); onClick?.(event); }}>{children}</NextLink>;
}

export function useNavigate() {
  const router = useRouter();
  return useMemo(() => (to, options = {}) => {
    if (typeof to === 'number') {
      if (to < 0) router.back();
      else if (to > 0) router.forward();
      return;
    }
    rememberState(to, options.state);
    if (options.replace) router.replace(to);
    else router.push(to);
  }, [router]);
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  const stateRef = useRef(null);
  const prevPathname = useRef(null);

  if (prevPathname.current !== pathname) {
    if (typeof window !== 'undefined') {
      const key = `navigation-state:${pathname}`;
      const value = sessionStorage.getItem(key);
      if (value) {
        try { stateRef.current = JSON.parse(value); } catch { stateRef.current = null; }
        sessionStorage.removeItem(key);
      } else {
        stateRef.current = null;
      }
    }
    prevPathname.current = pathname;
  }

  const search = searchParams.toString();
  const hash = typeof window === 'undefined' ? '' : window.location.hash;
  return useMemo(() => ({ pathname, search: search ? `?${search}` : '', hash, state: stateRef.current }), [pathname, search, hash]);
}

export function useParams() {
  const matched = useContext(ParamsContext);
  const nextParams = useNextParams();
  return Object.keys(matched).length ? matched : nextParams;
}

export function useSearchParams() {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const mutable = useMemo(() => new URLSearchParams(params.toString()), [params]);
  const setParams = (next) => {
    const value = typeof next === 'function' ? next(new URLSearchParams(params.toString())) : next;
    const query = new URLSearchParams(value).toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };
  return [mutable, setParams];
}
