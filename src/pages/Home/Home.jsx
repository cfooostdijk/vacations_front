import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navigator from '../../components/Navigator/Navigator';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Copyright from '../../components/Copyright';
import Employees from '../../components/Employees';
import Vacations from '../../components/Vacations';
import MergedTable from '../../components/MergedTable/MergedTable';
import SignOut from '../../components/SignOut'; // Assuming you have a SignOut component
import theme from './theme';

const drawerWidth = 256;

export default function Home() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState('Full Data'); // Set default tab
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelect = (childId) => {
    setSelectedTab(childId);
  };

  let content;
  switch (selectedTab) {
    case 'Employees':
      content = <Employees />;
      break;
    case 'Vacations':
      content = <Vacations />;
      break;
    case 'SignOut':
      content = <SignOut />;
      break;
    default:
      content = <MergedTable />;
      break;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              onSelect={handleSelect}
            />
          )}

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            onSelect={handleSelect}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header
            onDrawerToggle={handleDrawerToggle}
            onTabChange={handleSelect}
            selectedTab={selectedTab}
          />
          <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Content>
              {content}
            </Content>
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
