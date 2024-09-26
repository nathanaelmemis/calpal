import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material';
import { grey, red } from '@mui/material/colors'
import './main.css'
import { UserDataContextProvider } from './context/UserDataContextProvider.js';

const theme = createTheme({
    palette: {
        primary: {
            main: grey[50]
        },
        secondary: {
            main: grey[800],
            dark: grey[800]
        },
        error: {
            main: red[800]
        }
    },
    typography: {
        fontFamily: 'sans-serif'
    },
});

const rootElement = document.createElement('div');
rootElement.id = 'root';

document.body.appendChild(rootElement)

const root = ReactDOM.createRoot(rootElement);
root.render(
    <Router>
        <ThemeProvider theme={theme}>
            <UserDataContextProvider>
                <App />
            </UserDataContextProvider>
        </ThemeProvider>
    </Router>
);