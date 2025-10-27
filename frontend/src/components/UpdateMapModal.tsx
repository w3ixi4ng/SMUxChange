import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type ChildProps = {
    map: any
    name: string
    faculty: string
    major: string
    track: string
    secondMajor: string
}

export function UpdateMapModal({ map, name, faculty, major, track, secondMajor }: ChildProps) {
    return (

        <Dialog>
            <DialogTrigger asChild>
                <button className="btn btn-outline-primary btn-sm w-100">Update Map</button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Map</DialogTitle>
                    <DialogDescription>
                        Make changes to your map here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="row">
                    <div className="col-lg-3">
                        Name: {name}
                    </div>
                </div>
                <DialogFooter className="d-flex justify-content-center">
                    <DialogClose><Button>Close</Button></DialogClose>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

