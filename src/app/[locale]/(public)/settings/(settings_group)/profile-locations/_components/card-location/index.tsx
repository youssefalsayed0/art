"use client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useState } from "react";
import DailogAddLocation from "../dailog-add-location";
import { DeleteLocationDailog } from "../dailog-delete-location";
import DailogUpdateLocation from "../dailog-update-location";

interface Location {
  id: number;
  title: string;
  address: string;
  street: string;
  house_number: string;
  lat: string;
  lng: string;
  city: string;
  city_id: number;
  area: string;
  area_id: number;
  is_default: number;
}

interface CardLocationProps {
  locations: Location[];
}

export const CardLocation = ({ locations }: CardLocationProps) => {
  const [locationsList, setLocationsList] = useState<Location[]>(locations);
  // const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
  //   null
  // );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  void isLoaded


  // if (!isLoaded) return <p>Loading Google Maps...</p>;

  // const updateLocationInList = (updatedLocation: Location) => {
  //   setLocationsList((prevLocations) =>
  //     prevLocations.map((location) =>
  //       location.id === updatedLocation.id ? updatedLocation : location
  //     )
  //   );
  // };

  return (
    <>
      <div className="row">
        {locationsList.map((location) => (
          <div key={location.id} className="md:w-4/12 w-full my-5 md:my-2">
            <div className="px-4">
              <div className="p-[12px] rounded-sm border border-text-borders">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "210px" }}
                  center={{
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lng),
                  }}
                  zoom={9}
                  // onClick={(e) => handleMapClick(e, location.id)}
                >
                  <Marker
                    key={`${location.id}-${location.lat}-${location.lng}`} // إجبار الماركر على إعادة الرسم
                    position={{
                      lat: parseFloat(location.lat),
                      lng: parseFloat(location.lng),
                    }}
                    // onClick={() => setSelectedLocationId(location.id)}
                  />
                </GoogleMap>

                <div className="flex flex-col gap-y-[16px] pt-[16px]">
                  <div className="flex items-center gap-x-[8px]">
                    <img src="/assets/icons/location2.svg" alt="icon" />
                    <span className="text-[1rem] text-text-main font-normal">
                      {location.address}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[1.1rem] text-text-main font-bold">
                      {location.area} - {location.city}
                    </h3>
                  </div>
                  <div>
                    <p className="text-[1rem] text-text-sub font-normal">
                      {location.house_number}, {location.street}
                    </p>
                  </div>
                  <div className="flex items-center gap-x-[16px]">
                    <DailogUpdateLocation
                      selectedLocationId={location.id}
                      locations={locationsList}
                      // onUpdateLocation={updateLocationInList}
                    />
                    <DeleteLocationDailog
                      locationId={location.id}
                      onDelete={() =>
                        setLocationsList((prev) =>
                          prev.filter((loc) => loc.id !== location.id)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DailogAddLocation />
    </>
  );
};
