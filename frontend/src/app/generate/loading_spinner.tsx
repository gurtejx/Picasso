"use client"
import CircularProgress from '@mui/joy/CircularProgress';

export default function LoadingSpinner() {
    return <main className="min-h-full flex flex-col items-center justify-center">
        <CircularProgress variant='plain'></CircularProgress>
    </main>
}