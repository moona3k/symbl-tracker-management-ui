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
import EditIcon from '@material-ui/icons/Edit';

import * as ManagementAPI from '../../api/management'
import JsonViewer from './JsonViewer'

const initialState = {
    name: { value: "", touched: false, hasError: false, error: "" },
    vocabulary: []
}
const formify = tracker => {
    if (!tracker || !tracker.vocabulary) return initialState
    return {
        ...tracker, // contains tracker.id
        name: { value: tracker.name, touched: false, hasError: false, error: "" },
        vocabulary: tracker.vocabulary.map(item => ({
            value: item, touched: false, hasError: false, error: ""
        }))
    }
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

        case 'RESET_FORM': {
            return action.payload
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

const UpdateTrackerForm = ({ trackers, setTrackers, tracker, deleteRequest }) => {
    const [state, dispatch] = useReducer(formsReducer, initialState)
    const [isLoading, setIsLoading] = React.useState(false)
    const [networkError, setNetworkError] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    React.useEffect(() => {
        dispatch({
            type: 'RESET_FORM',
            payload: formify(tracker)
        })
    }, [open, tracker])

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

    const updateTracker = () => {
        setIsLoading(true)
        const payload = {
            name: state.name.value,
            vocabulary: state.vocabulary.map(item => item.value)
        }
        ManagementAPI.updateTracker(state.id, payload)
            .then(data => {
                setIsLoading(false)
                console.log('update tracker success', data.tracker)
                const index = trackers.findIndex(tracker => tracker.id === data.tracker.id)
                const updated = [...trackers]
                updated[index] = data.tracker
                setTrackers(updated)
                handleClose()
            })
            .catch(err => {
                setIsLoading(true)
                console.log('update tracker fail', err)
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
            <IconButton
                size='small'
                disableRipple
                onClick={() => setOpen(true)}
                disabled={deleteRequest}
            >
                <EditIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth={false}
                classes={{ paper: classes.dialog }}
            >
                <div style={{ padding: '24px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <Typography variant='h5' style={{ fontWeight: 600, marginBottom: 8 }}>{`EDIT TRACKER`}</Typography>
                        <Typography variant='caption' display='block'>
                            Update the name and vocabulary fields.
                        </Typography>
                        <Typography variant='caption' display='block'>
                            For more information, please visit <a target="_blank" rel="noopener noreferrer" href='https://docs.symbl.ai/docs/management-api/trackers/update-tracker/'>Symbl Documentations</a>.
                        </Typography>
                        <div style={{ display: 'flex', marginTop: 30 }}>
                            <div style={{ width: '50%' }}>
                                <Typography variant='subtitle1'>
                                    {`Name - unique identifier of tracker entity`}
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
                                    {`Vocabulary - contextually relevant keywords & phrases`}
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {
                                        state.vocabulary.map((vocab, index) => (
                                            <div
                                                key={`${vocab}-${index}`}
                                                style={{ display: 'flex' }}
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
                            onClick={updateTracker}
                            disableRipple
                            variant="contained"
                            size="medium"
                            disabled={(
                                state.name.value?.length === 0 ||
                                state.name.hasError ||
                                state.vocabulary?.length === 0 ||
                                state.vocabulary.some(vocab => vocab.value?.length === 0) ||
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
                                    Updating Tracker
                                        </div>
                                    )
                                    : `Update Tracker`
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

export default UpdateTrackerForm
