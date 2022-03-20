import {
  PinchGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import React, { useEffect, useReducer } from 'react'
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from 'react-native'
//local imports
import { initialState, reducer, functions } from '../reducers/CoreImageReducer'

const cmmdc = (a, b) => {
  while (a != b) {
    if (a > b) {
      a = a - b
    } else {
      b = b - a
    }
  }

  return a
}

const computeAspectRatio = (width, height) => {
  let div = cmmdc(width, height)
  return { w: width / div, h: height / div }
}
const computeNormalizedSizes = (screenW, screenH, imageW, imageH) => {
  let normalizedH = 100
  let normalizedW = 100
  if (imageW > imageH) {
    if (imageW > screenW) {
      normalizedW = screenW
      const { w, h } = computeAspectRatio(imageW, imageH)
      normalizedH = (h * normalizedW) / w
    } else {
      normalizedW = imageW
      const { w, h } = computeAspectRatio(imageW, imageH)
      normalizedH = (h * normalizedW) / w
    }
  } else {
    if (imageH > screenH) {
      normalizedH = screenH
      const { w, h } = computeAspectRatio(imageH, imageH)
      normalizedW = (w * normalizedH) / h
    } else {
      normalizedH = imageH
      const { w, h } = computeAspectRatio(imageW, imageH)
      normalizedW = (w * normalizedH) / h
    }
  }

  return { normalizedW, normalizedH }
}

export const CoreImageViewer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onContainerLayoutFinished = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout
    dispatch(functions.changeContainerDimensions(width, height))
  }

  const generateGridLayout = () => {
    let cellHeight = state.containerHeight / (state.gridLevel + 1)
    let cellWidth = state.containerWidth / (state.gridLevel + 1)
    let total = []
    for (let i = 0; i < state.gridLevel + 1; i++) {
      for (let j = 0; j < state.gridLevel + 1; j++) {
        total.push(
          <View
            style={{
              width: cellWidth,
              height: cellHeight,
              borderColor: '#9999',
              borderWidth: 1,
            }}
          ></View>
        )
      }
    }

    return total
  }

  const generateGridControls = () => {
    let controls = []
    for (let i = 0; i < 5; i++) {
      controls.push(
        <TouchableWithoutFeedback
          onPress={() => {
            dispatch(functions.changeGridLevel(i))
          }}
        >
          <View
            style={{
              ...styles.gridLevel,
              borderColor: state.gridLevel === i ? 'blue' : 'transparent',
            }}
          >
            <Text>{i}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return controls
  }

  const generateRotationLines = () => {
    let lines = []
    lines.push(
      <View
        style={{
          margin: 0,
          width: state.containerWidth / 2 - state.rotationLineMargin,
        }}
      />
    )
    for (let i = 0; i <= 360; i++) {
      if (i % 5 == 0)
        lines.push(
          <View
            style={{
              height: i % 10 === 0 ? '100%' : '75%',
              backgroundColor: i % 10 === 0 ? '#fff' : '#fff9',
              marginHorizontal: state.rotationLineMargin,
              width: state.rotationLineWidth,
            }}
          />
        )
    }
    lines.push(
      <View
        style={{
          margin: 0,
          width: state.containerWidth / 2 - state.rotationLineMargin,
        }}
      />
    )
    return lines
  }

  const onScrollHandler = (event) => {
    //console.log(event.nativeEvent.contentOffset.x)

    //from object margin calculate as follow
    //2 objects from same widht
    //5 margins
    //  m O m m O m m LINE m O m m O m
    let margins = state.rotationLineMargin - 2 * state.rotationLineWidth
    let margin = margins / 5
    let objTotalW = 2 * margin + state.rotationLineWidth
    //console.log(event.nativeEvent.contentOffset.x / objTotalW)

    let currentGradiant = Math.floor(
      event.nativeEvent.contentOffset.x / objTotalW
    )
    if (currentGradiant < 0) currentGradiant = 0
    if (currentGradiant > 360) currentGradiant = 360
    dispatch(functions.changeRotationValue(currentGradiant))
  }

  const scale = React.useRef(new Animated.Value(1)).current

  const pinchHaldlerEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true }
  )

  useEffect(() => {
    if (props.pathToFile) {
      try {
        Image.getSize(props.pathToFile, (width, height) => {
          const screenW = Dimensions.get('window').width
          const screenH = Dimensions.get('window').height

          const { normalizedW, normalizedH } = computeNormalizedSizes(
            screenW,
            screenH,
            width,
            height
          )

          dispatch(functions.changeImageDimensions(normalizedW, normalizedH))
        })
      } catch {
        //error on obtaining file info
      }
    }
  }, [props.pathToFile])

  return (
    <View style={styles.rootContainer}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PinchGestureHandler onGestureEvent={pinchHaldlerEvent}>
          <Animated.View
            style={[styles.container]}
            onLayout={(event) => {
              onContainerLayoutFinished(event)
            }}
          >
            <Animated.Image
              source={{
                uri: props.pathToFile,
              }}
              style={{
                width: state.imageWidth,
                height: state.imageHeight,
                transform: [
                  {
                    rotate: `${state.rotationRadian}deg`,
                  },
                  {
                    scale: scale,
                  },
                ],
              }}
            />
            {true && (
              <View
                style={{
                  ...styles.overlay,
                }}
              >
                {generateGridLayout()}
              </View>
            )}
          </Animated.View>
        </PinchGestureHandler>
      </GestureHandlerRootView>
      <View style={styles.controlsContainer}>
        {false && (
          <View style={styles.gridControls}>
            <Text>Grid level:</Text>
            {generateGridControls()}
          </View>
        )}
        <View style={styles.rotationControls}>
          <View style={styles.rotationTitle}>
            <Text style={styles.rotationValue}>{state.rotationRadian} °</Text>
          </View>
          <ScrollView
            horizontal={true}
            onScroll={onScrollHandler}
            scrollEventThrottle={16}
            disableIntervalMomentum={true}
            decelerationRate={1}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            snapToAlignment='start'
          >
            <View style={styles.rotationScroll}>{generateRotationLines()}</View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  controlsContainer: {
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#151515',
  },
  gridControls: {
    height: 25,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotationControls: {
    height: 100,
    width: '100%',
    overflow: 'hidden',
  },
  rotationTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
  },
  rotationValue: {
    color: '#fff',
    fontSize: 16,
  },
  gridLevel: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotationScroll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
})
