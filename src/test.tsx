 const hpr = new Cesium.HeadingPitchRoll(0.0, Cesium.Math.PI, 0.0);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        Cesium.Cartesian3.fromDegrees(
          position.value.longitude,
          position.value.latitude,
          altitudee.value
        ),
        hpr
      );

      viewer.entities.add({
        id: "iss",
        position: Cesium.Cartesian3.fromDegrees(
          position.value.longitude,
          position.value.latitude,
          altitudee.value
        ),
        model: {
          uri: Iss,
          minimumPixelSize: 128,
          maximumScale: 20000,
          // scale: 3.0,
        },
        orientation: new Cesium.ConstantProperty(orientation),
      });
      viewer.trackedEntity = viewer.entities.getById("iss");
      const camera = viewer.camera;
      
      const entity = viewer.entities.getById("iss");
      // entity.show = false;

      viewer.scene.preRender.addEventListener(function () {
        // camera.position = entity?.position?.getValue(Cesium.JulianDate.now());
      });
