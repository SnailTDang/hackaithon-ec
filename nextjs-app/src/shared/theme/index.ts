import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2a9d8f', // deep purple
        },
        secondary: {
            main: '#f7e1d7', // blue teal
        },
        warning: {
            main: '#ffb627', // golden yellow
        },
        error: {
            main: '#d7263d', // vibrant red
        },
        success: {
            main: '#21b573', // green
        },
        info: {
            main: '#3a86ff', // bright blue
        },
        background: {
            default: '#f6f7f8', // light gray
            paper: '#fff',
        },
        text: {
            primary: '#212529', // dark blue-gray
            secondary: '#14213d', // deep purple
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 700, fontSize: '2rem' },
        h3: { fontWeight: 700, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        body1: { fontSize: '1.25rem' },
        body2: { fontSize: '1rem' },
        button: { textTransform: 'none', fontWeight: 600, fontSize: '1rem' },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            defaultProps: {
                variant: 'contained',
                color: 'primary',
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                },
                head: {
                    fontWeight: 700,
                    background: '#f0eef1',
                },
            },
        },
        MuiContainer: {
            defaultProps: {
                maxWidth: 'lg',
            },
        },
    },
})

export default theme
