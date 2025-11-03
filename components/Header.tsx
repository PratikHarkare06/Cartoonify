import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900">
        Cartoon Generator
      </h1>
      <p className="mt-2 text-lg text-slate-600">
        Turn your ideas into simple, clean cartoons with AI!
      </p>
    </header>
  );
};

export default Header;