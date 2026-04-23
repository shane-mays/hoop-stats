import 'css/nav.css';

import { Icon, Text } from '@chakra-ui/react';
import { FaBasketball } from 'react-icons/fa6';
import { IoMdHome } from 'react-icons/io';
import { MdLeaderboard } from 'react-icons/md';
import { RiTeamFill } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';

import MoreActionsDrawer from './MoreActionsDrawer';

const navItems = [
  { name: 'Home', link: '/', icon: <IoMdHome /> },
  { name: 'Leaderboard', link: '/leaderboard', icon: <MdLeaderboard /> },
  { name: 'My Profile', link: '/player', icon: <FaBasketball /> },
  { name: 'My Teams', link: '/teams', icon: <RiTeamFill /> },
];

export default function FooterNav() {
  const location = useLocation();

  return location.pathname != '/' ? (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.link}
          className={`nav-item ${location.pathname.includes(item.link) && item.name != 'Home' ? 'active' : ''}`}
        >
          <Icon size={'md'}>{item.icon}</Icon>
          <Text className="label" fontSize={'smaller'}>
            {item.name}
          </Text>
        </Link>
      ))}
      <MoreActionsDrawer isActive={false} />
    </nav>
  ) : (
    <div></div>
  );
}
