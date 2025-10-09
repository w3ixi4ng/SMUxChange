import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import type { Pill } from "@/types/Pill";
import axios from "axios";
import {useEffect } from "react";

interface ModuleCategory {
  id: string;
  name: string;
  pills: Pill[];
}


//testing functions
async function fetch_mappable(faculty_name: string, major_name: string, track_name: string, second_major:boolean) {
    let arr : {[key:string]: any} = {};
    try {
        const response = await axios.get(`http://localhost:3001/database/getFaculty/${faculty_name}`);
        var mappable_mods =  response.data[0].Mappable;
        var mods_json = JSON.parse(mappable_mods)[0];
        console.log(mods_json)
        for (let type_mods in mods_json) {
            if (type_mods == "Majors") {
                get_mappable_majors(mods_json[type_mods], second_major,major_name,track_name,arr);
            } else {
                arr[type_mods] = mods_json[type_mods];
            }
        }
    } catch(err) {
        console.log(err)
    }
    return arr;
}

function get_mappable_majors(major_object: {[key:string]:any}, second_major:boolean, major_name:string, track_name:string, final_object: {[key:string]:any}) {
    var first_major_obj = major_object["First Major"];
    get_mappable_helper(first_major_obj,major_name,track_name,final_object);
    if (second_major == true) {
        get_mappable_helper(major_object["Second Major"], major_name, track_name, final_object);
    }
}

function get_mappable_helper(major_object: {[key:string]:any}, major_name:string, track_name:string, final_object: {[key:string]:any}) {
    for (let majors in major_object) {
        if (majors == major_name) {
            var major_obj = major_object[majors];
            for (let major_mods in major_obj) {
                if ( major_mods== "Track") {
                    var track_mods = major_obj[major_mods];
                    for (let tracks in track_mods) {
                        if (tracks == track_name) {
                            final_object[track_mods[tracks][1]] = track_mods[tracks][0];
                        }
                    }
                } else {
                    final_object[major_obj[major_mods][1]] = major_obj[major_mods][0];
                }
            }
        }
    }
}

async function get_specific_mods(mappable_mods: {[key:string]:any}, university_chosen: string) {
    var return_obj = [];
    var id = 1;
    for (let keys in mappable_mods) {
        var return_object : {[key:string]:any} = {}
        return_object.id = keys;
        return_object.name = keys;
        try {
            var response = await axios.get(`http://localhost:3001/database/getByCourseAreaAndUniversity/${keys}/${university_chosen}`);
            var mod_details = response.data;
            var pill_data = []
            for (let values in mod_details) {
                pill_data.push({
                id: id,
                text: mod_details[values]["Course Title"],
                width: "auto" // Use a string for auto width
            });
            id++;
            }
            return_object.pills = pill_data;

        } catch(err) {
            console.log(err);
        }
        if (return_object.pills.length >0) {
            return_obj.push(return_object);
        }
    }
    return return_obj;
}




function Mappable() {
    
  // Multiple stacks/containers on the right side
  const [moduleCategories, setModuleCategories] = useState([]);

    useEffect(() => {
    async function fetchData() {
      const mappable = await fetch_mappable(
        "Lee Kong Chian School of Business",
        "No Major",
        "No Track",
        false
      );
      const get_val = await get_specific_mods(mappable, "University of Toronto");
      setModuleCategories(get_val);
    }
    fetchData();
  }, []);

    

  // Dropped pills (left side - empty zone)
  const [droppedPills, setDroppedPills] = useState<Pill[]>([]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, pill: Pill, categoryId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ pill, categoryId }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { pill, categoryId } = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Add to dropped pills
    setDroppedPills(prev => [...prev, { ...pill, id: Date.now() }]);
    
    // Remove from the specific category
    setModuleCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, pills: category.pills.filter(p => p.id !== pill.id) }
        : category
    ));
  };

  const removeFromDropped = (pillId: number) => {
    const pill = droppedPills.find(p => p.id === pillId);
    if (pill) {
      // Add back to the first available category (you can modify this logic)
      setModuleCategories(prev => prev.map((category, index) => 
        index === 0 
          ? { ...category, pills: [...category.pills, { ...pill, id: Date.now() }] }
          : category
      ));
      // Remove from dropped pills
      setDroppedPills(prev => prev.filter(p => p.id !== pillId));
    }
  };

  return (
    <div className="p-6 h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Mappable Locations</h1>
      
      <div className="flex h-full gap-6">
        {/* Left side - Droppable Zone */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Drop Zone</h2>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[400px] bg-gray-50 hover:bg-gray-100 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {droppedPills.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Drag pills from the right side here
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {droppedPills.map(pill => (
                  <div key={pill.id} className="relative group">
                    <Badge className="bg-green-500 hover:bg-green-600 cursor-pointer">
                      {pill.text}
                    </Badge>
                    <button
                      onClick={() => removeFromDropped(pill.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Multiple Module Categories */}
        <div className="w-80">
          <h2 className="text-xl font-semibold mb-4">Module Categories</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {moduleCategories.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">{category.name}</h3>
                <div className="space-y-2">
                  {category.pills.map(pill => (
                    <div
                      key={pill.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, pill, category.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <Badge className="w-full text-center py-2 bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                        {pill.text}
                      </Badge>
                    </div>
                  ))}
                  {category.pills.length === 0 && (
                    <div className="text-gray-400 text-sm italic text-center py-2">
                      No modules available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mappable;