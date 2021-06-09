import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from "@material-ui/core/Typography";

import * as ManagementAPI from '../../api/management'
// import JsonPreview from './JsonPreview'
import TrackerCard from './TrackerCard'
import DeleteButton from './DeleteButton'
import CreateTrackerForm from './CreateTrackerForm'
// import Button from "@material-ui/core/Button";
// import IconButton from '@material-ui/core/IconButton';
// import VisibilityIcon from '@material-ui/icons/Visibility';

const sortByAlphabet = trackers => {
    let sorted = [...trackers]
    sorted.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    })

    return sorted
}

const TrackerManagement = () => {
    const [trackers, setTrackers] = React.useState([])
    const [selected, setSelected] = React.useState([])
    const [isFetching, setIsFetching] = React.useState(true)
    const [deleteRequest, setDeleteRequest] = React.useState(false)

    React.useEffect(() => {
        const fetchAllTrackers = async () => {
            try {
                const data = await ManagementAPI.fetchAllTrackers()
                // console.log('Trackers fetched from Management API', data)
                const payload = sortByAlphabet(data.trackers)
                setTrackers(payload)
            } catch (e) {
                console.log('Trackers fetch from Management API failed', e)
            }
            setIsFetching(false)
        }

        fetchAllTrackers()
    }, [])

    const selectTracker = (tracker) => {
        setSelected([
            ...selected,
            tracker
        ])
    }

    const deselectTracker = (tracker) => {
        const removed = selected.filter(item => item.id !== tracker.id)
        setSelected([...removed])
    }

    const disabled = selected.length === 0 || deleteRequest

    if (isFetching) return (
        <div style={{ width: '100%' }}>
            <LinearProgress style={{ color: 'grey' }} />
        </div>
    )
    return (
        <div style={{ padding: '32px 62px' }}>
            <div>
                <Typography variant='h5' style={{ fontWeight: 600, marginBottom: 8 }}>TRACKER MANAGEMENT</Typography>
                <Typography variant='caption' display='block'>Trackers allow you to track the occurrence of certain keywords or phrases in a conversation, so you can identify emerging trends and gauge the nature of interactions.</Typography>
                <Typography variant='caption' display='block'>Create and manage your tracker collection through the Management API.</Typography>
                <Typography variant='caption' display='block'>Happy Tracking!</Typography>
                <Typography variant='caption' display='block' style={{ marginTop: 8 }}>
                    Please refer to <a target="_blank" rel="noopener noreferrer" href='https://docs.symbl.ai/docs/'>Symbl Documentations</a>
            &nbsp;to learn more about <a target="_blank" rel="noopener noreferrer" href='https://docs.symbl.ai/docs/concepts/trackers/'>Trackers</a>
            &nbsp;and <a target="_blank" rel="noopener noreferrer" href='https://docs.symbl.ai/docs/management-api/introduction/'>Management API.</a>
                </Typography>
            </div>
            <div style={{ display: 'flex', marginTop: 32, marginBottom: 12 }}>
                <CreateTrackerForm
                    trackers={trackers}
                    setTrackers={setTrackers}
                    deleteRequest={deleteRequest}
                />
                <DeleteButton
                    selected={selected}
                    setSelected={setSelected}

                    trackers={trackers}
                    setTrackers={setTrackers}

                    deleteRequest={deleteRequest}
                    setDeleteRequest={setDeleteRequest}
                />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {
                    trackers.map((tracker, i) => {
                        return (
                            <TrackerCard
                                key={`${tracker.name}-${i}`}
                                tracker={tracker}
                                selectTracker={selectTracker}
                                deselectTracker={deselectTracker}

                                trackers={trackers}
                                setTrackers={setTrackers}
                                deleteRequest={deleteRequest}
                            />
                        )
                    })
                }
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 32 }}>
                <Button
                    variant='contained'
                    color='secondary'
                    disabled={disabled}
                    style={{ fontWeight: 'bold', marginRight: 6 }}
                    disableRipple
                    onClick={() => alert('Coming soon...')}
                >
                    Start Tracking
            </Button >
                <JsonPreview
                    src={selected}
                    component={(
                        <IconButton
                            disabled={disabled}
                            disableRipple
                        >
                            <VisibilityIcon />
                        </IconButton>
                    )}
                />
            </div> */}
        </div >
    )
}

export default TrackerManagement
