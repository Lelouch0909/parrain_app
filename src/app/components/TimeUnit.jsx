import React from 'react';
import PropTypes from 'prop-types';

export function TimeUnit({ value, label }) {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
      <span className="text-6xl font-bold text-emerald-400 font-mono">
        {value.toString().padStart(2, '0')}
      </span>
      <p className="text-sm text-gray-300 mt-2 text-center font-medium">
        {label}
      </p>
    </div>
  );
}

// Définir les types des props avec PropTypes
TimeUnit.propTypes = {
  value: PropTypes.number.isRequired, // value doit être un nombre
  label: PropTypes.string.isRequired, // label doit être une chaîne de caractères
};
