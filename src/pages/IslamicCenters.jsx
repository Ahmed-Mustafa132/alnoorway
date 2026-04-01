import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Phone, Mail, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

export default function IslamicCenters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Could not get location", error)
      );
    }
  }, []);

  const { data: centers, isLoading } = useQuery({
    queryKey: ['islamic_centers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('IslamicCenter').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const centersWithDistance = centers.map(center => {
    if (userLocation && center.latitude && center.longitude) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        center.latitude,
        center.longitude
      );
      return { ...center, distance: distance.toFixed(1) };
    }
    return center;
  });

  const filteredCenters = centersWithDistance.filter(center =>
    center.name?.includes(searchQuery) ||
    center.city?.includes(searchQuery) ||
    center.country?.includes(searchQuery)
  );

  const sortedCenters = [...filteredCenters].sort((a, b) => {
    if (a.distance && b.distance) {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "مراكز الدعوة" }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12 pt-4"
        >
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            مراكز الدعوة
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">
            اعثر على أقرب مركز دعوة في منطقتك
          </p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="relative">
              <Input
                placeholder="ابحث عن مركز حسب الاسم أو المدينة أو الدولة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-base md:text-lg py-5 md:py-6 pr-10 md:pr-12 w-full"
              />
              <Search className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري التحميل...</p>
          </div>
        ) : sortedCenters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {sortedCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 break-words">{center.name}</h3>
                        <p className="text-sm md:text-base text-gray-600">{center.city}, {center.country}</p>
                        {center.distance && (
                          <div className="flex items-center gap-1 mt-2">
                            <Navigation className="w-4 h-4 text-teal-600" />
                            <span className="text-sm font-semibold text-teal-600">
                              {center.distance} كم
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {center.address && (
                      <div className="flex items-start gap-2 mb-2 md:mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-600 text-xs md:text-sm break-words">{center.address}</p>
                      </div>
                    )}

                    {center.phone && (
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a href={`tel:${center.phone}`} className="text-teal-600 hover:text-teal-700 text-xs md:text-sm break-all">
                          {center.phone}
                        </a>
                      </div>
                    )}

                    {center.email && (
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a href={`mailto:${center.email}`} className="text-teal-600 hover:text-teal-700 text-xs md:text-sm break-all">
                          {center.email}
                        </a>
                      </div>
                    )}

                    {center.description && (
                      <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">{center.description}</p>
                    )}

                    {center.services && center.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {center.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 md:px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12 text-center">
              <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                لا توجد مراكز
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {searchQuery ? "لم نجد نتائج لبحثك" : "لا توجد مراكز دعوة متاحة حالياً"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}