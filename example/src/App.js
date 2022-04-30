import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, View } from 'react-native'
import { CoreFileViewer, EXTERNAL_URL, LOCAL_URI } from 'rn-core-file-viewer'
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
  const [activeSource, setActiveSource] = useState('')
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
          activeSource={activeSource}
          fileURL={fileUrl}
          fileLocalUri={localUri}
          fileExtension={fileExt}
          isVisible={isVisible}
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
            setActiveSource(EXTERNAL_URL)
            setFileExt('jpg')
            setFileUrl(
              'https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e'
            )
          }}
        />
        <Button
          title={'stl'}
          onPress={() => {
            setActiveSource(EXTERNAL_URL)
            setFileExt('stl')
            setFileUrl(
              'https://ozeki.hu/attachments/116/Menger_sponge_sample.stl'
            )
          }}
        />
        <Button
          title={'stl 2'}
          onPress={() => {
            setActiveSource(EXTERNAL_URL)
            setFileExt('stl')
            setFileUrl(
              'https://ozeki.hu/attachments/116/Menger_sponge_sample.stl'
            )
          }}
        />
        <Button
          title={'PDF'}
          onPress={() => {
            setActiveSource(EXTERNAL_URL)
            setFileExt('pdf')
            setFileUrl(
              'https://file-examples.com/storage/fef12739526267ac9a2b543/2017/10/file-example_PDF_1MB.pdf'
            )
          }}
        />
        <Button
          title={'test local uri'}
          onPress={() => {
            setActiveSource(LOCAL_URI)
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
