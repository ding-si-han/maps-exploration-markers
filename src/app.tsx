import * as React from 'react';
import {useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import Pin from './pin';

import MARKERS from './data/tourist-attraction.json';

// const TOKEN =
//   'pk.eyJ1Ijoic2loYW5kZXYiLCJhIjoiY2x5aTRiNGkzMGM0ajJrcXlyaWlnN2VqdCJ9.d2DDtEvLl07jqK7XmGVccA'; // Set your mapbox token here

const TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function App() {
  const [popupInfo, setPopupInfo] = useState(null);
  console.log('====== MARKERS', MARKERS);

  const pins = useMemo(
    () =>
      MARKERS.features.map((marker, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={marker.geometry.coordinates[0]}
          latitude={marker.geometry.coordinates[1]}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(marker);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <>
      <Map
        initialViewState={{
          latitude: 1.29027,
          longitude: 103.851959,
          zoom: 11
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.geometry.coordinates[0])}
            latitude={Number(popupInfo.geometry.coordinates[1])}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <br />
              Test
              {/* <ReactMarkdown
                children={popupInfo.properties.Description}
                rehypePlugins={[rehypeRaw]}
              /> */}
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
