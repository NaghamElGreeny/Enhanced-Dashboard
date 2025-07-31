

import {
  GoogleMap as GoolgeMapComponent,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import React, { useRef, useState } from "react";

import { useTranslation } from "react-i18next";
// import { Input } from "@/components/UiComponents/ui/input";
import { Skeleton } from "@/components/UiComponents/ui/skeleton";
const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "250px",
};

interface Position {
  lng: number;
  lat: number;
}

interface GoogleMapProps {
  onMarkerPositionChange: (position: Position) => void;
  defaultMarkerPostion?: Position | null;
  className?: any;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  onMarkerPositionChange,
  defaultMarkerPostion,
  className,
}) => {
  const t = useTranslation();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    libraries: ["places"],
  });

  // const [map, setMap] = useState(/** @type google.maps.Map */ null);
  const [markerPosition, setMarkerPosition] = useState(defaultMarkerPostion);
  const searchInputRef = useRef<HTMLElement | null>(null);
  const getPlaceCoordinates = () => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: (searchInputRef.current as HTMLInputElement)?.value },
      function (results, status) {
        if (status === "OK" && results) {
          const location = results[0].geometry.location;
          const newPosition = {
            lat: location.lat(),
            lng: location.lng(),
          };
          setMarkerPosition(newPosition);
          onMarkerPositionChange(newPosition);
        } else {
          // alert('Geocode was not successful for the following reason: ' + status);
        }
      }
    );
  };

  if (!isLoaded) {
    return <Skeleton className="h-full"></Skeleton>;
  }

  return (
    <div className={`w-full h-full  ${className}`}>
      <div className="relative w-full h-full min-h-[250px]">
        <div className="absolute top-12 xs:top-0 right-0 z-[2] rounded-xl m-3 flex gap-4 items-center">
          <Autocomplete
            onPlaceChanged={getPlaceCoordinates}
            className=" w-full "
          >
            {/* <Input
              placeholder={"Search location"}
              className="border bg-white md:min-w-[300px]"
              ref={searchInputRef}
            /> */}<>jn</>
          </Autocomplete>
        </div>
        <GoolgeMapComponent
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
          }}
          mapContainerStyle={containerStyle}
          zoom={14}
          center={
            markerPosition
              ? { lat: markerPosition.lat, lng: markerPosition.lng }
              : { lat: 30.9585477, lng: 31.1613696 }
          }
          onClick={(e) => {
            const newPosition = {
              lat: e.latLng?.lat() || 0,
              lng: e.latLng?.lng() || 0,
            };
            setMarkerPosition(newPosition);
            onMarkerPositionChange(newPosition);
          }}
          onLoad={(map) => {}}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <Marker
            
            draggable
            onDragEnd={(e) => {
              const newPosition = {
                lat: e.latLng?.lat() || 0,
                lng: e.latLng?.lng() || 0,
              };
              setMarkerPosition(newPosition);
              onMarkerPositionChange(newPosition);
            }}
            position={markerPosition || { lat: 0, lng: 0 }}
          />
        </GoolgeMapComponent>
      </div>
    </div>
  );
};

export default GoogleMap;
