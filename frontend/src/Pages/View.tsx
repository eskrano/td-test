import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';

export type ViewProps = {
    // no props here 
};


export const View: FC<ViewProps> = (props) => {
    const [data, setData] = useState<string>('');

    useEffect(() => {
        axios.get('/csv').then((response) => {
            setData(JSON.stringify(response.data));
        })
    }, []);

    return (
        <div>
            <h1>View</h1>

            <pre style={
                {
                    padding: '10px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }
            }>
                {data}
            </pre>
        </div>
    );
}