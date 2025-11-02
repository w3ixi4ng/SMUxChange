
import { DeleteMapAlert } from "./DeleteMapAlert";
import { UpdateMapModal } from "./UpdateMapModal";
import { QRModal } from "./QRModal";


type ChildProps = {
    mapId: string
    map: any
    setSavedMaps: (maps: any) => void
};

function ExistingMap({ mapId, map, setSavedMaps }: ChildProps) {

    const uid = sessionStorage.getItem("uid") || "";


    return (
        <>
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-2">
                <div className="bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg overflow-hidden">
                    <img src={`/images/university_pictures/${map.university}.jpg`} className="w-full h-48 object-cover" alt={map.university}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/default_university.jpg";
                        }} />
                    <div className="p-4">
                        <h5 className="text-center text-lg font-semibold mb-1" style={{ color: "#102b72" }}>{map.university}</h5>
                        <p className="text-center text-xs mb-3" style={{ color: "#102b72", opacity: 0.7 }}>{map.country}</p>
                        <div className="space-y-1.5 mb-3 max-h-96 overflow-y-auto">
                            {Object.keys(map['map']).filter((courseArea) => map['map'][courseArea].courses.length > 0).map((courseArea) => (
                                <div key={courseArea} className="bg-white border border-[#102b72]/20 rounded-lg p-2">
                                    <p className="font-semibold text-xs mb-1" style={{ color: "#102b72" }}>{courseArea}</p>
                                    <ul className="list-disc list-inside">
                                    {map['map'][courseArea].courses.map((course: string, index: number) => (
                                        <li className="text-xs p-0 m-0 mb-0.5 leading-tight" style={{ color: "#102b72", opacity: 0.8 }} key={`${map.id}-${courseArea}-${index}`}>{course}</li>
                                    ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between gap-2 mb-2">
                            <UpdateMapModal mapId={mapId} map={map} setSavedMaps={setSavedMaps} />
                            <DeleteMapAlert uid={uid} mapId={map.id} setSavedMaps={setSavedMaps} />
                        </div>
                        <div className="flex justify-center">
                            <QRModal map={map} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExistingMap;