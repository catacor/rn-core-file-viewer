import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, View } from 'react-native'
import { CoreFileViewer } from 'rn-core-file-viewer'

const App = () => {
  const [fileUrl, setFileUrl] = useState(
    'https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e'
  )
  const [fileExt, setFileExt] = useState('jpg')
  //'https://cdn.thingiverse.com/assets/7e/49/a4/24/e2/Drywall_Anchor.stl'
  //"https://cdn.thingiverse.com/assets/d8/2e/4c/90/7a/Trophy_Collection_2022_-_Flowalistik_-_Lines.stl"
  //'https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e'
  const [isVisible, setIsVisible] = useState(false)
  const [fileBinary, setFileBinary] = useState<object>()
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
          fileURL={fileUrl}
          lootieLoadingAnimation={require('../assets/lottie/loading-animation')}
          //fileExtension={fileExt}
          fileBinary={fileBinary}
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
          title={'stl'}
          onPress={() => {
            let binar = [102, 111, 111]
            setFileBinary(binar)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default App
