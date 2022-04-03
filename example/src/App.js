import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, View } from 'react-native'
import { CoreFileViewer } from 'rn-core-file-viewer'
import RNFetchBlob from 'rn-fetch-blob'

const App = () => {
  const [fileUrl, setFileUrl] = useState(
    'https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e'
  )
  const [fileExt, setFileExt] = useState('jpg')
  //'https://cdn.thingiverse.com/assets/7e/49/a4/24/e2/Drywall_Anchor.stl'
  //"https://cdn.thingiverse.com/assets/d8/2e/4c/90/7a/Trophy_Collection_2022_-_Flowalistik_-_Lines.stl"
  //'https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e'
  const [isVisible, setIsVisible] = useState(false)
  const [localUri, setLocalUri] = useState('')
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#00000011' }}>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <CoreFileViewer
          lootieLoadingAnimation={require('../assets/lottie/loading-animation')}
          fileExtension={fileExt}
          isVisible={isVisible}
          fileLocalUri={localUri}
          onDismissClicked={() => {
            setIsVisible(false)
          }}
        />
        <Button
          title={'open'}
          onPress={() => {
            setIsVisible(!isVisible)
          }}
        />
        <Button
          title={'jpeg'}
          onPress={() => {
            setFileExt('jpg')
            setFileUrl(
              'https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e'
            )
          }}
        />
        <Button
          title={'stl'}
          onPress={() => {
            setFileExt('stl')
            setFileUrl(
              'https://cdn.thingiverse.com/assets/7e/49/a4/24/e2/Drywall_Anchor.stl'
            )
          }}
        />
        <Button
          title={'stl 2'}
          onPress={() => {
            setFileExt('stl')
            setFileUrl(
              'https://cdn.thingiverse.com/assets/d8/2e/4c/90/7a/Trophy_Collection_2022_-_Flowalistik_-_Lines.stl'
            )
          }}
        />
        <Button
          title={'test local uri'}
          onPress={() => {
            setFileExt('png')
            RNFetchBlob.config({
              fileCache: true,
              appendExt: 'jpg',
            })
              .fetch(
                'GET',
                'https://upload.wikimedia.org/wikipedia/commons/e/e9/Felis_silvestris_silvestris_small_gradual_decrease_of_quality.png',
                {}
              )
              .then((res) => {
                let status = res.info().status

                if (status == 200) {
                  console.log('File saved to ', res.path())
                  setLocalUri(
                    Platform.OS === 'android'
                      ? 'file://' + res.path()
                      : '' + res.path()
                  )
                } else {
                  console.log('Error! File path is worng')
                  console.log(res.info())
                }
              })
              // Something went wrong:
              .catch((errorMessage, statusCode) => {
                // error handling
                console.log(errorMessage)
                console.log(statusCode)
              })
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default App
