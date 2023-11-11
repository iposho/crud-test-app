import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import { Link, useLocation } from 'react-router-dom';

type NavigationMUIProps = {
  window?: () => Window;
};

const drawerWidth = 240;

export default function Navigation(props: NavigationMUIProps) {
  const location = useLocation();
  const { pathname } = location;
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {
          pathname === '/'
            ? 'CRUD Test App'
            : (
              <Link to="/">
                CRUD Test App
              </Link>
            )
        }
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary="Create new record" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined
    ? () => window().document.body
    : undefined;

  return (
    <Box>
      <CssBaseline />
      <AppBar component="nav" position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            {
              pathname === '/'
                ? 'CRUD Test App'
                : (
                  <Link to="/">
                    CRUD Test App
                  </Link>
                )
            }
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {
              pathname === '/records/add'
                ? null
                : (
                  <Link to="/records/add">
                    <Button sx={{ color: '#fff' }}>
                      <AddCircleOutlineOutlinedIcon sx={{ marginRight: '.5rem' }} />
                      Add New Record
                    </Button>
                  </Link>
                )
            }
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
