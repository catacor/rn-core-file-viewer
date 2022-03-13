const CHANGE_FILE_DISPLAY_SIZES = 'CHANGE_FILE_DISPLAY_SIZES'
const CHANGE_CONTAINER_SIZES = 'CHANGE_CONTAINER_SIZES'
const CHANGE_GRID_LEVEL = 'CHANGE_GRID_LEVEL'
const CHANGE_ROTATION_VALUE = 'CHANGE_ROTATION_VALUE'

export const initialState = {
  containerWidth: 100,
  containerHeight: 100,
  imageWidth: 100,
  imageHeight: 100,
  gridLevel: 2,
  rotationRadian: 0,
  rotationLineMargin: 9,
  rotationLineWidth: 2,
}

export const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_FILE_DISPLAY_SIZES: {
      return {
        ...state,
        imageWidth: action.payload.width,
        imageHeight: action.payload.height,
      }
    }
    case CHANGE_CONTAINER_SIZES: {
      return {
        ...state,
        containerWidth: action.payload.width,
        containerHeight: action.payload.height,
      }
    }
    case CHANGE_GRID_LEVEL: {
      return {
        ...state,
        gridLevel: action.payload,
      }
    }
    case CHANGE_ROTATION_VALUE: {
      return {
        ...state,
        rotationRadian: action.payload,
      }
    }
  }
}

const changeImageDimensions = (w, h) => ({
  type: CHANGE_FILE_DISPLAY_SIZES,
  payload: {
    width: w,
    height: h,
  },
})

const changeContainerDimensions = (w, h) => ({
  type: CHANGE_CONTAINER_SIZES,
  payload: {
    width: w,
    height: h,
  },
})

const changeGridLevel = (i) => ({
  type: CHANGE_GRID_LEVEL,
  payload: i,
})

const changeRotationValue = (value) => ({
  type: CHANGE_ROTATION_VALUE,
  payload: value,
})

export const functions = {
  changeImageDimensions: changeImageDimensions,
  changeContainerDimensions: changeContainerDimensions,
  changeGridLevel: changeGridLevel,
  changeRotationValue: changeRotationValue,
}
