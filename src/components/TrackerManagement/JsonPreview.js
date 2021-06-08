import React from 'react'
import JsonViewer from './JsonViewer'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
    dialog: {
        borderRadius: '5px'
    }
}))

const JsonPreviewButton = ({ src, component }) => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles()

    const handleDialogClose = () => {
        setOpen(false)
    }

    return (
        <>
            <span onClick={() => setOpen(true)}>
                {component}
            </span>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                classes={{ paper: classes.dialog }}
            >
                <JsonViewer
                    src={src}
                    readOnly
                />
            </Dialog>
        </>
    )
}

export default JsonPreviewButton