import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';


export interface NextNProgressProps {
  progressBarVisibility?: 'visible' | 'hidden';
  color?: string;
  startPosition?: number;
  stopDelayMs?: number;
  height?: number;
  showOnShallow?: boolean;
  options?: Partial<NProgress.NProgressOptions>;
  nonce?: string;
  spinnerTop?: string;
  spinnerRight?: string;
  setExternalSpinnerLoading?: (value: boolean) => void;
}

export default function NextNProgress({
  progressBarVisibility = 'visible',
  color = '#2d5c9a',
  spinnerTop = '5px',
  spinnerRight = '15px',
  startPosition = 0.3,
  stopDelayMs = 200,
  height = 2,
  showOnShallow = true,
  options = { showSpinner: true },
  nonce,
  setExternalSpinnerLoading,
}: NextNProgressProps) {
  let timer: NodeJS.Timeout | null = null;

  const routeChangeStart = (
    _: string,
    {
      shallow,
    }: {
      shallow: boolean;
    },
  ) => {
    if (!shallow || showOnShallow) {
      NProgress.set(startPosition);
      NProgress.start();
      setExternalSpinnerLoading?.(true);
    }
  };

  const routeChangeEnd = (
    _: string,
    {
      shallow,
    }: {
      shallow: boolean;
    },
  ) => {
    if (!shallow || showOnShallow) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.done(true);
        setExternalSpinnerLoading?.(false);
      }, stopDelayMs);
    }
  };

  const routeChangeError = (
    _err: Error,
    _url: string,
    {
      shallow,
    }: {
      shallow: boolean;
    },
  ) => {
    if (!shallow || showOnShallow) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.done(true);
      }, stopDelayMs);
    }
  };

  useEffect(() => {
    if (options) {
      NProgress.configure(options);
    }

    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeError);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeEnd);
      Router.events.off('routeChangeError', routeChangeError);
    };
  });

  return (
    <style nonce={nonce}>{`
       #nprogress {
         pointer-events: none;
       }
       #nprogress .bar {
         background: ${color};
         position: fixed;
         z-index: 9999;
         top: 0;
         left: 0;
         width: 100%;
         height: ${height}px;
         visibility: ${progressBarVisibility};
       }
       #nprogress .peg {
         display: block;
         position: absolute;
         right: 0px;
         width: 100px;
         height: 100%;
         box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
         opacity: 1;
         -webkit-transform: rotate(3deg) translate(0px, -4px);
         -ms-transform: rotate(3deg) translate(0px, -4px);
         transform: rotate(3deg) translate(0px, -4px);
       }
       #nprogress .spinner {
         display: block;
         position: fixed;
         z-index: 1031;
         top: ${spinnerTop};
         right: ${spinnerRight};
       }
       #nprogress .spinner-icon {
         width: 18px;
         height: 18px;
         box-sizing: border-box;
         border: solid 2px transparent;
         border-top-color: ${color};
         border-left-color: ${color};
         border-radius: 50%;
         -webkit-animation: nprogresss-spinner 400ms linear infinite;
         animation: nprogress-spinner 400ms linear infinite;
       }
       .nprogress-custom-parent {
         overflow: hidden;
         position: relative;
       }
       .nprogress-custom-parent #nprogress .spinner,
       .nprogress-custom-parent #nprogress .bar {
         position: absolute;
       }
       @-webkit-keyframes nprogress-spinner {
         0% {
           -webkit-transform: rotate(0deg);
         }
         100% {
           -webkit-transform: rotate(360deg);
         }
       }
       @keyframes nprogress-spinner {
         0% {
           transform: rotate(0deg);
         }
         100% {
           transform: rotate(360deg);
         }
       }
     `}</style>
  );
}
