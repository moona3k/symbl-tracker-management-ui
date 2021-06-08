import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";
import * as ManagementAPI from '../../api/management'

import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
    deleteButton: {
        fontWeight: 'bold',
        marginLeft: 20,
        color: props => !props.disabled && 'red',
        border: props => !props.disabled && '1px solid red',
    }
});

const DeleteButton = ({
    selected,
    setSelected,
    trackers,
    setTrackers,
    deleteRequest,
    setDeleteRequest
}) => {
    const classes = useStyles({ disabled: selected.length === 0 })

    const handleDelete = () => {
        setDeleteRequest(true)
        let promises = []
        for (let tracker of selected) {
            const deleteRequest = ManagementAPI.deleteTracker(tracker.id)
            promises.push(deleteRequest)
        }

        Promise.all(promises)
            .then(response => {
                console.log('Delete tracker success', response)
                setDeleteRequest(false)
                setSelected([])

                const deleteIds = response.map(obj => obj.id).filter(el => !!el)
                const remaining = [...trackers].filter(tracker => !deleteIds.includes(tracker.id))
                setTrackers(remaining)
            })
            .catch(err => {
                console.log('Delete tracker fail', err)
                setDeleteRequest(false)
            })
    }

    return (
        <Button
            variant='outlined'
            disabled={selected.length === 0 || deleteRequest}
            className={classes.deleteButton}
            disableRipple
            onClick={handleDelete}
        >
            {
                deleteRequest
                    ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={16} style={{ marginRight: '15px', color: '#888' }} />
                                    Deleting Tracker
                        </div>
                    )
                    : `Delete Tracker`
            }
        </Button >

    )
}

export default DeleteButton
