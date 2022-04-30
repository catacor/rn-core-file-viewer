import React, { useState, useReducer, useEffect, useRef } from 'react'
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native'
import LottieView from 'lottie-react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { Pdf, PdfUtil } from 'react-native-pdf-light'
//local imports
import { CoreImageViewer } from './CoreImageViewer'
import { Core3dObjectViewer } from './Core3dObjectViewer'
import { CorePdfViewer } from './CorePdfViewer'

const TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY'
const RESET_PROGRESS = 'RESET_PROGRESS'
const FILE_URL_SOURCE_CHANGE = 'FILE_URL_SOURCE_CHANGE'
const FILE_LOCAL_SOURCE_CHANGE = 'FILE_LOCAL_SOURCE_CHANGE'
const DOWNLOAD_PROGGRESS_CHANGED = 'DOWNLOAD_PROGGRESS_CHANGED'
const DOWNLOAD_FINISHED = 'DOWNLOAD_FINISHED'
const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR'
const CHANGE_CACHING_CONF = 'CHANGE_CACHING_CONF'
const FILE_CACHE_STATE = 'FILE_CACHE_STATE'
const FILE_REDY_STATUS = 'FILE_REDY_STATUS'
const FILE_EXT_CHANGE = 'FILE_EXT_CHANGE'
const CHANGE_ACTIVE_FILE_SOURCE = 'CHANGE_ACTIVE_FILE_SOURCE'

export const LOCAL_URI = 'LOCAL_URI'
export const EXTERNAL_URL = 'EXTERNAL_URL'

const initialState = {
  isVisible: false,
  activeFileSource: LOCAL_URI,
  fileURL: '',
  fileLocalUri: '',
  fileExtension: '',
  isFileReady: false,
  filePath: null,
  downloadProgres: 0.0,
  cachingActive: false,
  isFileCached: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_VISIBILITY: {
      return { ...state, isVisible: !state.isVisible }
    }
    case RESET_PROGRESS: {
      return { ...state, downloadProgres: 0.0 }
    }
    case FILE_URL_SOURCE_CHANGE: {
      return { ...state, fileURL: action.payload.url }
    }
    case FILE_LOCAL_SOURCE_CHANGE: {
      return { ...state, fileLocalUri: action.payload.fileLocalUri }
    }
    case FILE_EXT_CHANGE: {
      return { ...state, fileExtension: action.payload.ext }
    }
    case DOWNLOAD_PROGGRESS_CHANGED: {
      return {
        ...state,
        downloadProgres: state.downloadProgres + Number(0.1),
      }
    }
    case DOWNLOAD_FINISHED: {
      return {
        ...state,
        downloadProgres: 1,
        isFileReady: true,
        isFileCached: true,
        filePath: action.path,
      }
    }
    case DOWNLOAD_ERROR: {
      return {
        ...state,
        downloadProgres: 0.0,
        isFileReady: true,
        isFileCached: false,
        filePath: '',
      }
    }
    case CHANGE_CACHING_CONF: {
      return {
        ...state,
        cachingActive: action.payload,
      }
    }
    case FILE_CACHE_STATE: {
      return {
        ...state,
        isFileCached: action.payload,
      }
    }
    case FILE_REDY_STATUS: {
      return {
        ...state,
        isFileReady: action.payload,
      }
    }
    case CHANGE_ACTIVE_FILE_SOURCE: {
      return {
        ...state,
        activeFileSource: action.payload,
      }
    }
  }
}

//reducer functions call
const toggleModalVisibility = () => ({ type: TOGGLE_VISIBILITY })
const resetProgress = () => ({
  type: RESET_PROGRESS,
})
const changeFileURLSource = (fileURL) => ({
  type: FILE_URL_SOURCE_CHANGE,
  payload: {
    url: fileURL != null ? fileURL : '',
  },
})
const changeFileLocalSource = (fileLocalUri) => ({
  type: FILE_LOCAL_SOURCE_CHANGE,
  payload: {
    fileLocalUri: fileLocalUri != null ? fileLocalUri : '',
  },
})
const changeFileExtension = (ext) => ({
  type: FILE_EXT_CHANGE,
  payload: {
    ext: ext != null ? ext : '',
  },
})
const fileDownloadReady = (path) => ({
  type: DOWNLOAD_FINISHED,
  path: path,
})
const fileDownloadError = () => ({
  type: DOWNLOAD_ERROR,
})
const changeCachingConfig = (conf) => ({
  type: CHANGE_CACHING_CONF,
  payload: conf,
})
const cachedFileCachedStatus = (status) => ({
  type: FILE_CACHE_STATE,
  payload: status,
})
const changeFileReadyStatus = (status) => ({
  type: FILE_REDY_STATUS,
  payload: status,
})
const changeActiveFileSource = (source) => ({
  type: CHANGE_ACTIVE_FILE_SOURCE,
  payload: source,
})

//permissions checking
const checkPermissionStatus = async (permission) => {
  return await PermissionsAndroid.request(permission, {
    title: 'Download files permission',
    message:
      'The application needs permission in order to save files in your device',
    buttonPositive: 'OK',
    buttonNegative: 'Cancel',
    buttonNeutral: 'Ask me later',
  })
}
const permissionChecker = async () => {
  let permissionResult = true

  if (
    checkPermissionStatus('android.permission.WRITE_EXTERNAL_STORAGE') ===
    PermissionsAndroid.RESULTS.granted
  ) {
    if (
      checkPermissionStatus('android.permission.READ_EXTERNAL_STORAGE') ===
      PermissionsAndroid.RESULTS.granted
    ) {
    } else {
      permissionResult = false
    }
  } else {
    permissionResult = false
  }

  return permissionResult
}

export const CoreFileViewer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (props.cachingActive != null) {
      if (props.cachingActive != state.cachingActive) {
        dispatch(changeCachingConfig(props.cachingActive))
      }
    }
  }, [props.cachingActive])

  useEffect(() => {
    //setting props
    //dispatch(changeActiveFileSource(EXTERNAL_URL))
    if (props.fileURL != null) {
      if (Platform.OS === 'ios' || permissionChecker()) {
        if (props.fileURL != state.fileURL) {
          dispatch(changeFileURLSource(props.fileURL))
          if (state.cachingActive) {
            //means the file is no more valid
            dispatch(cachedFileCachedStatus(false))
            dispatch(changeFileReadyStatus(false))
          } else {
            //just set to not ready, we dont need the file cache status anyway
            dispatch(changeFileReadyStatus(false))
          }
        }
      } else {
        console.log('Permissions not granted')
        return
      }
    } else {
      //revert to default

      console.log('File path null')
      dispatch(changeFileURLSource(null))
      dispatch(cachedFileCachedStatus(false))
      dispatch(changeFileReadyStatus(false))
    }
  }, [props.fileURL])

  useEffect(() => {
    //setting props
    changeActiveFileSource(LOCAL_URI)
    if (props.fileLocalUri != null) {
      if (Platform.OS === 'ios' || permissionChecker()) {
        if (props.fileLocalUri != state.fileLocalUri) {
          dispatch(changeFileLocalSource(props.fileLocalUri))
        }
      } else {
        dispatch(changeFileLocalSource(null))
        dispatch(changeFileReadyStatus(false))
        console.log('Permissions not granted')
        return
      }
    } else {
      //revert to default
      dispatch(changeFileLocalSource(null))
      dispatch(changeFileReadyStatus(false))
    }
  }, [props.fileLocalUri])

  useEffect(() => {
    if (props.activeSource) {
      switch (props.activeSource) {
        case EXTERNAL_URL: {
          dispatch(changeActiveFileSource(EXTERNAL_URL))
          break
        }
        case LOCAL_URI: {
          dispatch(changeActiveFileSource(LOCAL_URI))
          break
        }
      }
    }
  }, [props.activeSource])

  useEffect(() => {
    if (props.fileExtension != state.fileExtension) {
      dispatch(changeFileExtension(props.fileExtension))
      dispatch(cachedFileCachedStatus(false))
      dispatch(changeFileReadyStatus(false))
    }
  }, [props.fileExtension])

  useEffect(() => {
    if (props.isVisible != null) {
      if (props.isVisible != state.isVisible) dispatch(toggleModalVisibility())
      if (props.isVisible) {
        switch (state.activeFileSource) {
          case EXTERNAL_URL: {
            if (state.cachingActive) {
              //check if the file is already cached
              if (state.isFileCached) {
                //we can already display the file
                dispatch(changeFileReadyStatus(true))
              } else {
                //check if the url is valid and start the download process
                dispatch(resetProgress())
                if (state.fileURL) {
                  startDownloadProcess()
                } else {
                  console.log('No file provided')
                }
              }
            } else {
              //check if the url is valid and start the download process
              if (state.fileURL) {
                startDownloadProcess()
              } else {
                console.log('No file provided')
              }
            }
            break
          }
          case LOCAL_URI: {
            if (state.fileLocalUri) {
              dispatch(fileDownloadReady(state.fileLocalUri))
            }
            break
          }
        }
      }
    }
  }, [props.isVisible])

  const startDownloadProcess = async () => {
    // send http request in a new thread (using native code)
    RNFetchBlob.config({
      fileCache: true,
      appendExt: state.fileExtension,
    })
      .fetch('GET', state.fileURL, {})
      .then((res) => {
        let status = res.info().status

        if (status == 200) {
          dispatch(
            fileDownloadReady(
              Platform.OS === 'android'
                ? 'file://' + res.path()
                : '' + res.path()
            )
          )
        } else {
          console.log(res.info())
          dispatch(fileDownloadError())
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
        console.log(errorMessage)
        console.log(statusCode)
      })
  }

  const renderAppropriateViewer = () => {
    if (state.filePath) {
      let fileName = state.filePath
      let parts = fileName.split('.')
      let extension = ''
      if (parts.length > 0) {
        extension = parts[parts.length - 1]
      }

      switch (state.fileExtension) {
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'webp':
          return (
            <CoreImageViewer
              pathToFile={state.filePath}
              fileExt={state.fileExtension}
            />
          )
        case 'stl':
        case 'obj':
          return (
            <Core3dObjectViewer
              pathToFile={state.filePath}
              fileExt={state.fileExtension}
            />
          )
        case 'pdf':
          return <CorePdfViewer pathToFile={state.filePath} />
        default:
          return (
            <View>
              <Text>Unknown format</Text>
            </View>
          )
      }
    } else {
      return (
        <View
          style={{
            flex: 1,
            padding: 0,
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>The file could not be obtained</Text>
        </View>
      )
    }
  }

  const renderLoadingView = () => {
    if (props.lootieLoadingAnimation) {
      return (
        <LottieView
          style={styles.animation}
          source={props.lootieLoadingAnimation}
          autoPlay
          loop
        />
      )
    } else {
      return <ActivityIndicator size='large' />
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={state.isVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.')
        //dispatch(toggleModalVisibility())
      }}
    >
      <SafeAreaView style={{ ...styles.centeredView }}>
        <View style={styles.modalView} overflow='hidden'>
          <View style={styles.header}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                props.onDismissClicked
                  ? props.onDismissClicked()
                  : Alert.alert('onDismissClicked not implemented')
              }}
            >
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </View>

          {state.isFileReady ? (
            <View style={{ flex: 1 }}>{renderAppropriateViewer()}</View>
          ) : (
            <View
              style={{
                flex: 1,
                padding: 0,
                margin: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {renderLoadingView()}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
    overflow: 'hidden',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  button: {
    borderRadius: 100,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    marginEnd: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#151515',
  },
  animation: {
    width: 200,
    height: 200,
  },
  closeButton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})
