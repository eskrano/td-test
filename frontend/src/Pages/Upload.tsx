import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';

export type UploadProps = {
    // no props here 
};


export const Upload: FC<UploadProps> = (props) => {
    const [data, setData] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        const response = await axios.post('/csv', {
            data: 'some data'
        });

        if (response.status === 200) {
            setData(JSON.stringify(response.data));
        }
    }

    return (
        <div>
            <h1>Upload CSV</h1>

            {data && <pre style={{
                padding: '10px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
            }}>
                {JSON.stringify(data)}
            </pre>}

            <form onSubmit={(event) => {
                event.preventDefault();

                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    axios.post('/csv', formData).then((response) => {
                        setData(JSON.stringify(response.data));
                    });
                }
            }}>
                <input type="file" onChange={(event) => {
                    const files = event.target.files;
                    if (files) {
                        setFile(files[0]);
                    }
                }} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}