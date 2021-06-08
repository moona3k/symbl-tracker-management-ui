import React, { useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import * as ManagementAPI from '../../api/management'
import JsonViewer from './JsonViewer'

const initialState = {
    name: { value: "", touched: false, hasError: false, error: "" },
    vocabulary: []
}

const formsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TRACKER_NAME': {
            return {
                ...state,
                name: action.payload
            }
        }
        case 'SET_TRACKER_VOCABULARY': {
            let vocabulary = [...state.vocabulary]
            vocabulary[action.index] = action.payload

            return {
                ...state,
                vocabulary
            }
        }
        case 'ADD_TRACKER_VOCABULARY': {
            let vocabulary = [...state.vocabulary]
            vocabulary.push({ value: "", touched: false, hasError: false, error: "" })

            return {
                ...state,
                vocabulary
            }
        }
        case 'DELETE_TRACKER_VOCABULARY': {
            let vocabulary = [...state.vocabulary]
            vocabulary = vocabulary.filter((_, index) => index !== action.index)

            return {
                ...state,
                vocabulary
            }
        }
        case 'CREATE_SUCCESS': {
            return action.payload // this needs to be processed to include metadata like hasError, error, touched
        }
        case 'RESET_FORM': {
            return initialState
        }
        default:
            return state
    }
}

const useStyles = makeStyles((theme) => ({
    dialog: {
        height: '100%',
        marginRight: 100,
        marginLeft: 100
    },
    iconButton: {
        margin: theme.spacing(1),
    },
    nameTextfield: {
        width: `calc(100% - 60px)`
    },
    vocabularyTextfield: {
        flexGrow: 1
    },
    addButton: {
        width: `calc(100% - 60px)`
    },
    createButton: {
    },
}));

const CreateTrackerForm = ({ trackers, setTrackers, deleteRequest }) => {
    const [state, dispatch] = useReducer(formsReducer, initialState)
    const [isLoading, setIsLoading] = React.useState(false)
    const [networkError, setNetworkError] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    React.useEffect(() => {
        dispatch({ type: 'RESET_FORM' })
    }, [open])

    const addVocabulary = () => {
        dispatch({
            type: 'ADD_TRACKER_VOCABULARY'
        })
    }

    const deleteVocabulary = (_, index) => {
        dispatch({
            type: 'DELETE_TRACKER_VOCABULARY',
            index
        })
    }

    const createTracker = () => {
        setNetworkError(false)
        setIsLoading(true)
        const payload = {
            name: state.name.value,
            vocabulary: state.vocabulary.map(item => item.value)
        }
        ManagementAPI.createTracker(payload)
            .then(data => {
                setIsLoading(false)
                console.log('create tracker success', data.tracker)
                setTrackers(prev => [...prev, data.tracker])
                handleClose()
            })
            .catch(err => {
                setIsLoading(false)
                setNetworkError(true)
                console.log('create tracker fail', err)

            })
    }

    const validateUniqueName = (name) => {
        let hasError = false
        let error = ""

        if (name.length === 0) {
            hasError = true
            error = `Name field cannot be empty.`
            return { hasError, error }
        }

        for (let tracker of trackers) {
            if (tracker.name === name) {
                hasError = true
                error = `Name must be unique - '${name}' already exists.`
            }
        }
        return { hasError, error }
    }
    const handleChangeName = (e, onBlur = false) => {
        const { hasError, error } = validateUniqueName(e.target.value)

        dispatch({
            type: 'SET_TRACKER_NAME',
            payload: {
                value: e.target.value,
                touched: onBlur ? true : false,
                hasError,
                error
            }
        })
    }

    const validateUniqueVocabulary = (vocab) => {
        let hasError = false
        let error = ""

        if (vocab.length === 0) {
            hasError = true
            error = `Vocabulary field cannot be empty.`
        } else {
            const duplicateFound = state.vocabulary.filter(el => el.value === vocab).length > 1
            if (duplicateFound) {
                hasError = true
                error = `There shouldn’t be duplicate vocabulary phrases.`
            }
        }
        return { hasError, error }
    }
    const handleChangeVocabulary = (e, index, onBlur = false) => {
        const { hasError, error } = validateUniqueVocabulary(e.target.value)

        dispatch({
            type: 'SET_TRACKER_VOCABULARY',
            index,
            payload: {
                value: e.target.value,
                touched: onBlur ? true : false,
                hasError,
                error
            }
        })
    }

    const handleClose = () => {
        if (isLoading) return
        setOpen(false)
        setNetworkError(false)
    }

    return (
        <>
            <Button
                variant='contained'
                color='secondary'
                disabled={deleteRequest}
                style={{ fontWeight: 'bold' }}
                disableRipple
                onClick={() => setOpen(true)}
            >
                Create new Tracker
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth={false}
                classes={{ paper: classes.dialog }}
            >
                <div style={{ padding: '24px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <Typography variant='h5' style={{ fontWeight: 600, marginBottom: 8 }}>{`CREATE NEW TRACKER`}</Typography>
                        <Typography variant='caption' display='block'>
                            {`Each tracker has a uniquely identifiable name and a vocabulary set. Symbl will detect for exact matches and "contextual similarities" that are inferred from the set of vocabulary.`}
                        </Typography>
                        <Typography variant='caption' display='block'>
                            For more information, please visit <a target="_blank" rel="noopener noreferrer" href='https://docs.symbl.ai/docs/management-api/trackers/create-tracker/'>Symbl Documentations</a>.
                        </Typography>
                        <div style={{ display: 'flex', marginTop: 30 }}>
                            <div style={{ width: '50%' }}>
                                <Typography variant='subtitle1'>
                                    {`1. Provide a name for your tracker entity.`}
                                </Typography>
                                <TextField
                                    type='text'
                                    variant="filled"
                                    value={state.name.value}
                                    className={classes.nameTextfield}
                                    color='secondary'
                                    label='Name'
                                    name='name'
                                    multiline
                                    disabled={isLoading}
                                    InputLabelProps={{ shrink: true }}

                                    onChange={handleChangeName}
                                    onBlur={(e) => handleChangeName(e, true)}

                                    error={state.name.touched && state.name.hasError}
                                    helperText={state.name.touched && state.name.hasError && state.name.error}
                                />
                                <Typography variant='subtitle1' style={{ marginTop: 16 }}>
                                    {`2. Add keywords and phrases that you want to track.`}
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {
                                        state.vocabulary.map((vocab, index) => (
                                            <div
                                                style={{ display: 'flex' }}
                                                key={`${vocab}-${index}`}
                                            >
                                                <TextField
                                                    type='text'
                                                    variant="filled"
                                                    className={classes.vocabularyTextfield}
                                                    value={vocab.value}
                                                    color='secondary'
                                                    label={`Vocabulary ${index}`}
                                                    name='vocabulary'
                                                    multiline
                                                    disabled={isLoading}
                                                    InputLabelProps={{ shrink: true }}

                                                    onChange={(e) => handleChangeVocabulary(e, index)}
                                                    onBlur={(e) => handleChangeVocabulary(e, index, true)}

                                                    error={vocab.touched && vocab.hasError}
                                                    helperText={vocab.touched && vocab.hasError && vocab.error}
                                                />
                                                {
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <IconButton
                                                            className={classes.iconButton}
                                                            disableRipple
                                                            disabled={isLoading}
                                                            onClick={(e) => deleteVocabulary(e, index)}
                                                        >
                                                            <DeleteIcon
                                                                fontSize="small"
                                                            />
                                                        </IconButton>
                                                    </div>
                                                }
                                            </div>
                                        ))
                                    }
                                    <Button
                                        variant="contained"
                                        onClick={addVocabulary}
                                        disableRipple
                                        startIcon={<AddIcon />}
                                        className={classes.addButton}
                                        disabled={isLoading}
                                        size="small"
                                    >Add Vocabulary</Button>
                                </div>
                            </div>
                            <div style={{ width: '50%', alignSelf: 'center' }}>
                                <Typography variant='subtitle1'
                                    style={{
                                        backgroundColor: '#272822', // monokai bg
                                        display: 'inline-block',
                                        color: '#E6E6E6', // monokai white,
                                        borderRadius: '5px 5px 0px 0px',
                                        padding: '6px 12px',
                                    }}
                                >JSON Preview</Typography>
                                <JsonViewer
                                    src={{
                                        name: state.name.value,
                                        vocabulary: state.vocabulary.map(vocab => vocab.value)
                                    }}
                                    isTrackerForm
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 50 }}>
                        <Button
                            className={classes.createButton}
                            color='secondary'
                            onClick={createTracker}
                            disableRipple
                            variant="contained"
                            size="medium"
                            disabled={(
                                state.name.value.length === 0 ||
                                state.name.hasError ||
                                state.vocabulary.length === 0 ||
                                state.vocabulary.some(vocab => vocab.value.length === 0) ||
                                state.vocabulary.some(vocab => vocab.hasError) ||
                                isLoading
                            )}
                            style={{ padding: '6px 16px', fontWeight: 600, width: 300, alignSelf: 'center' }}
                        >
                            {
                                isLoading
                                    ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <CircularProgress size={16} style={{ marginRight: '15px', color: '#888' }} />
                                    Creating Tracker
                                        </div>
                                    )
                                    : `Create New Tracker`
                            }
                        </Button>
                        <Typography variant='caption' align='center' style={{ marginTop: 8, marginBottom: 8 }}>This tracker entity will be stored to your account via Management API for future access.</Typography>
                        {networkError && <Typography variant='subtitle2' align='center' style={{ marginBottom: 8, color: 'red' }}>Request has failed - please try again. If problem persists, contact us at <a href="mailto:devrelations@symbl.ai">devrelations@symbl.ai</a></Typography>}
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default CreateTrackerForm
