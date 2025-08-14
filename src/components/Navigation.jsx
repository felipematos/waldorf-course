import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Menu, X, Flower2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Navigation.scss';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Flower2 className="logo-icon" />
          <span>Jornada Antroposófica</span>
        </Link>

        <button 
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <Home size={18} />
            <span>{t('navigation.home')}</span>
          </Link>
          
          <Link 
            to="/curso"
            className={`nav-link ${location.pathname.includes('/curso') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <BookOpen size={18} />
            <span>{t('navigation.course')}</span>
          </Link>

          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;