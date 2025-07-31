'use client';

import {
  Autocomplete,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Skeleton } from "../ui/skeleton";
import useWindowWidth from "@/utils/hooks/useWindowWidth";
import React, { useRef, useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

export interface Position {
  lat: number;
  lng: number;
}

export interface GoogleMapProps {
  onMarkerPositionChange?: (position: Position) => void;
  defaultMarkerPosition?: Position ;
  className?: string;
  height?: number;
  locations?: Position[];
  zoom?: number;
  mapContainerStyle?: React.CSSProperties;
}

const AppMap: React.FC<GoogleMapProps> = ({
  defaultMarkerPosition,
  onMarkerPositionChange,
  className,
  locations = [],
  zoom = 14,
  mapContainerStyle,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    libraries: ["places"],
  });
  
  const [markerPosition, setMarkerPosition] = useState<Position | null>(
    defaultMarkerPosition || { lat: 30.9585477, lng: 31.1613696 }
  );
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowWidth = useWindowWidth();
  
  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: "500px",
    ...mapContainerStyle,
  };

  useEffect(() => {
    if (markerPosition && onMarkerPositionChange) {
      onMarkerPositionChange(markerPosition);
    }
  }, [markerPosition, onMarkerPositionChange]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const newPosition: Position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newPosition);
      }
    }
  };

  if (!isLoaded) {
    return <Skeleton className="h-full" />;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      {/* Search Input */}
      <div className="relative z-10 w-3/4 md:w-1/2 lg:w-[35%] bg-white mb-4">
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceSelect}
        > 
          <>
            <IoIosSearch className="text-primary size-5 bg-transparent absolute start-3 top-1/2 -translate-y-1/2"/>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter location"
              className="w-full p-2 ps-10 focus:outline-none border border-solid rounded-[4px_20px_20px_4px] border-[#ececec]"
            />
          </>
        </Autocomplete>
      </div>
      
      <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden">
        <GoogleMap
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true
          }}
          mapContainerStyle={containerStyle}
          zoom={zoom}
          center={markerPosition || { lat: 30.9585477, lng: 31.1613696 }}
          onClick={(e) => {
            if (e.latLng) {
              const newPosition: Position = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              };
              setMarkerPosition(newPosition);
            }
          }}
        >
          {markerPosition && (
            <Marker position={markerPosition} />
          )}
          {locations.map((location, index) => (
            <Marker key={`marker_${index}`} position={location} />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default AppMap;