// src/components/MapViewer.jsx

import React, { useEffect, useRef } from 'react';
import {
  Ion,
  Viewer,
  createWorldTerrain,
  Cartesian3,
  Math as CesiumMath
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = '/Cesium/';

const MapViewer = () => {
  const cesiumContainer = useRef(null);

  useEffect(() => {
    if (cesiumContainer.current) {
      Ion.defaultAccessToken = 'YOUR_CESIUM_ION_ACCESS_TOKEN'; // ◀◀◀ 여기에 본인 토큰 입력!!!

      const viewer = new Viewer(cesiumContainer.current, {
        terrainProvider: createWorldTerrain(),
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
      });

      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(127.5, 36.5, 500000),
        orientation: {
          heading: CesiumMath.toRadians(0.0),
          pitch: CesiumMath.toRadians(-90.0),
          roll: 0.0
        },
        duration: 3
      });
    }
  }, []);

  return (
    <div
      ref={cesiumContainer}
      style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}
    />
  );
};

export default MapViewer;