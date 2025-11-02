
import { DeleteMapAlert } from "./DeleteMapAlert";
import { UpdateMapModal } from "./UpdateMapModal";
import { QRModal } from "./QRModal";


type ChildProps = {
    mapId: string
    map: any
    setSavedMaps: (maps: any) => void
    savedMaps: any
};

function ExistingMap({ mapId, map, setSavedMaps, savedMaps }: ChildProps) {

    const uid = sessionStorage.getItem("uid") || "";

    return (
        <>
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-2">
                <div className="bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg overflow-hidden">
                    <img src={`/images/university_pictures/${map.university}.jpg`} className="w-full h-48 object-cover" alt={map.university}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/default_university.jpg";
                        }} />
                    <div className="p-5">
                        <h5 className="text-center text-xl font-semibold mb-2" style={{ color: "#102b72" }}>{map.university}</h5>
                        <p className="text-center text-sm mb-4" style={{ color: "#102b72", opacity: 0.7 }}>{map.country}</p>
                        <div className="space-y-2 mb-4">
                            {Object.keys(map['map']).filter((courseArea) => map['map'][courseArea].courses.length > 0).map((courseArea) => (
                                <div key={courseArea} className="bg-white border border-[#102b72]/20 rounded-lg p-3">
                                    <p className="font-semibold text-sm mb-2" style={{ color: "#102b72" }}>{courseArea}</p>
                                    {map['map'][courseArea].courses.map((course: string, index: number) => (
                                        <p className="text-xs p-0 m-0 mb-1" style={{ color: "#102b72", opacity: 0.8 }} key={`${map.id}-${courseArea}-${index}`}>{course}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between gap-2 mb-3">
                            <UpdateMapModal mapId={mapId} map={map} />
                            <DeleteMapAlert uid={uid} mapId={map.id} setSavedMaps={setSavedMaps} savedMaps={savedMaps} />
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