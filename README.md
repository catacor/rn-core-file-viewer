# Welcome to Core File Viewer!

The purpose of this project is to view different type of files, like images or 3d objects.

Currently, the supported file types are: jpeg, jpg, png, webp and for 3D objects: stl and obj.

In order to display 3D objects, I've used THREE.js an GLView, so you can encounter some problems if you don't have all the packages installed correctly.

Also, for nice animations, I've used Lottie.

# Usage

In you app, include the **CoreFileViewer** and be sure you have the next parameters set.

(string) **fileURL**: for web link. The file will be downloaded by the Viewer. Just send the accordance link.
(string) **fileExtension**: the file extension, because not all the links provide a file extension
(boolean) **isVisible**: state for visibility. This one works as an **on/off** button. To start the viewer, just set this value to true.
**onDissmissClicked**: callback -> in order to actualize your local visible state.

    const [fileUrl, setFileUrl] = useState('http://example.image.cor')
    const [fileExt, setFileExt] = useState('jpg')
    const [isVisible, setIsVisible] = useState(false)

    <CoreFileViewer
        fileURL={fileUrl}
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

## Caching mechanism

The file explorer supports file caching for faster loads and less network consumption. Just set **cachingActive** to true. Default if false.

## Features

Images have implemented pinch zoom and rotation.
3D objects also have spatial rotation on all axis plus pinch zoom
