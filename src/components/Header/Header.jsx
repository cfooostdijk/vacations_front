import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header(props) {
  const { onDrawerToggle, onTabChange, selectedTab } = props;

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Employees" value="Employees" />
          <Tab label="Vacations" value="Vacations" />
          <Tab label="Full Data" value="Full Data" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
};
