import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogAction,
    DialogCancel,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { UpdateCourseMap } from "./UpdateCourseMap";

type ChildProps = {
    map: any

}

export function UpdateMapModal({ map }: ChildProps) {

    const [schoolCourses, setSchoolCourses] = useState<string[][]>([]);
    const [majorElectives, setMajorElectives] = useState<any>(null);
    const [trackElectives, setTrackElectives] = useState<string[]>([]);
    const [secondMajorElectives, setSecondMajorElectives] = useState<string>("");

    const fetchSchoolCores = async (faculty: string, major: string, track: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getTracksByMajor/${faculty}`);
            const mapable_mods = JSON.parse(response.data[0].Mappable);
            let major_electives = mapable_mods[0]['Majors']['First Major'][major]['Major Elective'];
            setMajorElectives(major_electives);
            let records = [] as string[][];
            let sch_core = mapable_mods[0];
            for (let core in sch_core) {
                let temp = []
                if (core == "Free Elective") {
                    let fac_abbr = response.data[0].Faculty;
                    temp.push(sch_core[core], `${fac_abbr} Free Elective`);
                    records.push(temp);
                }
                else if (core != "Majors") {
                    temp.push(sch_core[core], core);
                    records.push(temp);
                }
            }
            setSchoolCourses(records);

            if (track != "") {
                const mapable_mods = JSON.parse(response.data[0].Mappable);
                let track_electives = mapable_mods[0]['Majors']['First Major'][major]['Track'][track];
                setTrackElectives([track_electives, track]);
            }
        }
        catch (error) {
            console.log("API error:", error);
        }
    }

    const fetchSecondMajors = async (secondMajor: string) => {
        try {
            const response = await axios.get(`http://localhost:3001/database/getAllFaculty`);
            const faculty = response.data;
            let records = {} as { [key: string]: string };
            for (let f of faculty) {
                let mappable_mods = JSON.parse(f.Mappable);
                if (mappable_mods[0].Majors['Second Major']) {
                    let second_major_obj = mappable_mods[0].Majors['Second Major'];
                    for (let second_major in second_major_obj) {
                        records[second_major] = second_major_obj[second_major]['Major Elective'];
                    }
                }
            }
            if (secondMajor != "") {
                setSecondMajorElectives(records[secondMajor]);
            }
        }
        catch (error) {
            console.log("API error:", error);
        }
    }

    useEffect(() => {
        fetchSchoolCores(map.faculty, map.major, map.track);
    }, [map.faculty, map.major, map.track]);

    useEffect(() => {
        fetchSecondMajors(map.secondMajor);
    }, [map.secondMajor]);

    // Combine all course areas with their limits
    const allElectives = [] as any[];
    if (schoolCourses.length > 0) {
        for (let course of schoolCourses) {
            allElectives.push(course);

        }
    }
    if (majorElectives && typeof majorElectives === 'object') {
        Object.values(majorElectives).forEach((value: any) => {
            allElectives.push([value[0], value[1]]);
        });
    }
    if (trackElectives.length > 0) {
        allElectives.push(trackElectives);
    }
    if (secondMajorElectives != "") {
        allElectives.push(secondMajorElectives);
    }

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
                <div className="container mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg py-8 px-6 mb-10 w-75">
                    <h4 className="text-black-200 mb-1 font-bold">Mapped For</h4>
                    <div className="row">
                        <div className="col-lg-6 ">
                            <p className="text-black-200 mb-1 font-bold">Country</p>
                            <p className="text-gray-400 mb-1">{map.country}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-black-200 mb-1 font-bold">University</p>
                            <p className="text-gray-400 mb-1">{map.university}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-black-200 mb-1 font-bold">Faculty</p>
                            <p className="text-gray-400 mb-1">{map.faculty}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-black-200 mb-1 font-bold">Major</p>
                            <p className="text-gray-400 mb-1">{map.major}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-black-200 mb-1 font-bold">Track</p>
                            <p className="text-gray-400 mb-1">{map.track ? map.track : "None"}</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="text-black-200 mb-1 font-bold">Second Major</p>
                            <p className="text-gray-400 mb-1">{map.secondMajor ? map.secondMajor : "None"}</p>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg py-8 px-6 mb-10 w-75">
                    <h4 className="text-black-200 mb-1 font-bold">Current Map</h4>
                    <div className="row">
                        {Object.keys(map['map']).filter((courseArea) => map['map'][courseArea].courses.length > 0).map((courseArea) => (
                            <div className="col-lg-6">
                                <p className="text-black-200 mb-1 font-bold">{courseArea}</p>
                                {map['map'][courseArea].courses.map((course: string) => (
                                    <p className="text-gray-400 mb-1" key={`${map.id}-${courseArea}-${course}`}>{course}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="container mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg py-8 px-6 mb-10 w-75">
                    <h4 className="text-black-200 mb-1 font-bold">Available Courses</h4>
                    <div className="row">
                        {allElectives.map((courseArea, index) => (
                            <UpdateCourseMap
                                key={`${courseArea[1]}-${index}`}
                                courseArea={courseArea}
                                university={map.university}
                                map={map}
                            />
                        ))}
                    </div>
                </div>
                <DialogFooter className='d-flex justify-content-center sticky bottom-0 z-10 bg-dark py-3 w-50 mx-auto rounded-2xl'>
                    <DialogCancel className="">Cancel</DialogCancel>
                    <DialogAction className="bg-blue-500 hover:bg-gray-500">Save Changes</DialogAction>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

