import { useReducer } from 'react'
import { THREE } from 'expo-three'
global.THREE = THREE

const ZOOM_MIN = 1
const ZOOM_MAX = 20

const cameraReducer = (state, action) => {
  switch (action.type) {
    case 'set_distance_target':
      if (!state.camera || !state.mesh) return state

      let cameraPosition = state.camera.position
      let cameraVector = new THREE.Vector3(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      )

      let meshPosition = state.mesh.position
      let meshVector = new THREE.Vector3(
        meshPosition.x,
        meshPosition.y,
        meshPosition.z
      )

      let currentDistance = cameraVector.distanceTo(meshVector)

      let desiredDistance = currentDistance - action.payload
      desiredDistance = desiredDistance > ZOOM_MAX ? ZOOM_MAX : desiredDistance
      desiredDistance = desiredDistance < ZOOM_MIN ? ZOOM_MIN : desiredDistance
      var targetDist = new THREE.Vector3()
        .copy(meshVector)
        .setLength(desiredDistance)
      var destination = new THREE.Vector3().addVectors(meshVector, targetDist)

      let camera = state.camera
      camera.position.x = destination.x
      camera.position.y = destination.y
      camera.position.z = destination.z
      camera.lookAt(meshPosition)

      return { ...state, camera }
    case 'set_camera_mesh':
      return {
        ...state,
        camera: action.payload.camera,
        mesh: action.payload.mesh,
      }
    default:
      return state
  }
}

export default () => {
  const [state, dispatch] = useReducer(cameraReducer, {
    camera: null,
    mesh: null,
  })

  const zoom = (delta) => {
    dispatch({ type: 'set_distance_target', payload: delta })
  }

  const setCameraMesh = (camera, mesh) => {
    dispatch({ type: 'set_camera_mesh', payload: { camera, mesh } })
  }

  return {
    camera: state.camera,
    zoom,
    setCameraMesh,
  }
}
