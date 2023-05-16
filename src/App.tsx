import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";

import { styled } from "styled-components";
import { SampledPositionProperty } from "cesium";

import Iss from "./assets/ISS_stationary.glb";
import Cupola from "./assets/ISS_cupola.glb";

import axios from "axios";
import AstronautLottie from "./Component/AstronautLottie";

function App() {
  const [isLoading, setIsloading] = useState(true);
  const [interpolatedData, setInterpolatedData] = useState(new Array(120));

  const [isInCupola, setIsinCupola] = useState(false);

  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewer = useRef<Cesium.Viewer | null>(null);
  const positionProperty = useRef<SampledPositionProperty>(
    new Cesium.SampledPositionProperty()
  );

  useEffect(() => {
    // Cesium 초기화
    if (cesiumContainer.current) {
      viewer.current = new Cesium.Viewer(cesiumContainer.current, {
        shouldAnimate: true,
        // 필요없는 툴 들 다 false처리
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        timeline: false,
        infoBox: false,
        animation: false,
        geocoder: false,
        vrButton: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        selectionIndicator: false,
        shadows: true,
      });
    }
    if (!viewer.current) {
      return;
    }
    viewer.current.scene.highDynamicRange = true;
    // Clock 설정

    viewer.current.clock.startTime = Cesium.JulianDate.addSeconds(
      Cesium.JulianDate.now(),
      -3,
      new Cesium.JulianDate()
    );
    viewer.current.clock.currentTime = Cesium.JulianDate.addSeconds(
      Cesium.JulianDate.now(),
      -3,
      new Cesium.JulianDate()
    );
    viewer.current.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    viewer.current.clock.multiplier = 1.0; // 기본 속도
    //초기 렌더시
    axios
      .get("https://api.wheretheiss.at/v1/satellites/25544")
      .then(({ data }) => {
        const { longitude, latitude, altitude } = data;

        positionProperty.current.addSample(
          Cesium.JulianDate.now(),
          Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude * 1000)
        );

        if (
          !viewer.current?.entities.getById("iss") &&
          !viewer.current?.entities.getById("cupola") &&
          viewer.current?.entities
        ) {
          viewer.current.entities.add({
            id: "iss",
            model: {
              uri: Iss,
              minimumPixelSize: 128,
              maximumScale: 20000,
            },
            position: positionProperty.current,
          });

          viewer.current.entities.add({
            id: "cupola",
            model: {
              uri: Cupola,
              minimumPixelSize: 128,
              maximumScale: 20000,
              show: false,
            },
            position: positionProperty.current,
          });

          const entity = viewer.current?.entities.getById("iss");
          viewer.current.trackedEntity = entity;
        }
        setTimeout(() => {
          setIsloading(false);
        }, 3500);
      });

    // 인터벌 설치
    const interval = setInterval(() => {
      axios
        .get("https://api.wheretheiss.at/v1/satellites/25544")
        .then(({ data }) => {
          const { longitude, latitude, altitude } = data;

          positionProperty.current.addSample(
            Cesium.JulianDate.addSeconds(
              Cesium.JulianDate.now(),
              3.2,
              new Cesium.JulianDate()
            ),
            Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude * 1000)
          );
        });
    }, 3000);
    // 리턴시 인터벌제거
    return () => {
      if (viewer.current) {
        clearInterval(interval);
        viewer.current.destroy();
      }
    };
  }, []);

  // async function processArray() {
  //   if (interpolatedData[0] === undefined) {
  //     return;
  //   }
  //   const cupola = viewer!.current!.entities.getById("cupola");

  //   for (const e of interpolatedData) {
  //     await new Promise((resolve) => {
  //       setTimeout(() => {
  //         const position = Cesium.Cartesian3.fromDegrees(
  //           e.longitude,
  //           e.latitude,
  //           e.altitude
  //         );
  //         cupola!.position = position;
  //         viewer.current!.camera.position = position;
  //         resolve(null);
  //       }, 2000 / 120);
  //     });
  //   }
  // }

  // useEffect(() => {
  //   if (viewer.current) {
  //     if(isInCupola){
  //     processArray()}
  //   }
  // }, [interpolatedData]);

  // useEffect(() => {
  //   let interval: undefined | NodeJS.Timer;
  //   if (isInCupola) {
  //     axios.get("http://jobkaehenry.iptime.org").then(({ data }) => {
  //       setInterpolatedData(data);
  //     });
  //     interval = setInterval(() => {
  //       axios.get("http://jobkaehenry.iptime.org").then(({ data }) => {
  //         console.log(data);
  //         setInterpolatedData(data);
  //       });
  //     }, 2000);
  //   } else {
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // }, [isInCupola]);

  return (
    <>
      {isLoading && (
        <SplashImg>
          <AstronautLottie />
          <span>ISS 를 불러오는 중이에요!</span>
        </SplashImg>
      )}
      {/* <button
        onClick={() => {
          const cupola = viewer!.current!.entities.getById("cupola");
          const ISS = viewer!.current!.entities.getById("iss");
          if (isInCupola) {
            viewer.current!.trackedEntity = ISS;
            ISS!.show = false;
            cupola!.show = true;

          } else if (!isInCupola) {
            viewer.current!.trackedEntity = undefined;
            ISS!.show = true;
            cupola!.show = false;
          }
          setIsinCupola((prev) => !prev);
        }}
      >
        탑승
      </button> */}
      <CesiumRef id="main" ref={cesiumContainer}></CesiumRef>
    </>
  );
}

export default App;

const CesiumRef = styled.div`
  width: 100vw;
  height: 100vh;
`;

const SplashImg = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #000;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > span {
    color: #fff;
  }
`;
