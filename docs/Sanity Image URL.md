### Image URL Generation with @sanity/image-url

Source: https://github.com/sanity-io/image-url/blob/main/README.md

This section covers the fundamental usage of the @sanity/image-url library, including configuration and basic URL generation for image resizing and cropping.

```APIDOC
## Configuration and Basic Usage

### Description
Configure the `imageUrlBuilder` with your Sanity client and use the `urlFor` helper to generate image URLs. This allows for automatic application of crops and hotspots defined in Sanity.

### Method
N/A (Client-side library configuration)

### Endpoint
N/A

### Parameters
None

### Request Example
```javascript
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from './sanityClient' // Assuming you have a configured Sanity client

const builder = imageUrlBuilder(sanityClient)

function urlFor(source) {
  return builder.image(source)
}

// Example usage in a React component:
// <img src={urlFor(author.image).width(200).url()} />
// <img src={urlFor(movie.poster).width(500).height(300).url()}> 
```

### Response
N/A (Generates URLs)

### Response Example
N/A
```

--------------------------------

### Set Device Pixel Ratio Scaling

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Illustrates how to use the `dpr` method to specify a device pixel ratio scaling factor, which is useful for high-resolution displays.

```javascript
// Set DPR to 2 for higher resolution displays:
// urlFor(imageRecord).width(100).dpr(2).url()

```

--------------------------------

### Apply Image Transformations with @sanity/image-url

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Illustrates how to chain multiple builder methods to apply various image transformations such as blur, focal point, cropping, and format changes. This allows for fine-grained control over image appearance.

```javascript
// Example with blur:
// <img src={urlFor(mysteryPerson.mugshot).width(200).height(200).blur(50).url()}>

// Example with focal point and crop:
// urlFor(imageRecord).focalPoint(0.8, 0.2).rect(20, 20, 100, 100).url()

// Example with format and quality:
// urlFor(imageRecord).format('webp').quality(80).url()

// Example with auto format detection:
// urlFor(imageRecord).auto('format').url()

// Example with orientation:
// urlFor(imageRecord).orientation(90).url()

// Example with flip:
// urlFor(imageRecord).flipHorizontal().url()

// Example with saturation (grayscale):
// urlFor(imageRecord).saturation(-100).url()

// Example with ignoreImageParams:
// urlFor(imageRecord).ignoreImageParams().width(100).url()

// Example with vanity name for SEO:
// urlFor('image-asset-id-200x200-png').vanityName('my-image.png').url()

```

--------------------------------

### Set Image Dimensions and Fit Modes

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Shows how to specify image dimensions using `width`, `height`, or `size`, and how to control how the image is resized using the `fit` method. This is crucial for responsive image design.

```javascript
// Specify width and height:
// urlFor(imageRecord).width(500).height(300).url()

// Specify size in one go:
// urlFor(imageRecord).size(400, 400).url()

// Configure fit mode:
// urlFor(imageRecord).width(200).height(200).fit('crop').url()
// urlFor(imageRecord).width(200).height(200).fit('scale').url()

```

--------------------------------

### Download Image with Vanity Name

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Demonstrates how to configure the URL to prompt a download of the image, including specifying a default file name for the downloaded asset using the `forceDownload` method.

```javascript
// Force download with a default file name:
// urlFor(imageRecord).width(300).forceDownload('profile-pic.jpg').url()

```

--------------------------------

### Image URL Builder Methods

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Details on the various methods available on the image URL builder instance to control image transformations, format, and more.

```APIDOC
## Image Builder Methods

### image(source)

#### Description
Specify the Sanity image asset to process. Accepts an image record, asset record, or just the asset ID string. Providing the full image record is necessary for applying crop and hotspot data.

### dataset(dataset), projectId(projectId)

#### Description
Temporarily override the dataset or project ID configured with the builder. Useful for accessing assets from different Sanity projects or datasets.

### width(pixels)

#### Description
Set the desired width of the output image in pixels.

### height(pixels)

#### Description
Set the desired height of the output image in pixels.

### size(width, height)

#### Description
Set both the width and height of the output image simultaneously.

### focalPoint(x, y)

#### Description
Specify a focal point for cropping as a fraction (0.0 to 1.0) of the image dimensions. Overrides any existing crop or hotspot data in the image record.

### blur(amount), sharpen(amount), invert()

#### Description
Apply image processing effects like blur, sharpening, or inversion.

### rect(left, top, width, height)

#### Description
Manually define the crop area in pixels. This overrides any crop or hotspot information from the image record.

### format(name)

#### Description
Specify the output image format. Supported formats include 'jpg', 'pjpg', 'png', and 'webp'.

### auto(mode)

#### Description
Automatically apply transformations based on browser capabilities. The 'format' mode uses WebP and AVIF if supported by the browser.

### orientation(angle)

#### Description
Rotate the image by a specified angle (0, 90, 180, 270 degrees).

### quality(value)

#### Description
Control the compression quality for applicable image formats (0-100).

### forceDownload(defaultFileName)

#### Description
Configure the URL to prompt image download. You can specify a default file name for the download.

### flipHorizontal(), flipVertical()

#### Description
Flip the image horizontally or vertically.

### crop(mode)

#### Description
Specify the cropping mode. This overrides any crop or hotspot data in the image record. Refer to Sanity documentation for available modes.

### fit(value)

#### Description
Configure the image fitting mode. Refer to Sanity documentation for available fitting modes.

### dpr(value)

#### Description
Set the device pixel ratio scaling factor (1 to 3).

### saturation(value)

#### Description
Adjust the image saturation. A value of -100 grayscales the image.

### ignoreImageParams()

#### Description
Instruct the builder to disregard any crop or hotspot parameters defined within the image record.

### url(), toString()

#### Description
Generate and return the final image URL as a string. This method must be called last.

### pad(value)

#### Description
Specify the number of pixels to pad the image.

### vanityName(fileName)

#### Description
Append a "vanity name" or SEO-friendly filename to the end of the URL. 

```ts
// Example:
// urlFor('image-asset-id').vanityName('my-cool-image.jpg') 
// Result: .../my-cool-image.jpg
```

### frame(value)

#### Description
Specify a frame from an animated image. For example, `frame(1)` can return the first frame as a static preview.
```

--------------------------------

### Handle Animated Image Frames

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Explains how to specify which frame of an animated image to use, allowing for static previews of GIF or other animated formats using the `frame` method.

```javascript
// Get the first frame as a static preview:
// urlFor(animatedImageRecord).frame(1).url()

```

--------------------------------

### Override Dataset and Project ID

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Shows how to temporarily override the project ID and dataset configured for the builder, which can be useful for accessing assets from different Sanity projects.

```javascript
// Temporarily override dataset and project ID:
// urlFor(imageRecord).dataset('another-dataset').projectId('another-project-id').url()

```

--------------------------------

### Configure Custom CDN Domain for Image URLs

Source: https://github.com/sanity-io/image-url/blob/main/README.md

Sets a custom baseUrl for the Sanity.io image URL builder to override the default CDN domain. This allows users to host images on their own domains. It requires the '@sanity/image-url' package and a Sanity project/dataset configuration.

```javascript
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
  baseUrl: 'https://my.custom.domain',
  projectId: 'abc123',
  dataset: 'production',
})
const urlFor = (source) => builder.image(source)

urlFor('image-928ac96d53b0c9049836c86ff25fd3c009039a16-200x200-png')
  .auto('format')
  .fit('max')
  .width(720)
  .toString()

// output: https://my.custom.domain/images/abc123/production/928ac96d53b0c9049836c86ff25fd3c009039a16-200x200.png?auto=format&fit=max&w=720
```

```javascript
import imageUrlBuilder from '@sanity/image-url'
import myConfiguredClient from './mySanityClient'

const builder = imageUrlBuilder({
  ...myConfiguredClient.config(),
  baseUrl: 'https://my.custom.domain',
})
```

--------------------------------

### Configure and Use Image URL Builder in React

Source: https://github.com/sanity-io/image-url/blob/main/README.md

This snippet demonstrates how to configure the @sanity/image-url builder with a Sanity client and use it within a React component to generate image URLs. It shows basic usage for setting image dimensions.

```javascript
import React from 'react'
import myConfiguredSanityClient from './sanityClient'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(myConfiguredSanityClient)

function urlFor(source) {
  return builder.image(source)
}

// Usage example:
// <img src={urlFor(author.image).width(200).url()} />
// <img src={urlFor(movie.poster).width(500).height(300).url()}>
// <img src={urlFor(mysteryPerson.mugshot).width(200).height(200).blur(50).url()}>

```