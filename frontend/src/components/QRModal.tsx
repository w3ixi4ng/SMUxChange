
import {
    Dialog,
    DialogCancel,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios";
import { useEffect, useState } from "react";

type ChildProps = {
    map: any
}

export function QRModal({ map }: ChildProps) {

    const [qrCode, setQrCode] = useState<string | null>(null);

    const generateQRCode = async () => {
        const response = await axios.post(`https://smuxchange-backend.vercel.app/api/qrCode`, {
            map: map
        });
        setQrCode(response.data.qrCode);
    }

    useEffect(() => {
        generateQRCode();
    }, []);

    return (

        <Dialog>
            <DialogTrigger asChild>
                <button className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105 bg-success text-white border-none">Share Map</button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#eeeeee] border-[#102b72]/20 [&_button[data-slot='dialog-close']]:text-[#102b72] [&_button[data-slot='dialog-close']]:hover:bg-[#102b72]/10">
                <DialogHeader>
                    <DialogTitle style={{ color: "#102b72" }}>QR Code</DialogTitle>
                    <DialogDescription style={{ color: "#102b72", opacity: 0.7 }}>
                        Scan the QR code to share your map.
                    </DialogDescription>
                </DialogHeader>
                <img src={qrCode || ""} alt="QR Code" className="w-80 mx-auto" />
                <DialogFooter className='d-flex justify-content-center sticky bottom-0 z-10 bg-[#eeeeee] py-3 w-50 mx-auto rounded-2xl'>
                    <DialogCancel className="bg-white border border-[#102b72]/30 hover:bg-[#102b72]/10" style={{ color: "#102b72" }}>Cancel</DialogCancel>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

