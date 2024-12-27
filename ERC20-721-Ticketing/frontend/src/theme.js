import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D4C41',
      light: '#A98274',
      dark: '#4B2C22',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B6E1E7',
      light: '#E4F5F8',
      dark: '#85B0B5',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF5E9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#323232',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
  },
  typography: {
    fontFamily: '"Violet Sans", Arial, sans-serif',
    allVariants: {
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#6D4C41',
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#6D4C41',
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#323232',
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#A98274',
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#A98274',
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    p: {
      color: '#A98274',
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: '"Violet Sans", Arial, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.2)',
          paddingBlock: '0.5rem',
          paddingInline: '1.25rem',
          backgroundColor: '#6D4C41',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          gap: '10px',
          fontWeight: 'bold',
          border: '3px solid #ffffff4d',
          outline: 'none',
          overflow: 'hidden',
          fontSize: '15px',
          '&:hover': {
            borderColor: '#fff9',
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '100px',
            height: '100%',
            backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 70%)',
            top: '0',
            left: '-100px',
            opacity: '0.6',
          },
          '&:hover:before': {
            animation: 'shine 1.5s ease-out infinite',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '2.5px 3px 0 #6D4C41',
          transition: "box-shadow 0.25s ease",
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6D4C41',
          },
          "&.Mui-focused": {
            boxShadow: "5.5px 7px 0 #6D4C41",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6D4C41',
          },
        },
        outlined: {
          borderRadius: '0.5rem',
        },
        select: {
          padding: '14px',
          color: '#6D4C41',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          color: '#6D4C41',
          transform: 'translate(14px, 14px) scale(1)',
          transition: 'transform 0.2s ease, color 0.2s ease',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -6px) scale(0.75)',
            color: '#6D4C41',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            boxShadow: "2.5px 3px 0 #6D4C41",
            outline: "none",
            transition: "box-shadow 0.25s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6D4C41",
            },
            "&.Mui-focused": {
              boxShadow: "5.5px 7px 0 #6D4C41",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6D4C41",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "1rem",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#A98274",
          },
          "& .MuiInputBase-input": {
            color: "#6D4C41",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '1rem 2rem',
        },
      },
    },
  },
});

export default theme;
