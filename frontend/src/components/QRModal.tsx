
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
import { Copy, Check, Share2 } from "lucide-react"
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
                <button className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105 bg-success text-white border-none">
                    <Share2 className="w-4 h-4 d-inline align-middle mr-2" />
                    Share Map
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 border-blue-200 [&_button[data-slot='dialog-close']]:text-blue-600 [&_button[data-slot='dialog-close']]:hover:bg-blue-100 [&_button[data-slot='dialog-close']]:hover:text-blue-700 max-w-[90vw]">
                <DialogHeader>
                    <div className="flex flex-col items-center gap-3 mb-2">
                        <DialogTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                            Share Your Map
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-600 text-base text-center">
                        Scan the QR code below to access and share your module mapping.
                    </DialogDescription>
                </DialogHeader>
                
                {/* QR Code Container */}
                <div className="relative flex flex-col items-center justify-center my-6">
                    {/* Decorative background circles */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl scale-150"></div>
                    
                    {/* QR Code Frame */}
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-200 ring-4 ring-blue-100/50 max-w-full">
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full shadow-lg"></div>
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 rounded-full shadow-lg"></div>
                        <img src={qrCode || ""} alt="QR Code" className="w-64 h-64 mx-auto max-w-full" />
                    </div>
                </div>

                {/* Copy Link Section */}
                <div className="mt-4 w-full flex flex-col gap-3">
                    <div className="relative">
                        <Button
                            onClick={handleCopy}
                            disabled={!url}
                            className="w-full flex items-center gap-3 justify-center font-semibold px-6 py-3 rounded-xl bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    <span className="truncate max-w-[380px]">{url || "Generating link..."}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <DialogFooter className='d-flex justify-content-center mt-4'>
                    <DialogCancel className="bg-white border-2 border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        Close
                    </DialogCancel>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

