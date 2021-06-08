import React from 'react'
import ReactJson from 'react-json-view'

const JsonViewer = ({ src, readOnly }) => {
    return (
        <ReactJson
            src={src}
            name={false}
            theme={`monokai`}
            iconStyle={`triangle`}
            indentWidth={4}
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={true}
            style={{
                padding: `${readOnly ? '24px' : '0px 0px 12px 12px'}`,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                borderRadius: '0px 5px 5px 5px'
            }}
        />
    )
}

export default JsonViewer
