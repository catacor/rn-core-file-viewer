import React, { useEffect, useState } from 'react'
import { Text, View, Animated, Vector, Alert } from 'react-native'
import Expo from 'expo'
import {
  AmbientLight,
  Fog,
  GridHelper,
  PerspectiveCamera,
  PointLight,
  Scene,
} from 'three'
import ExpoTHREE, { Renderer, THREE } from 'expo-three'
import { GLView } from 'expo-gl'
import {
  GestureDetector,
  Gesture,
  PinchGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import RNFetchBlob from 'rn-fetch-blob'
import * as Base64 from 'base64-arraybuffer'

export const Core3dObjectViewer = (props) => {
  useEffect(() => {
    console.log(props.fileExt)
    console.log(props.pathToFile)
  }, [])

  const scale = useSharedValue(1)
  const oldScale = useSharedValue(1)
  const pinchHandler = (event) => {
    scale.value = oldScale.value * event.nativeEvent.scale
  }
  const onPinchHandlerChange = (event) => {
    if (event.nativeEvent.oldState === 0) {
      //new zoom event
    } else {
      ///zoom event ended
      oldScale.value = oldScale.value * event.nativeEvent.scale
    }
  }

  const isPressed = useSharedValue(false)
  const offset = useSharedValue({ x: 0, y: 0 })
  const radianAngle = useSharedValue(0)
  const radianAngleRo = useSharedValue(0)
  const shphereRadius = useSharedValue(10)
  const start = useSharedValue({ x: 0, y: 0 })

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      }

      const radius = 10
      //length is offset / total length
      let length = ((offset.value.x / 100) % (2 * Math.PI * radius)) / 10
      let lengthRo = ((offset.value.y / 100) % (2 * Math.PI * radius)) / 10

      //arc length = angle (in radian) * (pi/180) * radius

      let angle = (length * 180) / (radius * Math.PI)
      let angleRo = (lengthRo * 180) / (radius * Math.PI)

      radianAngle.value = angle
      radianAngleRo.value = angleRo
      /*
      let newRadius = shphereRadius.value / scale.value
      let x =
        newRadius * Math.cos(radianAngle.value) * Math.sin(radianAngleRo.value)
      let y =
        newRadius * Math.sin(radianAngle.value) * Math.sin(radianAngleRo.value)
      let z = newRadius * Math.cos(radianAngleRo.value)
      console.log(`x:${x}, y"${y}, z:${z}`)*/
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })
    .onFinalize(() => {
      isPressed.value = false
    })

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl
    const sceneColor = 0xf0f0f0

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl })
    renderer.setSize(width, height)
    renderer.setClearColor(sceneColor)

    const camera = new PerspectiveCamera(75, 1, 0.1, 1000)

    camera.position.set(new THREE.Vector3(5, 5, 5))

    const scene = new Scene()
    scene.fog = new Fog(sceneColor, 1, 10000)
    //scene.add(new GridHelper(10, 10))

    const ambientLight = new AmbientLight(0x101010)
    scene.add(ambientLight)

    const pointLight = new PointLight(0xffffff, 2, 1000, 1)
    pointLight.position.set(0, 100, 100)
    scene.add(pointLight)

    const backPointLight = new PointLight(0xffffff, 2, 1000, 1)
    backPointLight.position.set(0, -100, -100)
    scene.add(backPointLight)

    var renderObject = null
    try {
      const data = await RNFetchBlob.fs.readFile(
        props.pathToFile.replace('file://', '').replace('file:/', ''),
        'base64'
      )
      const buffer = Base64.decode(data)
      switch (props.fileExt) {
        case 'obj':
          {
            const material = new THREE.MeshPhysicalMaterial({
              color: 0xdbdad9,
              metalness: 0.25,
              roughness: 0.1,
              opacity: 1.0,
              transparent: true,
              transmission: 0.99,
              clearcoat: 1.0,
              clearcoatRoughness: 0.25,
            })
            const loader = new OBJLoader()
            const geometry = loader.parse(buffer)
            geometry.center()

            renderObject = new THREE.Mesh(geometry, material)
            ExpoTHREE.utils.scaleLongestSideToSize(renderObject, 4)

            scene.add(renderObject)
          }
          break
        case 'stl':
          {
            const material = new THREE.MeshPhysicalMaterial({
              color: 0xdbdad9,
              metalness: 0.25,
              roughness: 0.1,
              opacity: 1.0,
              transparent: true,
              transmission: 0.99,
              clearcoat: 1.0,
              clearcoatRoughness: 0.25,
            })
            const loader = new STLLoader()
            const geometry = loader.parse(buffer)
            geometry.center()

            renderObject = new THREE.Mesh(geometry, material)
            ExpoTHREE.utils.scaleLongestSideToSize(renderObject, 4)

            scene.add(renderObject)
          }
          break
        default: {
          const geometry = new THREE.BoxGeometry(5, 5, 5)
          const material = new THREE.MeshBasicMaterial({
            color: 0xf47626,
          })
          renderObject = new THREE.Mesh(geometry, material)
          renderObject.position.set(0, 0, 0)
          ExpoTHREE.utils.scaleLongestSideToSize(renderObject, 4)

          scene.add(renderObject)
        }
      }
    } catch (err) {
      console.log(err)
    }

    const render = () => {
      let timeout = requestAnimationFrame(render)

      let newRadius = shphereRadius.value / scale.value

      camera.position.x =
        newRadius * Math.cos(radianAngle.value) * Math.sin(radianAngleRo.value)
      camera.position.z =
        newRadius * Math.sin(radianAngle.value) * Math.sin(radianAngleRo.value)
      camera.position.y = newRadius * Math.cos(radianAngleRo.value)

      camera.lookAt(new THREE.Vector3())
      renderer.render(scene, camera)

      gl.endFrameEXP()
    }
    render()
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={gesture}>
          <PinchGestureHandler
            onGestureEvent={pinchHandler}
            onHandlerStateChange={onPinchHandlerChange}
          >
            <Animated.View
              style={{
                flex: 1,
              }}
            >
              <GLView
                style={{
                  flex: 1,
                }}
                onContextCreate={onContextCreate}
              />
            </Animated.View>
          </PinchGestureHandler>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  )
}
