import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde en üste git
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
