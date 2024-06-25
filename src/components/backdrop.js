import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { CircleLoader } from 'react-spinners';

export default function SimpleBackdrop() {
    return (
        <div className='fixed inset-0 :bg-black bg-opacity-25 backdrop-blur-sm z-40'>
            <div className='w-full h-full flex justify-center items-center'>
                <CircleLoader color="#36d7b7" loading/>
            </div>
            {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}
        </div>
    );
}