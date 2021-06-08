import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';

import UpdateTrackerForm from './UpdateTrackerForm'
import JsonPreview from './JsonPreview'

const useStyles = makeStyles((theme) => ({
    container: {
        border: '2px solid grey',
        width: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '5px',
        margin: '9px 20px 9px 0px'
    },
    nameLabel: {
        flexGrow: 1,
        // whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center'
    },
    actionContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 8,
        height: '100%',
        width: '32px',
        borderLeft: '2px solid grey',
    }
}))

const TrackerCard = ({
    tracker,
    selectTracker,
    deselectTracker,

    trackers,
    setTrackers,
    deleteRequest
}) => {
    const [checked, setChecked] = React.useState(false);
    const classes = useStyles()

    const handleChange = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            selectTracker(tracker)
        } else {
            deselectTracker(tracker)
        }
    };

    return (
        <div className={classes.container}>
            <Checkbox
                disabled={deleteRequest}
                checked={checked}
                onChange={handleChange}
                disableRipple
                color='secondary'
                size='small'
            />
            <Typography className={classes.nameLabel}>
                {tracker.name}
            </Typography>
            <div className={classes.actionContainer}>
                <UpdateTrackerForm
                    tracker={tracker}
                    trackers={trackers}
                    setTrackers={setTrackers}
                    isEditMode
                    deleteRequest={deleteRequest}
                />
                <JsonPreview
                    src={tracker}
                    component={(
                        <IconButton
                            size='small'
                            disableRipple
                            disabled={deleteRequest}>
                            <VisibilityIcon />
                        </IconButton>
                    )}
                />
            </div>
        </div>
    )
}

export default TrackerCard