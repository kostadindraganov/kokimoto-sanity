### Install @sanity-image/url-builder

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Install the package using npm or pnpm.

```sh
npm install @sanity-image/url-builder
# or
pnpm add @sanity-image/url-builder
```

--------------------------------

### Install sanity-image

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Install the sanity-image package using yarn or npm.

```sh
yarn add sanity-image
# or
npm install sanity-image
```

--------------------------------

### Responsive Grid Layout with Sanity Images

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Implement a responsive grid layout for images using CSS Grid. This example shows how to create a 3-column grid that scales with the viewport, ensuring images fit within defined column widths.

```jsx
<div
  css={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 15,
    maxWidth: 1240,
    paddingInline: 20,
    marginInline: "auto",
  }}
>
  {["image-a", "image-b", "image-c"].map((imageId) => (
    <div key={imageId}>
      <SanityImage
        id={imageId}
        baseUrl="..."
        width={390}
        sizes="(min-width: 1240px) 390px, calc((100vw - 40px - 30px) / 3)"
      />
    </div>
  ))}
</div>
```

--------------------------------

### Basic SanityImage Usage

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Render an image from Sanity using its ID and base URL. This is the simplest way to get started.

```tsx
import { SanityImage } from "sanity-image"

const YourSweetComponent = ({ image }: ComponentProps) => (
  <SanityImage
    // Pass the Sanity Image ID (`_id`) (e.g., `image-abcde12345-1200x800-jpg`)
    id={image._id}
    baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
    alt="Demo image"
  />
)
```

--------------------------------

### Get Single Image URL and SrcSet

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Import and use `buildSrc` for a single image URL and `buildSrcSet` for responsive image sources.

```typescript
import { buildSrc, buildSrcSet } from "@sanity-image/url-builder"

// Get a single image URL with dimensions
const { src, width, height } = buildSrc({
  id: "image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png",
  width: 500,
  baseUrl: `https://cdn.sanity.io/images/<project-id>/<dataset>`,
})

// Get a responsive srcSet
const srcSet = buildSrcSet({
  id: "image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png",
  width: 500,
  baseUrl: `https://cdn.sanity.io/images/<project-id>/<dataset>`,
})
```

--------------------------------

### Recommended Wrapper Pattern

Source: https://context7.com/coreyward/sanity-image/llms.txt

Demonstrates how to create a reusable image component using `WrapperProps` to configure a base CDN URL once for the entire application.

```APIDOC
## `WrapperProps` Type and Recommended Wrapper Pattern

`WrapperProps<T>` is the type for building app-level image wrapper components. It is `SanityImageProps` minus the configuration props (`baseUrl`, `projectId`, `dataset`), enabling a single configuration point for the CDN base URL across the entire application.

```tsx
// components/Image.tsx — create once, use everywhere
import * as React from "react"
import { SanityImage, type WrapperProps } from "sanity-image"

export const Image = <T extends React.ElementType = "img">( 
  props: WrapperProps<T>
) => (
  <SanityImage
    baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
    {...props}
  />
)

// Usage throughout the app — no baseUrl needed
import { Image } from "@/components/Image"

<Image id={product.image._id} width={390} alt={product.title} />
<Image id={hero.image._id} width={1440} height={600} mode="cover" alt="" />
<Image
  id={avatar._id}
  width={80}
  height={80}
  mode="cover"
  hotspot={avatar.hotspot}
  crop={avatar.crop}
  alt={user.name}
/>
```
```

--------------------------------

### buildSrc(options)

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Returns metadata and a single image URL based on the provided options. It allows specifying image ID, dimensions, base URL, and various transformation parameters like mode, crop, hotspot, and query parameters.

```APIDOC
## buildSrc(options)

### Description
Returns metadata and a single image URL based on the provided options.

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **id** (string) - Required - The ID of the Sanity image.
- **width** (number) - Required - The target width for the image.
- **baseUrl** (string) - Required - The base URL for Sanity images.
- **mode** (string) - Optional - The image scaling mode ('cover' or 'contain'). Defaults to 'contain'.
- **height** (number) - Optional - The target height for the image.
- **hotspot** (object) - Optional - Defines the focal point for cropping. Example: `{ x: 0.5, y: 0.5 }`.
- **crop** (object) - Optional - Defines the cropping area. Example: `{ top: 0, bottom: 0, left: 0, right: 0 }`.
- **queryParams** (object) - Optional - Additional query parameters to append to the URL. Example: `{ blur: 50, q: 90 }`.

### Request Example
```typescript
const { src, width, height } = buildSrc({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
  mode: "cover", // optional, defaults to "contain"
  height: 300, // optional
  hotspot: { x: 0.5, y: 0.5 }, // optional
  crop: { top: 0, bottom: 0, left: 0, right: 0 }, // optional
  queryParams: { blur: 50, q: 90 }, // optional
});
```

### Response
#### Success Response (200)
- **src** (string) - The generated image URL.
- **width** (number) - The effective width of the image.
- **height** (number) - The effective height of the image.

#### Response Example
```json
{
  "src": "/images/image-abc123-1000x1000-png?w=500&h=300&fit=cover&crop=0.5,0.5&blur=50&q=90",
  "width": 500,
  "height": 300
}
```
```

--------------------------------

### Fetch Image Data with GROQ

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Recommended GROQ query to fetch necessary image fields including asset reference, low-quality image preview (LQIP), hotspot, and crop data.

```groq
"id": asset._ref,
"preview": asset->metadata.lqip,
hotspot { x, y },
crop {
  bottom,
  left,
  right,
  top,
}
```

--------------------------------

### Create Sanity Image Wrapper Component

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Create a wrapper component to set the `baseUrl` prop for `SanityImage`. This centralizes configuration and provides an entry point for additional logic.

```tsx
import * as React from "react"
import { SanityImage, type WrapperProps } from "sanity-image"

export const Image = <T extends React.ElementType = "img">
  (props: WrapperProps<T>)
) => <SanityImage baseUrl="<your-baseurl-here>" {...props} />
```

--------------------------------

### `SanityImage` React Component Usage

Source: https://context7.com/coreyward/sanity-image/llms.txt

Demonstrates how to use the `SanityImage` React component with data fetched via GROQ, including hotspot, crop, and preview configurations.

```APIDOC
## GROQ Query Pattern for Sanity Data Fetching

The recommended GROQ query shape for fetching all data needed by `<SanityImage>`, including the hotspot, crop, and LQIP preview.

```groq
// In your GROQ query, project the image fields like this:
*[_type == "product"][0] {
  title,
  "image": {
    "id": image.asset._ref,
    "preview": image.asset->metadata.lqip,
    "hotspot": image.hotspot { x, y },
    "crop": image.crop { bottom, left, right, top }
  }
}
```

```tsx
// Then pass directly to <SanityImage>:
import { SanityImage } from "sanity-image"

const ProductCard = ({ product }) => (
  <article>
    <SanityImage
      id={product.image.id}
      baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
      preview={product.image.preview}
      hotspot={product.image.hotspot}
      crop={product.image.crop}
      width={390}
      height={260}
      mode="cover"
      alt={product.title}
      sizes="(min-width: 1240px) 390px, calc((100vw - 40px - 30px) / 3)"
    />
    <h2>{product.title}</h2>
  </article>
)
```
```

--------------------------------

### Build Cropped Image URL with Hotspot

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Creates a Sanity image URL with cropping and hotspot enabled. Specify width, height, mode, hotspot coordinates, and crop percentages. The `mode: "cover"` option crops the image to match the aspect ratio, using hotspot coordinates if provided.

```typescript
const { src } = buildSrc({
  id: "image-abc123-1000x1000-png",
  width: 500,
  height: 300,
  mode: "cover",
  hotspot: { x: 0.25, y: 0.25 },
  crop: { top: 0, bottom: 0.25, left: 0, right: 0.25 },
  baseUrl: "/images/",
})
// => "/images/abc123-1000x1000.png?auto=format&fit=crop&fp-x=0.333&fp-y=0.333&h=300&q=75&rect=0,0,750,750&w=500"
```

--------------------------------

### Create a Reusable Image Wrapper Component

Source: https://context7.com/coreyward/sanity-image/llms.txt

Define a wrapper component using `WrapperProps` to set a default `baseUrl` for all image instances. This simplifies usage throughout your application by removing the need to specify configuration props repeatedly.

```tsx
import * as React from "react"
import { SanityImage, type WrapperProps } from "sanity-image"

export const Image = <T extends React.ElementType = "img">( 
  props: WrapperProps<T>
) => (
  <SanityImage
    baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
    {...props}
  />
)
```

```tsx
// Usage throughout the app — no baseUrl needed
import { Image } from "@/components/Image"

<Image id={product.image._id} width={390} alt={product.title} />
<Image id={hero.image._id} width={1440} height={600} mode="cover" alt="" />
<Image
  id={avatar._id}
  width={80}
  height={80}
  mode="cover"
  hotspot={avatar.hotspot}
  crop={avatar.crop}
  alt={user.name}
/>
```

--------------------------------

### `ImageWithPreview` Component

Source: https://context7.com/coreyward/sanity-image/llms.txt

A component that renders a blurred LQIP placeholder and a full-size image, useful for immediate visual feedback.

```APIDOC
## `<ImageWithPreview>` Component

A lower-level component used internally by `<SanityImage>` when a `preview` prop is provided. Renders two image elements: a blurred LQIP placeholder that is immediately visible, and the full-size image loading in the background. Once the full image fires `onLoad`, the preview is removed and the full image is shown. Supports the same polymorphic `as` prop as `<SanityImage>`.

```tsx
import { ImageWithPreview } from "sanity-image"

// Used directly when you want LQIP behavior with a pre-built src/srcSet
<ImageWithPreview
  as="img"                              // default; swap with custom component
  preview="data:image/jpeg;base64,வைக்"
  src="https://cdn.sanity.io/images/.../photo.jpg?w=800&..."
  srcSet="https://...?w=400 400w, https://...?w=800 800w"
  width={800}
  height={533}
  alt="A beautiful landscape"
  className="responsive-image"
  style={{ objectFit: "cover" }}
/>
// Renders two <img> tags while loading:
//   <img src="data:image/jpeg;base64,வைக்" data-lqip ... />  ← visible placeholder
//   <img src="..." data-loading style="position:absolute;width:10px;opacity:0;..." /> ← hidden full image
// After full image loads:
//   placeholder is unmounted, full image becomes visible with original styles
```
```

--------------------------------

### buildSrcSet

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Generates an array of image URLs for responsive images.

```APIDOC
## buildSrcSet

### Description
Generates an array of image URLs suitable for a `srcset` attribute, providing different resolutions for responsive images.

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **id** (string) - Required - The Sanity Image ID (e.g., `image-abcde12345-1200x800-jpg`).
- **baseUrl** (string) - Required - The base URL for the Sanity image CDN (e.g., `https://cdn.sanity.io/images/project/dataset/`).
- **width** (number) - Required - The base width for generating the `srcset`.
- **height** (number) - Optional - Target height in pixels. Used with width to establish aspect ratio.
- **mode** (string) - Optional - Defaults to "contain". Can be "cover" or "contain".
- **hotspot** (object) - Optional - Coordinates for focal point when cropping { x: number, y: number }. Values between 0-1.
- **crop** (object) - Optional - Crop coordinates { top: number, bottom: number, left: number, right: number }. Values between 0-1.
- **queryParams** (object) - Optional - Additional Sanity Image API parameters.

### Request Example
```typescript
const srcSet = buildSrcSet({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
})
// => [
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=250 250w",
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=500 500w",
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=750 750w",
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w"
// ]
```

### Response
#### Success Response (200)
- **srcSet** (array) - An array of strings, each representing an image URL with its width descriptor for `srcset`.

#### Response Example
```json
[
  "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=250 250w",
  "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=500 500w",
  "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=750 750w",
  "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w"
]
```
```

--------------------------------

### SanityImage Component with Project ID and Dataset

Source: https://context7.com/coreyward/sanity-image/llms.txt

Alternative to using `baseUrl`, this configuration uses `projectId` and `dataset` to construct the Sanity CDN base path. Useful when the base URL is not readily available.

```tsx
// Using projectId + dataset instead of baseUrl
<SanityImage
  id={image._id}
  projectId="abcd1234"
  dataset="production"
  width={400}
  alt="Product photo"
/>
// Equivalent baseUrl: "https://cdn.sanity.io/images/abcd1234/production/"
```

--------------------------------

### Build Responsive `srcSet`

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Generates an array of image URLs suitable for a responsive `srcSet` attribute. It creates URLs for multiple widths based on the provided `width` parameter, including pixel density descriptors.

```typescript
const srcSet = buildSrcSet({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
})
// => [
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=250 250w",
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=500 500w",
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=750 750w",
//   "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w"
// ]
```

--------------------------------

### Build Single Image URL with Options

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Use `buildSrc` to generate a single image URL with various options like mode, dimensions, hotspot, crop, and query parameters.

```typescript
const { src, width, height } = buildSrc({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
  mode: "cover", // optional, defaults to "contain"
  height: 300, // optional
  hotspot: { x: 0.5, y: 0.5 }, // optional
  crop: { top: 0, bottom: 0, left: 0, right: 0 }, // optional
  queryParams: { blur: 50, q: 90 }, // optional
})
```

--------------------------------

### Build Basic Image URL

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Generates a basic Sanity image URL with specified ID, width, and base URL. Includes default query parameters for format, fit, and quality.

```typescript
const { src } = buildSrc({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
})
// => "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=500"
```

--------------------------------

### Apply Direct Sanity Image API Parameters with queryParams

Source: https://context7.com/coreyward/sanity-image/llms.txt

Use the `queryParams` prop to merge custom Sanity CDN transformation parameters into the generated URL. Parameters are alphabetically sorted for optimal CDN caching. Supports quality, sharpening, blur, saturation, flip, and format.

```tsx
import { SanityImage } from "sanity-image"

// All supported queryParams options:
<SanityImage
  id="image-abc123-1200x800-jpg"
  baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
  width={600}
  queryParams={{
    q: 85,          // Quality 0–100 (default: 75)
    sharp: 30,      // Sharpening 0–100
    blur: 5,        // Blur 1–2000
    sat: -100,      // Grayscale (only supported value: -100)
    flip: "hv",     // Flip: "h" | "v" | "hv"
    fm: "webp",     // Force format: "jpg" | "pjpg" | "png" | "webp"
                    // Note: setting fm disables auto=format (AVIF negotiation)
  }}
  alt="Stylized photo"
/>
// Resulting URL:
// ...abc123-1200x800.jpg?blur=5&fit=max&flip=hv&fm=webp&q=85&sat=-100&sharp=30&w=600
```

--------------------------------

### `buildSrc` - Build a single image URL

Source: https://context7.com/coreyward/sanity-image/llms.txt

Constructs a full Sanity CDN URL for the given inputs and returns the URL string along with the computed `width` and `height` of the output image. This is useful for non-React contexts or when the URL string is needed directly.

```APIDOC
## `buildSrc` — Build a single image URL with computed dimensions

Constructs a full Sanity CDN URL for the given inputs and returns the URL string plus the computed `width` and `height` of the output image. Useful for non-React contexts or when you need the URL string directly.

```ts
import { buildSrc } from "sanity-image"
// or from the standalone package:
import { buildSrc } from "@sanity-image/url-builder"

const result = buildSrc({
  id: "image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png",
  baseUrl: "https://cdn.sanity.io/images/abcd1234/production/",
  width: 500,
  mode: "contain", // default
})
// result:
// {
//   src: "https://cdn.sanity.io/images/abcd1234/production/79f37b3f...png?auto=format&fit=max&q=75&w=500",
//   width: 500,
//   height: 500,
// }

// With crop + cover mode
const cropped = buildSrc({
  id: "image-abc123-1200x800-jpg",
  baseUrl: "https://cdn.sanity.io/images/abcd1234/production/",
  width: 400,
  height: 400,
  mode: "cover",
  crop: { top: 0, bottom: 0.2, left: 0, right: 0.1 },
  hotspot: { x: 0.5, y: 0.3 },
  queryParams: { q: 85 },
})
// cropped.src includes: ?auto=format&fit=crop&fp-x=...&fp-y=...&h=400&q=85&rect=...&w=400
// cropped.width  → 400
// cropped.height → 400
```
```

--------------------------------

### ImageWithPreview Component for LQIP

Source: https://context7.com/coreyward/sanity-image/llms.txt

Renders a blurred LQIP placeholder and a full-size image loading in the background. The placeholder is removed upon full image load. Supports a polymorphic `as` prop.

```tsx
import { ImageWithPreview } from "sanity-image"

// Used directly when you want LQIP behavior with a pre-built src/srcSet
<ImageWithPreview
  as="img"                              // default; swap with custom component
  preview="data:image/jpeg;base64,..." // base64 LQIP from Sanity metadata.lqip
  src="https://cdn.sanity.io/images/.../photo.jpg?w=800&..."
  srcSet="https://...?w=400 400w, https://...?w=800 800w"
  width={800}
  height={533}
  alt="A beautiful landscape"
  className="responsive-image"
  style={{ objectFit: "cover" }}
/>
// Renders two <img> tags while loading:
//   <img src="data:image/jpeg;base64,..." data-lqip ... />  ← visible placeholder
//   <img src="..." data-loading style="position:absolute;width:10px;opacity:0;..." /> ← hidden full image
// After full image loads:
//   placeholder is unmounted, full image becomes visible with original styles
```

--------------------------------

### Generate Responsive SrcSet

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Use `buildSrcSet` to generate an array of srcSet entries optimized for responsive images. It accepts the same options as `buildSrc`.

```typescript
const srcSet = buildSrcSet({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
  // ... same options as buildSrc
})
```

--------------------------------

### buildSrcSet(options)

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Generates an array of srcSet entries optimized for responsive images. The widths generated depend on the target size and image dimensions, with options for transformations similar to buildSrc.

```APIDOC
## buildSrcSet(options)

### Description
Generates an array of srcSet entries optimized for responsive images. The widths generated depend on the target size.

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **id** (string) - Required - The ID of the Sanity image.
- **width** (number) - Required - The target width for the image.
- **baseUrl** (string) - Required - The base URL for Sanity images.
- **mode** (string) - Optional - The image scaling mode ('cover' or 'contain'). Defaults to 'contain'.
- **height** (number) - Optional - The target height for the image.
- **hotspot** (object) - Optional - Defines the focal point for cropping. Example: `{ x: 0.5, y: 0.5 }`.
- **crop** (object) - Optional - Defines the cropping area. Example: `{ top: 0, bottom: 0, left: 0, right: 0 }`.
- **queryParams** (object) - Optional - Additional query parameters to append to the URL. Example: `{ blur: 50, q: 90 }`.

### Request Example
```typescript
const srcSet = buildSrcSet({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
  // ... same options as buildSrc
});
```

### Response
#### Success Response (200)
- **srcSet** (string) - A string containing srcset entries.
- **sizes** (string) - A string containing the sizes attribute for the img tag.

#### Response Example
```json
{
  "srcSet": "/images/image-abc123-1000x1000-png?w=250&fit=cover&crop=0.5,0.5 500w, /images/image-abc123-1000x1000-png?w=500&fit=cover&crop=0.5,0.5 1000w",
  "sizes": "(max-width: 500px) 100vw, 500px"
}
```
```

--------------------------------

### Generate Responsive srcSet Array with buildSrcSet

Source: https://context7.com/coreyward/sanity-image/llms.txt

Use `buildSrcSet` to create an array of `"<url> <w>w"` strings for responsive images. It automatically generates multiple width variants based on the target output size, with scaling multipliers and omitted small variants. Options for `mode`, `crop`, `hotspot`, and `queryParams` are supported.

```ts
import { buildSrcSet } from "sanity-image"

const srcSet = buildSrcSet({
  id: "image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png",
  baseUrl: "/images/",
  width: 500,
})
// [
//   "/images/79f37b3f...png?auto=format&fit=max&q=75&w=250 250w",
//   "/images/79f37b3f...png?auto=format&fit=max&q=75&w=500 500w",
//   "/images/79f37b3f...png?auto=format&fit=max&q=75&w=750 750w",
//   "/images/79f37b3f...png?auto=format&fit=max&q=75&w=1000 1000w",
// ]
```

```ts
// Cover mode with crop — srcSet entries use fit=crop + rect
const coverSrcSet = buildSrcSet({
  id: "image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png",
  baseUrl: "/images/",
  width: 300,
  height: 500,
  mode: "cover",
  crop: { top: 0, bottom: 0.25, left: 0, right: 0.25 },
})
// [
//   "/images/79f37b3f...png?auto=format&crop=entropy&fit=crop&h=250&q=75&rect=0,0,750,750&w=150 150w",
//   "/images/79f37b3f...png?auto=format&crop=entropy&fit=crop&h=500&q=75&rect=0,0,750,750&w=300 300w",
//   "/images/79f37b3f...png?auto=format&crop=entropy&fit=crop&h=750&q=75&rect=0,0,750,750&w=450 450w",
// ]
```

```ts
// Use the result in a plain <img> tag
const { src } = buildSrc({ id, baseUrl, width: 500 })
const srcSetStr = buildSrcSet({ id, baseUrl, width: 500 }).join(", ")
return `<img src="${src}" srcset="${srcSetStr}" width="500" height="500" loading="lazy" alt="...">`
```

--------------------------------

### buildSrc

Source: https://github.com/coreyward/sanity-image/blob/main/packages/url-builder/README.md

Generates a single image URL based on the provided parameters.

```APIDOC
## buildSrc

### Description
Generates a single image URL for a Sanity image with specified dimensions and options.

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
- **id** (string) - Required - The Sanity Image ID (e.g., `image-abcde12345-1200x800-jpg`).
- **baseUrl** (string) - Required - The base URL for the Sanity image CDN (e.g., `https://cdn.sanity.io/images/project/dataset/`).
- **width** (number) - Optional - Target width in pixels. Used to determine dimensions and generate srcSet.
- **height** (number) - Optional - Target height in pixels. Used with width to establish aspect ratio.
- **mode** (string) - Optional - Defaults to "contain". Can be "cover" (crops to match aspect ratio) or "contain" (fits within boundaries).
- **hotspot** (object) - Optional - Coordinates for focal point when cropping { x: number, y: number }. Values between 0-1.
- **crop** (object) - Optional - Crop coordinates { top: number, bottom: number, left: number, right: number }. Values between 0-1.
- **queryParams** (object) - Optional - Additional Sanity Image API parameters (e.g., `q`, `blur`, `sharp`).

### Request Example
```typescript
const { src } = buildSrc({
  id: "image-abc123-1000x1000-png",
  width: 500,
  baseUrl: "/images/",
})
// => "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=500"
```

### Response
#### Success Response (200)
- **src** (string) - The generated image URL.

#### Response Example
```json
{
  "src": "/images/abc123-1000x1000.png?auto=format&fit=max&q=75&w=500"
}
```
```

--------------------------------

### SanityImage Component as a Custom Element

Source: https://context7.com/coreyward/sanity-image/llms.txt

Demonstrates polymorphism by rendering the SanityImage component as a custom element using the `as` prop. This allows integration with other image components or styled elements.

```tsx
// Polymorphic: render as a custom component (e.g., Next.js <Image> or Emotion-styled img)
const MyImg = (props: React.ComponentPropsWithoutRef<"img">) => (
  <img {...props} data-custom="true" />
)
<SanityImage as={MyImg} id={image._id} baseUrl={baseUrl} width={300} alt="Custom" />
```

--------------------------------

### GROQ Query for Sanity Image Data

Source: https://context7.com/coreyward/sanity-image/llms.txt

Fetch all necessary image data, including hotspot, crop, and LQIP preview, using this GROQ query pattern. This structure is optimized for direct use with the `<SanityImage>` component.

```groq
// In your GROQ query, project the image fields like this:
*[_type == "product"][0] {
  title,
  "image": {
    "id": image.asset._ref,
    "preview": image.asset->metadata.lqip,
    "hotspot": image.hotspot { x, y },
    "crop": image.crop { bottom, left, right, top }
  }
}
```

--------------------------------

### Basic CSS for Scalable Images

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Apply this CSS to ensure images behave as block-level elements with scalable content, facilitating responsiveness. It sets images to fill their container width while maintaining aspect ratio.

```css
img {
  display: block;
  max-width: 100%;
  width: 100%;
  height: auto;
}
```

--------------------------------

### Build Sanity CDN Query Parameters with buildQueryParams

Source: https://context7.com/coreyward/sanity-image/llms.txt

Use this function to generate Sanity Image API query parameters. It handles default settings and can be customized with explicit dimensions, modes, crop, and hotspot data. Include options for metadata if needed.

```typescript
import { buildQueryParams } from "@sanity-image/url-builder"

// Defaults: contain mode, no crop/hotspot, half-width of source
buildQueryParams({ id: "image-abc123-1000x1000-jpg" })
// → { w: 500, fit: "max", q: 75, auto: "format" }
```

```typescript
// Explicit width in contain mode — height is derived from aspect ratio, not sent as param
buildQueryParams({ id: "image-abc123-1000x1000-jpg", width: 300, height: 200 })
// → { w: 200, fit: "max", q: 75, auto: "format" }  (height reduces effective width)
```

```typescript
// Cover mode with crop and hotspot
buildQueryParams({
  id: "image-abc123-1000x1000-jpg",
  width: 375,
  height: 100,
  mode: "cover",
  hotspot: { x: 0.25, y: 0.25 },
})
// → { "fp-x": 0.25, "fp-y": 0.25, w: 375, h: 100, fit: "crop", q: 75, auto: "format" }
```

```typescript
// With crop — adds rect param, adjusts hotspot relative to post-crop area
buildQueryParams({
  id: "image-abc123-1000x1000-jpg",
  crop: { top: 0, bottom: 0.25, left: 0, right: 0.25 },
  width: 375,
  height: 100,
  mode: "cover",
  hotspot: { x: 0.25, y: 0.25 },
})
// → { rect: "0,0,750,750", "fp-x": 0.333, "fp-y": 0.333, w: 375, h: 100, fit: "crop", q: 75, auto: "format" }
```

```typescript
// Include output metadata (used internally by buildSrc)
buildQueryParams({
  id: "image-abc123-1000x1000-jpg",
  width: 500,
  options: { includeMetadata: true },
}).metadata
// → { sourceDimensions: { width: 1000, height: 1000, aspectRatio: 1 },
//     outputDimensions: { width: 500, height: 500, aspectRatio: 1 } }
```

--------------------------------

### `queryParams` — Direct Sanity Image API Parameters

Source: https://context7.com/coreyward/sanity-image/llms.txt

The `queryParams` prop accepts an object of Sanity CDN transformation parameters to merge into the generated URL. All keys are sorted alphabetically in the final query string to maximize CDN cache hit rates.

```APIDOC
## `queryParams` — Direct Sanity Image API Parameters

The `queryParams` prop accepts an object of Sanity CDN transformation parameters to merge into the generated URL. All keys are sorted alphabetically in the final query string to maximize CDN cache hit rates.

```tsx
import { SanityImage } from "sanity-image"

// All supported queryParams options:
<SanityImage
  id="image-abc123-1200x800-jpg"
  baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
  width={600}
  queryParams={{
    q: 85,          // Quality 0–100 (default: 75)
    sharp: 30,      // Sharpening 0–100
    blur: 5,        // Blur 1–2000
    sat: -100,      // Grayscale (only supported value: -100)
    flip: "hv",     // Flip: "h" | "v" | "hv"
    fm: "webp",     // Force format: "jpg" | "pjpg" | "png" | "webp"
                    // Note: setting fm disables auto=format (AVIF negotiation)
  }}
  alt="Stylized photo"
/>
// Resulting URL:
// ...abc123-1200x800.jpg?blur=5&fit=max&flip=hv&fm=webp&q=85&sat=-100&sharp=30&w=600
```
```

--------------------------------

### Minimal SanityImage Component Usage

Source: https://context7.com/coreyward/sanity-image/llms.txt

Renders an image with default settings for mode, lazy loading, alt text, quality, and format. Requires an image ID and either a baseUrl or projectId/dataset.

```tsx
import { SanityImage } from "sanity-image"

// Minimal usage — defaults to contain mode, lazy loading, empty alt, q=75, auto=format
<SanityImage
  id="image-abc123def456-1200x800-jpg"
  baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
  width={600}
  alt="A descriptive alt text"
/>
// Renders: <img src="...abc123def456-1200x800.jpg?auto=format&fit=max&q=75&w=600"
//               srcset="...w=300 300w, ...w=600 600w, ...w=900 900w, ...w=1200 1200w"
//               width="600" height="400" alt="A descriptive alt text" loading="lazy">
```

--------------------------------

### Full-Featured SanityImage Component Usage

Source: https://context7.com/coreyward/sanity-image/llms.txt

Configures image display with cover mode, hotspot, crop, LQIP preview, custom query parameters, and explicit HTML attributes. Supports overriding default loading behavior and providing sizes for responsive images.

```tsx
// Full-featured: cover mode with hotspot, crop, LQIP preview, custom query params
<SanityImage
  id={image._id}                           // e.g. "image-abc123-1200x800-jpg"
  baseUrl="https://cdn.sanity.io/images/abcd1234/production/"
  width={500}
  height={500}
  mode="cover"                             // crop to fill 500×500; default is "contain"
  hotspot={{ x: 0.6, y: 0.3 }}            // focal point from Sanity Studio (0–1)
  crop={{ top: 0, bottom: 0.1, left: 0.05, right: 0 }} // fractional crop from Sanity
  preview={image.asset.metadata.lqip}     // base64 LQIP string → triggers ImageWithPreview
  queryParams={{ q: 80, sharp: 20 }}       // override quality, add sharpening
  loading="eager"                          // override default lazy loading for above-fold
  htmlWidth={500}                          // override rendered width="" attribute
  htmlHeight={500}                         // override rendered height="" attribute
  htmlId="hero-img"                        // override rendered id="" attribute
  alt="Sweet Christmas!"
  className="hero-image"
  sizes="(min-width: 600px) 500px, 100vw"
/>
```

--------------------------------

### Build a Single Image URL with buildSrc

Source: https://context7.com/coreyward/sanity-image/llms.txt

Use `buildSrc` to generate a complete Sanity CDN URL along with computed dimensions. This is useful for non-React environments or when you need the URL string directly. It supports various options like `mode`, `crop`, `hotspot`, and custom `queryParams`.

```ts
import { buildSrc } from "sanity-image"
// or from the standalone package:
import { buildSrc } from "@sanity-image/url-builder"

const result = buildSrc({
  id: "image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png",
  baseUrl: "https://cdn.sanity.io/images/abcd1234/production/",
  width: 500,
  mode: "contain", // default
})
// result:
// {
//   src: "https://cdn.sanity.io/images/abcd1234/production/79f37b3f...png?auto=format&fit=max&q=75&w=500",
//   width: 500,
//   height: 500,
// }
```

```ts
// With crop + cover mode
const cropped = buildSrc({
  id: "image-abc123-1200x800-jpg",
  baseUrl: "https://cdn.sanity.io/images/abcd1234/production/",
  width: 400,
  height: 400,
  mode: "cover",
  crop: { top: 0, bottom: 0.2, left: 0, right: 0.1 },
  hotspot: { x: 0.5, y: 0.3 },
  queryParams: { q: 85 },
})
// cropped.src includes: ?auto=format&fit=crop&fp-x=...&fp-y=...&h=400&q=85&rect=...
// cropped.width  → 400
// cropped.height → 400
```

--------------------------------

### Sanity Image Cover Mode for Matching Heights

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

Utilize `mode="cover"` to ensure images within a grid match a specified height while filling the column width. This is useful for maintaining a consistent aspect ratio, like 3:2, even with varying source image dimensions.

```jsx
<SanityImage
  id={imageId}
  baseUrl="..."
  width={390}
  height={260}
  mode="cover"
  sizes="(min-width: 1240px) 390px, calc((100vw - 40px - 30px) / 3)"
/>
```

--------------------------------

### Sanity Image CSS Loading Styles

Source: https://github.com/coreyward/sanity-image/blob/main/README.md

These are the default CSS styles applied to the full-size image while it is loading. Ensure the image is visible to trigger native browser deferred loading.

```css
position: absolute;
width: 10px !important; /* must be > 4px to be lazy loaded */
height: 10px !important; /* must be > 4px to be lazy loaded */
opacity: 0;
zindex: -10;
pointerevents: none;
userselect: none;
```

--------------------------------

### `buildQueryParams` — Build Sanity CDN query parameter object

Source: https://context7.com/coreyward/sanity-image/llms.txt

The internal function that computes the full set of Sanity Image API query parameters from high-level inputs. Can be used directly for custom URL-building pipelines or for inspecting what parameters will be sent.

```APIDOC
## `buildQueryParams` — Build Sanity CDN query parameter object

The internal function that computes the full set of Sanity Image API query parameters from high-level inputs. Can be used directly for custom URL-building pipelines or for inspecting what parameters will be sent.

```ts
import { buildQueryParams } from "@sanity-image/url-builder"

// Defaults: contain mode, no crop/hotspot, half-width of source
buildQueryParams({ id: "image-abc123-1000x1000-jpg" })
// → { w: 500, fit: "max", q: 75, auto: "format" }

// Explicit width in contain mode — height is derived from aspect ratio, not sent as param
buildQueryParams({ id: "image-abc123-1000x1000-jpg", width: 300, height: 200 })
// → { w: 200, fit: "max", q: 75, auto: "format" }  (height reduces effective width)

// Cover mode with crop and hotspot
buildQueryParams({
  id: "image-abc123-1000x1000-jpg",
  width: 375,
  height: 100,
  mode: "cover",
  hotspot: { x: 0.25, y: 0.25 },
})
// → { "fp-x": 0.25, "fp-y": 0.25, w: 375, h: 100, fit: "crop", q: 75, auto: "format" }

// With crop — adds rect param, adjusts hotspot relative to post-crop area
buildQueryParams({
  id: "image-abc123-1000x1000-jpg",
  crop: { top: 0, bottom: 0.25, left: 0, right: 0.25 },
  width: 375,
  height: 100,
  mode: "cover",
  hotspot: { x: 0.25, y: 0.25 },
})
// → { rect: "0,0,750,750", "fp-x": 0.333, "fp-y": 0.333, w: 375, h: 100, fit: "crop", q: 75, auto: "format" }

// Include output metadata (used internally by buildSrc)
buildQueryParams({
  id: "image-abc123-1000x1000-jpg",
  width: 500,
  options: { includeMetadata: true },
}).metadata
// → { sourceDimensions: { width: 1000, height: 1000, aspectRatio: 1 },
//     outputDimensions: { width: 500, height: 500, aspectRatio: 1 } }
```
```