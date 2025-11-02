
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
                <div className="card">
                    <img src={`/images/university_pictures/${map.university}.jpg`} className="card-img-top" alt={map.university}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '.5rem' }} />
                    <div className="card-body">
                        <h5 className="card-title text-center">{map.university}</h5>
                        <p className="card-text text-center">{map.country}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        {Object.keys(map['map']).filter((courseArea) => map['map'][courseArea].courses.length > 0).map((courseArea) => (
                            <li className="list-group-item" key={courseArea}>{courseArea}
                                {map['map'][courseArea].courses.map((course: string, index: number) => (
                                    <p className="text-sm p-0 m-0" key={`${map.id}-${courseArea}-${index}`}>{course}</p>
                                ))}
                            </li>
                        ))}
                    </ul>
                    <div className="card-body d-flex justify-content-between gap-2 mb-0">
                        <UpdateMapModal mapId={mapId} map={map} />
                        <DeleteMapAlert uid={uid} mapId={map.id} setSavedMaps={setSavedMaps} savedMaps={savedMaps} />
                    </div>
                    <div className="card-body d-flex justify-content-center w-50 mx-auto">
                        <QRModal map={map} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExistingMap;