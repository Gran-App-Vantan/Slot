'use client';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RegisterContent({ token }: { token: string }) {
    const qrUrl = `http://10.79.12.146:3005/connection/${token}/`;
    console.log(qrUrl);

    return  (
        <div className='bg-[url(/bg/qr_bg.png)] w-full h-screen bg-cover bg-center flex items-center justify-center'>
            <div className='bg-black border-5 border-red-700 w-180 h-130 flex justify-center items-center flex-col rounded-2xl'>
                <div className='bg-white rounded-2xl w-70 h-70 flex items-center justify-center'>
                    <QRCodeSVG value={qrUrl} className='w-64 h-64' />
                </div>
                <p className='text-3xl font-bold text-center text-white mt-6'>QRコードを読み込んでください</p>
            </div>
        </div>
    )
}

export default RegisterContent;