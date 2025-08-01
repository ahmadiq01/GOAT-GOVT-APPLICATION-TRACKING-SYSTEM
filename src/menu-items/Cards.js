// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = { IconKey };

// ==============================|| CARDS MENU ITEMS ||============================== //

const cards = {
  id: 'cards',  // Changed to 'cards' for consistency with 'dashboard'
  title: 'Cards',
  type: 'group',
  children: [
    {
      id: 'cards-page',  // New cards page entry
      title: 'Cards Page',
      type: 'item',
      url: '/pages/cards',
      icon: icons.IconKey,
      breadcrumbs: false  // This can be set to true if you need breadcrumbs
    }
  ]
};

export default cards;
