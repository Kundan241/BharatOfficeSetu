import React from "react";
import { MapPin, Building2, Users } from "lucide-react";

export default function InteractiveIndiaMap() {
  return (
    <div className="w-full max-w-lg mx-auto bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
      <div className="mb-8 text-center">
        <h3 className="font-serif text-2xl text-forest font-bold">Nationwide Presence</h3>
        <p className="text-forest/70 text-sm mt-2">Premium workspaces across key business hubs</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/80 p-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all border border-forest-cream">
          <div className="bg-forest-mint p-3 rounded-full mr-4">
            <MapPin className="text-forest h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-forest text-lg">15+ Cities</h4>
            <p className="text-forest/70 text-sm">Strategic business locations</p>
          </div>
        </div>
        <div className="bg-white/80 p-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all border border-forest-cream">
          <div className="bg-forest-sage p-3 rounded-full mr-4">
            <Building2 className="text-forest h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-forest text-lg">50+ Centers</h4>
            <p className="text-forest/70 text-sm">State-of-the-art facilities</p>
          </div>
        </div>
        <div className="bg-white/80 p-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all border border-forest-cream">
          <div className="bg-forest-cream p-3 rounded-full mr-4">
            <Users className="text-forest h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-forest text-lg">10,000+ Members</h4>
            <p className="text-forest/70 text-sm">Thriving professional community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
