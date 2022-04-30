import {
  PinchGestureHandler,
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  PanGestureHandler,
} from 'react-native-gesture-handler'
import React, { useEffect, useReducer, useState } from 'react'
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
import { useSharedValue } from 'react-native-reanimated'
import { Pdf } from 'react-native-pdf-light'

export const CorePdfViewer = (props) => {
  const scale = React.useRef(new Animated.Value(1)).current
  const oldScale = useSharedValue(1)
  const translateX = React.useRef(new Animated.Value(0)).current
  const oldTranslateX = useSharedValue(0)
  const translateY = React.useRef(new Animated.Value(0)).current
  const oldTranslateY = useSharedValue(0)

  const onPanGestureEvent = (event) => {
    if (
      Math.abs(oldTranslateX.value + event.nativeEvent.translationX) >
      Math.floor((Math.max(0, scale._value) - 1) * widht) / (2 * scale._value)
    ) {
      if (oldTranslateX.value + event.nativeEvent.translationX < 0) {
        translateX.setValue(
          -Math.floor((Math.max(0, scale._value) - 1) * widht) /
            (2 * scale._value)
        )
      } else {
        translateX.setValue(
          Math.floor((Math.max(0, scale._value) - 1) * widht) /
            (2 * scale._value)
        )
      }
    } else {
      translateX.setValue(oldTranslateX.value + event.nativeEvent.translationX)
    }

    if (
      Math.abs(oldTranslateY.value + event.nativeEvent.translationY) >
      Math.floor((Math.max(0, scale._value) - 1) * height) / (2 * scale._value)
    ) {
      if (oldTranslateY.value + event.nativeEvent.translationY < 0) {
        translateY.setValue(
          -Math.floor((Math.max(0, scale._value) - 1) * height) /
            (2 * scale._value)
        )
      } else {
        translateY.setValue(
          Math.floor((Math.max(0, scale._value) - 1) * height) /
            (2 * scale._value)
        )
      }
    } else {
      translateY.setValue(oldTranslateY.value + event.nativeEvent.translationY)
    }
  }

  const onPanGesstureHandlerChange = (event) => {
    if (event.nativeEvent.oldState === 0) {
      //new zoom event
    } else {
      ///zoom event ended
      if (
        Math.abs(oldTranslateX.value + event.nativeEvent.translationX) >
        Math.floor((Math.max(0, scale._value) - 1) * widht) / (2 * scale._value)
      ) {
        if (oldTranslateX.value + event.nativeEvent.translationX < 0) {
          oldTranslateX.value =
            -Math.floor((Math.max(0, scale._value) - 1) * widht) /
            (2 * scale._value)
        } else {
          oldTranslateX.value =
            Math.floor((Math.max(0, scale._value) - 1) * widht) /
            (2 * scale._value)
        }
      } else {
        oldTranslateX.value =
          oldTranslateX.value + event.nativeEvent.translationX
      }

      if (
        Math.abs(oldTranslateY.value + event.nativeEvent.translationY) >
        Math.floor((Math.max(0, scale._value) - 1) * height) /
          (2 * scale._value)
      ) {
        if (oldTranslateY.value + event.nativeEvent.translationY < 0) {
          oldTranslateY.value =
            -Math.floor((Math.max(0, scale._value) - 1) * height) /
            (2 * scale._value)
        } else {
          oldTranslateY.value =
            Math.floor((Math.max(0, scale._value) - 1) * height) /
            (2 * scale._value)
        }
      } else {
        oldTranslateY.value =
          oldTranslateY.value + event.nativeEvent.translationY
      }
    }
  }

  const pinchHaldlerEvent = (event) => {
    if (oldScale.value * event.nativeEvent.scale < 1) {
      scale.setValue(1)
    } else scale.setValue(oldScale.value * event.nativeEvent.scale)

    console.log(`${Math.floor((scale._value - 1) * height)}`)
  }

  const onPinchHandlerChange = (event) => {
    if (event.nativeEvent.oldState === 0) {
      //new zoom event
    } else {
      ///zoom event ended
      if (oldScale.value * event.nativeEvent.scale < 1) {
        oldScale.value = 1
      } else oldScale.value = oldScale.value * event.nativeEvent.scale
    }
  }

  const [widht, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const onContainerLayoutFinished = (event) => {
    setWidth(event.nativeEvent.layout.width)
    setHeight(event.nativeEvent.layout.height)
  }
  return (
    <View style={[styles.rootContainer]}>
      <PanGestureHandler
        style={{ widht: '100%', height: '100%' }}
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanGesstureHandlerChange}
      >
        <Animated.View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: [],
          }}
        >
          <PinchGestureHandler
            onGestureEvent={pinchHaldlerEvent}
            onHandlerStateChange={onPinchHandlerChange}
          >
            <Animated.View
              onLayout={onContainerLayoutFinished}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                transform: [
                  {
                    scale: scale,
                  },
                  {
                    translateX: translateX,
                  },
                  {
                    translateY: translateY,
                  },
                ],
              }}
            >
              <Pdf source={props.pathToFile} resizeMode={'contain'} />
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    overflow: 'hidden',
  },
})
