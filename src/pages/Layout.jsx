import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LoginIcon from '@mui/icons-material/Login';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Badge from '@mui/material/Badge';
import { useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../api/auth';
import InventoryIcon from '@mui/icons-material/Inventory';
import PrintIcon from '@mui/icons-material/Print';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import '../App.css';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Layout = ({ children, count }) => {
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSubmenuClick = (menuText) => {
    setOpenSubmenu(openSubmenu === menuText ? null : menuText);
  };

  const handleLogout = async () => {
    const token = cookies.AUTH_TOKEN;
    try {
      const response = await logout(token);
      if (response.ok) {
        removeCookie('AUTH_TOKEN', { path: '/' });
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        toast.success('Logged out successfully.');
      } else {
        toast.error(response.message ?? 'Failed to log out.');
      }
    } catch (error) {
      console.error('Failed to log out', error);
      toast.error('Failed to log out.');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: 'dashboard' },
    {
      text: 'Rooms',
      icon: <MeetingRoomIcon />,
      submenu: [
        { text: 'Create Rooms', icon: <AddBoxIcon />, link: 'room' },
        { text: 'Room Request', icon: <HelpCenterOutlinedIcon />, link: 'room_request' },
        { text: 'Access Code Request', icon: <LockOpenIcon />, link: 'access_code' },
        { text: 'Display Rooms', icon: <MeetingRoomIcon />, link: 'display_room' },
       // { text: 'Room Schedules', icon: <EventNoteIcon />, link: 'room_scheds' },
        { text: 'Requested Room Logs', icon: <LoginIcon />, link: 'logs' },
      ],
    },
    {
      text: 'Schedule',
      icon: <EditCalendarIcon />,
      submenu: [
        { text: 'Schedules Status', icon: <EditCalendarIcon />, link: 'schedule' },
        { text: 'Calendar', icon: <CalendarMonthIcon />, link: 'calendar_sched' },
        { text: 'Create Schedule', icon: <AssignmentIndIcon />, link: 'assign_sched' },
      ],
    },
    { text: 'Courses', icon: <SchoolOutlinedIcon />, link: 'course' },
    { text: 'Teachers', icon: <LocalLibraryIcon />, link: 'teachers' },
    { text: 'Archive', icon: <InventoryIcon />, link: 'archive' },
    { text: 'Activity Logs', icon: <ExitToAppIcon />, link: 'logs_history' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          width: isSmallScreen ? '100%' : `calc(100% - ${open ? drawerWidth : 0}px)`,
          transition: 'width 0.3s ease',
        }}
        className="hide-on-print"
      >
        <Toolbar sx={{ background: 'linear-gradient(to bottom, #373f88, #4f5891)' }}>
          <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, display: open && !isSmallScreen ? 'none' : 'block' }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ textAlign: 'left', fontSize: isSmallScreen ? '0.85rem' : '1.25rem' }}
              >
                University of Rizal System Cainta
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: isSmallScreen ? '10px' : '20px',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'rgb(2 49 138)',
                  fontSize: isSmallScreen ? '0.65rem' : '1rem',
                  padding: isSmallScreen ? '5px 10px' : '8px 16px',
                }}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(to bottom, #373f88, #4f5891)',
            color: 'white',
            height: '100vh',
            overflowY: 'auto',
          },
        }}
        variant={isSmallScreen ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={isSmallScreen ? handleDrawerClose : undefined}
      >
        <Toolbar>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgb(2 49 138)',
              '&:hover': {
                backgroundColor: 'rgb(29 78 216)',
              },
            }}
          >
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) =>
            item.submenu ? (
              <React.Fragment key={item.text}>
                <ListItemButton onClick={() => handleSubmenuClick(item.text)}>
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: 'white' }} />
                  {openSubmenu === item.text ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
                <Collapse in={openSubmenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItemButton key={subItem.text} component={Link} to={subItem.link} sx={{ pl: 4 }}>
                        {subItem.icon && <ListItemIcon sx={{ color: 'white' }}>{subItem.icon}</ListItemIcon>}
                        <ListItemText primary={subItem.text} sx={{ color: 'white' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.link}>
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s ease',
          marginLeft: open && !isSmallScreen ? `${drawerWidth}px` : '0',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;