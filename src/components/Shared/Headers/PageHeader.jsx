import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, buttonText, buttonLink, icon: Icon }) => {
  return (
    /* Borde inferior usando primary (Negro) */
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-4 border-primary pb-4 gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          /* Fondo light (Zinc-100) y texto primary (Negro) */
          <div className="p-3 bg-primary-light rounded-xl text-primary hidden sm:block">
            <Icon className="w-8 h-8" />
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter uppercase leading-none">
            {title}
          </h1>
          {subtitle && (
            /* Texto muted (Gris-400) */
            <p className="text-secondary-muted font-bold mt-1 uppercase text-sm tracking-wide">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          /* Botón con fondo primary, texto secondary (Blanco) y hover configurado */
          className="bg-primary text-secondary px-6 py-3 rounded-lg hover:bg-primary-hover transition-all font-black shadow-lg uppercase tracking-widest active:scale-95 text-center w-full md:w-auto border border-primary"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;