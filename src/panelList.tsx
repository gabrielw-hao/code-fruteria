import React from 'react';
import FruitBookPanel from './panels/FruitBookPanel';
import AboutPanel from './panels/AboutPanel';
import FruitViewPanel from './panels/FruitViewPanel';

export const getPanelList = () => [
  {
    key: 'fruitbook',
    title: 'Fruit Book',
    content: <FruitBookPanel />,
  },
  { key: 'fruitview', title: 'Fruit View', content: <FruitViewPanel /> },
  { key: 'about', title: 'About', content: <AboutPanel /> },
];
