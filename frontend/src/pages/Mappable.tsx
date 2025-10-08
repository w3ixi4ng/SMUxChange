import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Pill } from "@/types/Pill";

interface ModuleCategory {
  id: string;
  name: string;
  pills: Pill[];
}

function Mappable() {
  // Multiple stacks/containers on the right side
  const [moduleCategories, setModuleCategories] = useState<ModuleCategory[]>([
    {
      id: "business",
      name: "SMU Business Electives",
      pills: [
        { id: 1, text: "Marketing Strategy", width: 120 },
        { id: 2, text: "Financial Management", width: 130 },
        { id: 3, text: "Operations Management", width: 140 },
        { id: 4, text: "Business Analytics", width: 120 },
        { id: 5, text: "Strategic Planning", width: 120 },
      ]
    },
    {
      id: "free",
      name: "Free Electives",
      pills: [
        { id: 6, text: "Psychology", width: 100 },
        { id: 7, text: "Art History", width: 90 },
        { id: 8, text: "Creative Writing", width: 110 },
        { id: 9, text: "Photography", width: 100 },
        { id: 10, text: "Music Theory", width: 100 },
      ]
    },
    {
      id: "tech",
      name: "Technology Electives",
      pills: [
        { id: 11, text: "Web Development", width: 120 },
        { id: 12, text: "Data Science", width: 100 },
        { id: 13, text: "AI & Machine Learning", width: 140 },
        { id: 14, text: "Cybersecurity", width: 110 },
      ]
    }
  ]);

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