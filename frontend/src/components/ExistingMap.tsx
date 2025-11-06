
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
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-2 d-flex">
                <div className="bg-white/80 backdrop-blur-md border border-[#102b72]/20 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 h-100 d-flex flex-column w-100">
                    <div className="relative">
                        <img src={`/images/university_pictures/${map.university}.jpg`} className="w-full h-48 object-cover" alt={map.university}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/images/default_university.jpg";
                            }} />
                        <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs border border-blue-200 bg-white/90 text-slate-700 shadow-sm">
                            {map.country}
                        </span>
                    </div>
                    <div className="p-4 d-flex flex-column flex-grow-1">
                        <h5 className="text-center text-lg font-semibold mb-1" style={{ color: "#102b72" }}>{map.university}</h5>
                        <p className="text-center text-xs mb-3" style={{ color: "#102b72", opacity: 0.7 }}>{map.country}</p>
                        <div className="space-y-1.5 mb-3 overflow-y-auto">
                            {Object.keys(map['map']).filter((courseArea) => map['map'][courseArea].courses.length > 0).map((courseArea) => (
                                <div key={courseArea} className="space-y-2 p-3 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                                    <p className="font-semibold text-xs uppercase tracking-wide text-slate-600 mb-1">{courseArea}</p>
                                    <div className="flex flex-wrap gap-2 pl-1">
                                        {map['map'][courseArea].courses.map((course: string, index: number) => (
                                            <span className="px-3 py-1.5 rounded-lg text-xs border border-indigo-200 hover:bg-blue-100 hover:border-indigo-300 transition-colors text-slate-700 bg-white" key={`${map.id}-${courseArea}-${index}`}>{course}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-nowrap justify-between gap-2 mb-2 mt-auto">
                            <div className="flex-1 min-w-0">
                                <UpdateMapModal mapId={mapId} map={map} setSavedMaps={setSavedMaps} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <DeleteMapAlert uid={uid} mapId={map.id} setSavedMaps={setSavedMaps} />
                            </div>
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