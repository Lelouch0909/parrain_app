import React from 'react';
import PropTypes from 'prop-types';

export function TimeUnit({ value, label }) {
  return (
      <div className="flex flex-col items-center">
          <span className="text-2xl md:text-4xl font-bold text-emerald-400">
              {value}
          </span>
          <span className="text-sm md:text-base text-emerald-200">
              {label}
          </span>
      </div>
  );
}


// Définir les types des props avec PropTypes
TimeUnit.propTypes = {
  value: PropTypes.number.isRequired, // value doit être un nombre
  label: PropTypes.string.isRequired, // label doit être une chaîne de caractères
};
