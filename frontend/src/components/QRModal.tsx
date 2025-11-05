
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
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import axios from "axios";
import { useEffect, useState } from "react";

type ChildProps = {
    map: any
}

export function QRModal({ map }: ChildProps) {

    const [qrCode, setQrCode] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateQRCode = async () => {
        const response = await axios.post(`https://smuxchange-backend.vercel.app/api/qrCode`, {
            map: map
        });
        setQrCode(response.data.qrCode);
        setUrl(response.data.url);
    }

    const handleCopy = async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            toast.error("Failed to copy link");
        }
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
                <div className="mt-3 w-full flex justify-center">
                    <Button
                        onClick={handleCopy}
                        disabled={!url}
                        className="w-full max-w-[480px] flex items-center gap-2 justify-center font-semibold px-6 py-3 rounded-xl border-2 bg-white text-[#102b72] border-[#102b72]/30 hover:bg-[#102b72]/10 focus:outline-none focus:ring-2 focus:ring-[#102b72]/30 transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="truncate max-w-[380px]">{url || "Generating link..."}</span>
                    </Button>
                </div>
                <DialogFooter className='d-flex justify-content-center bottom-0 z-10 bg-[#eeeeee] py-3 w-50 mx-auto rounded-2xl'>
                    <DialogCancel className="bg-white border border-[#102b72]/30 hover:bg-[#102b72]/10" style={{ color: "#102b72" }}>Cancel</DialogCancel>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

