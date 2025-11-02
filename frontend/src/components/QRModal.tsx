
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
        const response = await axios.post(`http://localhost:3001/api/qrCode`, {
            map: map
        });
        console.log(response);
        setQrCode(response.data.qrCode);
    }

    useEffect(() => {
        generateQRCode();
    }, []);

    return (

        <Dialog>
            <DialogTrigger asChild>
                <button className="btn btn-outline-success btn-sm w-100">Share Map</button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/20 [&_button[data-slot='dialog-close']]:text-white [&_button[data-slot='dialog-close']]:hover:bg-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white">QR Code</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Scan the QR code to share your map.
                    </DialogDescription>
                </DialogHeader>
                <img src={qrCode || ""} alt="QR Code" className="w-50 mx-auto" />
                <DialogFooter className='d-flex justify-content-center sticky bottom-0 z-10 bg-[#0a0a0a] py-3 w-50 mx-auto rounded-2xl'>
                    <DialogCancel className="">Cancel</DialogCancel>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

