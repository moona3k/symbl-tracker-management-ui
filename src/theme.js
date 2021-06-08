import { createMuiTheme, colors } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        background: {
            default: "#f3f3f5",
        },
        primary: {
            main: colors.indigo[700],
        },
        secondary: {
            main: colors.purple[700]
        },
        text: {
            primary: colors.blueGrey[900],
            secondary: colors.blueGrey[600],
        },
    }
});

export default theme;
