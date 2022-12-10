import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function BasicPagination({ nPages, currentPage, setCurrentPage }) {

    const changePage = (event, value) => {
        setCurrentPage(value);
    }

    return (
        <Stack spacing={2}>
            <Pagination count={nPages} color="primary" page={currentPage}
                onChange={changePage} size='medium'
                style={{
                    backgroundColor: 'white',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            />
        </Stack>
    );
}