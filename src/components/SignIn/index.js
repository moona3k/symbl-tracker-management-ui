import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authenticateSymbl } from '../../api/authentication'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: props => ({
        margin: theme.spacing(1),
        backgroundColor: !props.isDisabled && theme.palette.secondary.main,
    }),
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    signInButton: {
        margin: theme.spacing(3, 0, 2),
        fontWeight: 'bold'
    },
}));

const SignInSymbl = () => {
    const [state, setState] = React.useState({ appId: '', appSecret: '' })
    const [isLoading, setIsLoading] = React.useState(false)
    const [isError, setIsError] = React.useState(false)
    const isDisabled = state.appId.length === 0 || state.appSecret.length === 0
    const classes = useStyles({ isDisabled });
    const history = useHistory();

    const handleInputChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const handleClick = async () => {
        setIsLoading(true)
        const payload = {
            appId: state.appId,
            appSecret: state.appSecret
        }

        try {
            const token = await authenticateSymbl(payload)
            setIsLoading(false)
            history.push("/trackers");
        } catch (e) {
            console.log('this is e', e)
            setIsLoading(false)
            setIsError(true)
        }
    }

    return (
        <Container maxWidth="xs">
            <div className={classes.container}>
                <Avatar className={classes.avatar}>
                    <VpnKeyIcon />
                </Avatar>
                <form className={classes.form}>
                    <TextField
                        variant="filled"
                        value={state.appId}
                        onChange={handleInputChange}
                        margin="normal"
                        color="secondary"
                        required
                        fullWidth
                        label="App ID"
                        name="appId"
                        autoFocus
                    />
                    <TextField
                        variant="filled"
                        value={state.appSecret}
                        onChange={handleInputChange}
                        margin="normal"
                        color="secondary"
                        required
                        fullWidth
                        label="App Secret"
                        name="appSecret"
                        type="password"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        disabled={isDisabled || isLoading}
                        disableRipple
                        onClick={handleClick}
                        className={classes.signInButton}
                    >
                        {
                            isLoading
                                ? (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CircularProgress size={16} style={{ marginRight: '15px', color: '#888' }} />
                                    Please wait...
                                    </div>
                                )
                                : `Sign In`
                        }
                    </Button>
                    {isError &&
                        <Typography variant='body2' align='center' style={{ color: 'red' }}>Something went wrong. Please try again.</Typography>}
                </form>
            </div>
            <Box mt={6}>
                <Typography variant="body2" color="textPrimary" align="center">
                    {`Please visit `}
                    <Link target="_blank" rel="noopener noreferrer" color="inherit" href="https://platform.symbl.ai/" variant="body2">
                        Symbl Platform
                    </Link>{` to get your app credentials.`}
                </Typography>
            </Box>
        </Container>
    );
}

export default SignInSymbl