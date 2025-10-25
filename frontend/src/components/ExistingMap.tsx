
import { DeleteMapAlert } from "./DeleteMapAlert";


type ChildProps = {
    map: any
    setSavedMaps: (maps: any) => void
    savedMaps: any
};

function ExistingMap({ map, setSavedMaps, savedMaps }: ChildProps) {

    const uid = sessionStorage.getItem("uid") || "";

    return (
        <>
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-2">
                <div className="card">
                    <img src="./images/university.jpg" className="card-img-top" alt={map.university} />
                    <div className="card-body">
                        <h5 className="card-title text-center">{map.university}</h5>
                        <p className="card-text text-center">{map.country}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        {Object.keys(map['map']).map((courseArea) => (
                            <li className="list-group-item" key={courseArea}>{courseArea}
                            {map['map'][courseArea].map((university: any) => (
                                <p className="text-sm p-0 m-0" key={map.id}>{university}</p>
                            ))}
                            </li>
                        ))}
                    </ul>
                    <div className="card-body d-flex justify-content-between gap-2">
                        <button className="btn btn-outline-primary btn-sm w-100">Update Map</button>
                        <DeleteMapAlert uid={uid} mapId={map.id} setSavedMaps={setSavedMaps} savedMaps={savedMaps} />
                    </div>
                </div>
            </div>

            
        </>
    )
}

export default ExistingMap;