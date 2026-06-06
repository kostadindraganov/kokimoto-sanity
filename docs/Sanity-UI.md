### Install @sanity/ui and Peer Dependencies

Source: https://github.com/sanity-io/ui/blob/main/README.md

Install the @sanity/ui package and its required peer dependencies using npm.

```sh
npm install @sanity/ui

# Install peer dependencies
npm install react react-dom styled-components
```

--------------------------------

### Setup ThemeProvider for Sanity UI

Source: https://context7.com/sanity-io/ui/llms.txt

Wrap your application in ThemeProvider and build a theme using buildTheme(). The scheme prop controls the color context.

```tsx
import {ThemeProvider, studioTheme} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import {createRoot} from 'react-dom/client'

const theme = buildTheme()

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme} scheme="light">
    <App />
  </ThemeProvider>
)
```

--------------------------------

### Button Examples with Various Props

Source: https://context7.com/sanity-io/ui/llms.txt

Demonstrates different configurations of the Button component, including text, icons, loading states, tones, and modes. Ensure necessary imports from '@sanity/ui' and '@sanity/icons'.

```tsx
import {Button} from '@sanity/ui'
import {AddIcon, TrashIcon} from '@sanity/icons'

function ButtonExamples() {
  const [loading, setLoading] = React.useState(false)

  const handleSave = async () => {
    setLoading(true)
    await saveData()
    setLoading(false)
  }

  return (
    <Flex gap={2}>
      {/* Default filled button */}
      <Button text="Save" tone="primary" onClick={handleSave} loading={loading} />

      {/* Ghost (bleed) mode */}
      <Button text="Cancel" mode="bleed" />

      {/* Outlined mode with icon */}
      <Button
        text="Add item"
        mode="ghost"
        icon={AddIcon}
        tone="default"
      />

      {/* Icon-only destructive button */}
      <Button
        aria-label="Delete"
        icon={TrashIcon}
        mode="bleed"
        tone="critical"
        padding={2}
      />

      {/* Full-width button */}
      <Button text="Submit form" width="fill" type="submit" />
    </Flex>
  )
}
```

--------------------------------

### Basic Usage of @sanity/ui Button Component

Source: https://github.com/sanity-io/ui/blob/main/README.md

Demonstrates how to import and use the Button component within a ThemeProvider. Ensure you have React, ReactDOM, and styled-components installed as peer dependencies.

```jsx
import {Button, ThemeProvider} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'
import {createRoot} from 'react-dom/client'

const root = createRoot(document.getElementById('root'))
const theme = buildTheme()

root.render(
  <ThemeProvider theme={theme}>
    <Button text="Hello, world" />
  </ThemeProvider>,
)
```

--------------------------------

### Avatar and AvatarStack Examples

Source: https://context7.com/sanity-io/ui/llms.txt

Shows how to use the Avatar component for displaying user images or initials, and AvatarStack for representing multiple collaborators. Import Avatar and AvatarStack from '@sanity/ui'.

```tsx
import {Avatar, AvatarStack, Flex} from '@sanity/ui'

function AvatarExamples() {
  return (
    <Flex gap={2} align="center">
      {/* Image avatar */}
      <Avatar
        src="https://example.com/user.jpg"
        title="Jane Doe"
        size={1}
      />

      {/* Initials fallback with color */}
      <Avatar initials="JD" color="blue" title="John Doe" size={2} />

      {/* Avatar stack for showing multiple collaborators */}
      <AvatarStack maxLength={3}>
        <Avatar initials="A" color="red" title="Alice" />
        <Avatar initials="B" color="green" title="Bob" />
        <Avatar initials="C" color="purple" title="Carol" />
        <Avatar initials="D" color="orange" title="Dave" />
      </AvatarStack>
    </Flex>
  )
}
```

--------------------------------

### Text Component Typography Examples

Source: https://context7.com/sanity-io/ui/llms.txt

Shows how to use the Text component for different typographic styles, including size, weight, muted, accent, and text overflow. Requires importing Text and Stack from '@sanity/ui'.

```tsx
import {Text, Stack} from '@sanity/ui'

function TypographyExample() {
  return (
    <Stack gap={2}>
      <Text size={4} weight="bold">Large bold text</Text>
      <Text size={2}>Body text (default)</Text>
      <Text size={1} muted>Small muted helper text</Text>
      <Text size={2} accent>Accent colored text</Text>
      {/* Truncate with ellipsis */}
      <Text size={2} textOverflow="ellipsis" style={{maxWidth: 200}}>
        This is a very long text that will be truncated with an ellipsis symbol
      </Text>
    </Stack>
  )
}
```

--------------------------------

### Observe Element Size with useElementSize

Source: https://context7.com/sanity-io/ui/llms.txt

This hook subscribes to the live size of a DOM element using `ResizeObserver`. Pass the element's ref to the hook to get its dimensions. The size object contains `border`, `padding`, and `content` dimensions.

```tsx
import {useElementSize} from '@sanity/ui'
import {useRef} from 'react'

function ResponsivePanel() {
  const [ref, setRef] = useRef<HTMLDivElement>(null)
  const size = useElementSize(ref.current)

  return (
    <div ref={ref} style={{width: '100%', padding: 16}}>
      <p>Width: {size?.border.width ?? '—'}px</p>
      <p>Height: {size?.border.height ?? '—'}px</p>
    </div>
  )
}
```

--------------------------------

### Transition from Beta to Main

Source: https://github.com/sanity-io/ui/blob/main/CONTRIBUTING.md

Follow these steps to transition from a beta release to the main branch. This involves creating a new release branch and preparing a pull request.

```sh
git checkout beta
git pull --rebase
fetch origin main
git rebase origin/main
git push origin beta # optional

git checkout -b v2 # make a new release branch
git reset --hard beta
git push origin v2
# make a PR to `main`
```

--------------------------------

### Transition from Alpha to Beta

Source: https://github.com/sanity-io/ui/blob/main/CONTRIBUTING.md

Use these commands to transition from an alpha release to a beta release. Ensure you pull and rebase to keep your branches up-to-date.

```sh
git checkout alpha
git pull --rebase
git fetch origin main
git rebase origin/main
git push origin alpha # optional

git checkout beta
git reset --hard alpha
git push origin main
```

--------------------------------

### Dropdown Menu with Actions

Source: https://context7.com/sanity-io/ui/llms.txt

Creates a dropdown menu system using MenuButton, Menu, and MenuItem components. Includes a divider and an icon for a delete action with critical tone. Requires @sanity/icons for icons.

```tsx
import {MenuButton, Menu, MenuItem, MenuDivider, Button} from '@sanity/ui'
import {CopyIcon, TrashIcon, EditIcon} from '@sanity/icons'

function DocumentMenu() {
  return (
    <MenuButton
      id="doc-menu"
      button={<Button text="Actions" mode="ghost" />}
      menu={
        <Menu>
          <MenuItem text="Edit" icon={EditIcon} />
          <MenuItem text="Duplicate" icon={CopyIcon} />
          <MenuDivider />
          <MenuItem text="Delete" icon={TrashIcon} tone="critical" />
        </Menu>
      }
      placement="bottom-end"
    />
  )
}
```

--------------------------------

### Box Component for Layout

Source: https://context7.com/sanity-io/ui/llms.txt

The foundational layout wrapper. Accepts responsive props for display, margin, and padding. All layout primitives build on Box.

```tsx
import {Box} from '@sanity/ui'

// Responsive padding: 2 on small, 4 on medium and above
// margin array maps to breakpoints
function Example() {
  return (
    <Box
      padding={[2, 3, 4]}
      marginBottom={3}
      display="flex"
      overflow="hidden"
    >
      Content
    </Box>
  )
}
```

--------------------------------

### Attach Global Keydown Listener with useGlobalKeyDown

Source: https://context7.com/sanity-io/ui/llms.txt

This hook attaches a global `keydown` listener to the `window` while the component is mounted. Use `useCallback` to memoize the event handler for performance.

```tsx
import {useGlobalKeyDown} from '@sanity/ui'
import {useCallback} from 'react'

function KeyboardShortcuts() {
  useGlobalKeyDown(
    useCallback((event: KeyboardEvent) => {
      if (event.metaKey && event.key === 's') {
        event.preventDefault()
        saveDocument()
      }
    }, []),
  )

  return null
}
```

--------------------------------

### Detect OS Dark Mode Preference with usePrefersDark

Source: https://context7.com/sanity-io/ui/llms.txt

Use this hook to detect the user's operating system dark mode preference. It relies on the `prefers-color-scheme` media query. Wrap your app in `ThemeProvider` and pass the hook's return value to the `scheme` prop.

```tsx
import {usePrefersDark, ThemeProvider, studioTheme} from '@sanity/ui'
import {buildTheme} from '@sanity/ui/theme'

const theme = buildTheme()

function ThemedApp() {
  const prefersDark = usePrefersDark()

  return (
    <ThemeProvider theme={theme} scheme={prefersDark ? 'dark' : 'light'}>
      <App />
    </ThemeProvider>
  )
}
```

--------------------------------

### Tooltip Component

Source: https://context7.com/sanity-io/ui/llms.txt

Displays informational content on hover or focus. Supports placement, delay, arrow, animation, and portal rendering. Requires importing Tooltip, Button, Text, and an icon component.

```tsx
import {Tooltip, Button, Text} from '@sanity/ui'
import {InfoOutlineIcon} from '@sanity/icons'

function TooltipExample() {
  return (
    <Tooltip
      content={<Text size={1} style={{padding: '8px'}}>This action is irreversible</Text>}
      placement="top"
      arrow
      delay={300}
      portal
    >
      <Button
        icon={InfoOutlineIcon}
        mode="bleed"
        padding={2}
        aria-label="More information"
      />
    </Tooltip>
  )
}
```

--------------------------------

### Skeleton Loader Placeholder

Source: https://context7.com/sanity-io/ui/llms.txt

Provides a loading placeholder component for use while content is fetching. Uses Skeleton components with inline styles for sizing and shape, and the 'animated' prop for a shimmering effect.

```tsx
import {Skeleton, Stack, Flex} from '@sanity/ui'

function SkeletonLoader() {
  return (
    <Stack gap={3} padding={4}>
      <Flex gap={3} align="center">
        {/* Circle skeleton for avatar */}
        <Skeleton style={{width: 40, height: 40, borderRadius: '50%'}} animated />
        <Stack gap={2} flex={1}>
          <Skeleton style={{height: 14, width: '60%'}} animated />
          <Skeleton style={{height: 12, width: '40%'}} animated />
        </Stack>
      </Flex>
      <Skeleton style={{height: 120}} animated />
    </Stack>
  )
}
```

--------------------------------

### Generate Default and Custom Themes with buildTheme

Source: https://context7.com/sanity-io/ui/llms.txt

The `buildTheme` function generates the default Sanity theme object compatible with `ThemeProvider`. It can be extended with custom overrides for properties like fonts. Pass a configuration object to `buildTheme` to customize.

```tsx
import {buildTheme} from '@sanity/ui/theme'
import {ThemeProvider} from '@sanity/ui'

// Default theme
const defaultTheme = buildTheme()

// Custom theme with overrides (see theme config shape)
const customTheme = buildTheme({
  fonts: {
    text: {family: '"Inter", system-ui, sans-serif'},
    heading: {family: '"Inter", system-ui, sans-serif'},
    mono: {family: '"Fira Code", monospace'},
  },
})

function Root() {
  return (
    <ThemeProvider theme={customTheme} scheme="light">
      <App />
    </ThemeProvider>
  )
}
```

--------------------------------

### Badge Component Tone Variants

Source: https://context7.com/sanity-io/ui/llms.txt

Demonstrates the Badge component with various tone variants for tagging or labeling resources. Requires importing Badge and Flex from '@sanity/ui'.

```tsx
import {Badge, Flex} from '@sanity/ui'

function BadgeExamples() {
  return (
    <Flex gap={2} align="center">
      <Badge tone="default">Default</Badge>
      <Badge tone="primary">Primary</Badge>
      <Badge tone="positive">Published</Badge>
      <Badge tone="caution">Draft</Badge>
      <Badge tone="critical">Error</Badge>
    </Flex>
  )
}
```

--------------------------------

### Spinner Component for Loading Indicators

Source: https://context7.com/sanity-io/ui/llms.txt

Demonstrates the Spinner component, an animated loading indicator, often used with text. Requires importing Spinner, Flex, and Text from '@sanity/ui'.

```tsx
import {Spinner, Flex, Text} from '@sanity/ui'

function LoadingState() {
  return (
    <Flex align="center" gap={2}>
      <Spinner muted />
      <Text muted size={1}>Loading…</Text>
    </Flex>
  )
}
```

--------------------------------

### TextInput with Icons and Validation

Source: https://context7.com/sanity-io/ui/llms.txt

Illustrates a TextInput component configured with an icon, placeholder, clear button, custom validation, and styling. Imports TextInput, Stack, Label from '@sanity/ui' and SearchIcon from '@sanity/icons'.

```tsx
import {TextInput, Stack, Label} from '@sanity/ui'
import {SearchIcon} from '@sanity/icons'
import {useState} from 'react'

function SearchField() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value
    setValue(v)
    setError(v.length > 50 ? 'Must be 50 characters or fewer' : '')
  }

  return (
    <Stack gap={2}>
      <Label htmlFor="search">Search</Label>
      <TextInput
        id="search"
        icon={SearchIcon}
        placeholder="Search documents…"
        value={value}
        onChange={handleChange}
        clearButton={value.length > 0}
        onClear={() => setValue('')}
        customValidity={error}
        radius={2}
      />
    </Stack>
  )
}
```

--------------------------------

### Heading Component Styles

Source: https://context7.com/sanity-io/ui/llms.txt

Illustrates the use of the Heading component for different levels of headings, supporting props similar to the Text component. Import Heading and Stack from '@sanity/ui'.

```tsx
import {Heading, Stack} from '@sanity/ui'

function Headings() {
  return (
    <Stack gap={3}>
      <Heading as="h1" size={5} weight="bold">Page Title (h1)</Heading>
      <Heading as="h2" size={3}>Section Heading (h2)</Heading>
      <Heading as="h3" size={1} muted>Subsection (h3)</Heading>
    </Stack>
  )
}
```

--------------------------------

### Container Component for Max-Width Content

Source: https://context7.com/sanity-io/ui/llms.txt

Wraps content in a max-width container. The width prop accepts a numeric index or responsive arrays.

```tsx
import {Container, Stack, Heading, Text} from '@sanity/ui'

function PageLayout() {
  return (
    <Container width={3}>
      <Stack gap={4}>
        <Heading size={4}>Page Title</Heading>
        <Text>Content constrained to a readable max-width.</Text>
      </Stack>
    </Container>
  )
}
```

--------------------------------

### Imperative Toast Notifications with useToast

Source: https://context7.com/sanity-io/ui/llms.txt

Allows imperative access to the toast context from any component within a ToastProvider. The useToast hook provides a `push` method to display success, error, or other types of toasts with customizable options like duration and closability.

```tsx
import {useToast} from '@sanity/ui'

function SaveButton() {
  const toast = useToast()

  const save = async () => {
    try {
      await api.save()
      toast.push({title: 'Saved!', status: 'success', duration: 3000})
    } catch (err) {
      toast.push({
        title: 'Error saving',
        description: err.message,
        status: 'error',
        closable: true,
      })
    }
  }

  return <Button text="Save" onClick={save} />
}
```

--------------------------------

### Handle Figma UI Button Clicks

Source: https://github.com/sanity-io/ui/blob/main/figma/src/index.html

Attaches click event listeners to buttons for writing variables, writing styles, and canceling operations. Sends messages to the parent Figma plugin.

```javascript
document.getElementById('vars-write').onclick = () => { parent.postMessage({pluginMessage: {type: 'vars:write'}}, '*') }
document.getElementById('styles-write').onclick = () => { parent.postMessage({pluginMessage: {type: 'styles:write'}}, '*') }
document.getElementById('cancel').onclick = () => { parent.postMessage({pluginMessage: {type: 'cancel'}}, '*') }
```

--------------------------------

### Toast / useToast Hook

Source: https://context7.com/sanity-io/ui/llms.txt

Push transient notification messages using the `useToast` hook. The app must be wrapped in `ToastProvider`. You can push new toasts or update existing ones using their ID.

```tsx
import {ToastProvider, useToast, Button, Stack} from '@sanity/ui'

// Provider must be inside ThemeProvider
function AppWithToasts() {
  return (
    <ToastProvider>
      <NotifyButton />
    </ToastProvider>
  )
}

function NotifyButton() {
  const toast = useToast()

  const handleSuccess = () => {
    toast.push({
      title: 'Document saved',
      description: 'Your changes have been published.',
      status: 'success',
      duration: 4000,
      closable: true,
    })
  }

  const handleError = () => {
    const id = toast.push({
      title: 'Save failed',
      description: 'Could not connect to the API.',
      status: 'error',
      closable: true,
    })
    // Update the same toast later:
    setTimeout(() => {
      toast.push({id, title: 'Retrying…', status: 'info'})
    }, 2000)
  }

  return (
    <Stack gap={2}>
      <Button text="Simulate success" tone="positive" onClick={handleSuccess} />
      <Button text="Simulate error" tone="critical" onClick={handleError} />
    </Stack>
  )
}
```

--------------------------------

### Styled Native Select Element

Source: https://context7.com/sanity-io/ui/llms.txt

Use this component to create a styled native select element with an icon. Ensure it's wrapped in a Stack component for proper layout.

```tsx
import {Select, Stack, Label} from '@sanity/ui'

function RoleSelect() {
  return (
    <Stack gap={2}>
      <Label htmlFor="role">Role</Label>
      <Select id="role" fontSize={2} padding={3} radius={2}>
        <option value="">— Select role —</option>
        <option value="admin">Administrator</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </Select>
    </Stack>
  )
}
```

--------------------------------

### Flex Component for Flexbox Layout

Source: https://context7.com/sanity-io/ui/llms.txt

A flexbox wrapper extending Box. Provides align, direction, justify, wrap, and gap as responsive props.

```tsx
import {Flex, Box} from '@sanity/ui'

function Row() {
  return (
    <Flex align="center" justify="space-between" gap={3} wrap="wrap">
      <Box>Left item</Box>
      <Box>Middle item</Box>
      <Box>Right item</Box>
    </Flex>
  )
}
```

--------------------------------

### Grid Component for CSS Grid Layout

Source: https://context7.com/sanity-io/ui/llms.txt

CSS grid layout component. Supports gridTemplateColumns, gridTemplateRows, gap, and other grid properties as responsive props.

```tsx
import {Grid, Card, Text} from '@sanity/ui'

function TwoColumnLayout() {
  return (
    // 1 column on mobile, 2 columns on larger screens
    <Grid gridTemplateColumns={[1, 1, 2]} gap={4}>
      <Card padding={4} radius={2} shadow={1}>
        <Text>Column 1</Text>
      </Card>
      <Card padding={4} radius={2} shadow={1}>
        <Text>Column 2</Text>
      </Card>
    </Grid>
  )
}
```

--------------------------------

### Popover Component

Source: https://context7.com/sanity-io/ui/llms.txt

A floating overlay positioned relative to a trigger. Supports placement, open state, content, portal, size constraints, and animation. Use `useState` to manage the open state.

```tsx
import {Popover, Button, Card, Stack, Text} from '@sanity/ui'
import {useState, useRef} from 'react'

function PopoverExample() {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      placement="bottom-start"
      content={
        <Card padding={3} radius={2}>
          <Stack gap={2}>
            <Text weight="semibold">Options</Text>
            <Text size={1} muted>Pick an action to perform.</Text>
          </Stack>
        </Card>
      }
      portal
      constrainSize
    >
      <Button
        text="Open popover"
        onClick={() => setOpen(o => !o)}
        selected={open}
      />
    </Popover>
  )
}
```

--------------------------------

### Accessible Tab Interface

Source: https://context7.com/sanity-io/ui/llms.txt

Implements an accessible tab interface using Tab, TabList, and TabPanel components, following the WAI-ARIA tab pattern. Requires state management to track the active tab and control panel visibility.

```tsx
import {Tab, TabList, TabPanel, Card, Stack} from '@sanity/ui'
import {useState} from 'react'

function TabbedContent() {
  const [activeTab, setActiveTab] = useState<'content' | 'preview' | 'settings'>('content')

  return (
    <Stack gap={0}>
      <TabList space={1}>
        <Tab
          id="tab-content"
          label="Content"
          aria-controls="panel-content"
          selected={activeTab === 'content'}
          onClick={() => setActiveTab('content')}
        />
        <Tab
          id="tab-preview"
          label="Preview"
          aria-controls="panel-preview"
          selected={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
        />
        <Tab
          id="tab-settings"
          label="Settings"
          aria-controls="panel-settings"
          selected={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </TabList>

      <TabPanel id="panel-content" aria-labelledby="tab-content" hidden={activeTab !== 'content'}>
        <Card padding={4}><Text>Content panel</Text></Card>
      </TabPanel>
      <TabPanel id="panel-preview" aria-labelledby="tab-preview" hidden={activeTab !== 'preview'}>
        <Card padding={4}><Text>Preview panel</Text></Card>
      </TabPanel>
      <TabPanel id="panel-settings" aria-labelledby="tab-settings" hidden={activeTab !== 'settings'}>
        <Card padding={4}><Text>Settings panel</Text></Card>
      </TabPanel>
    </Stack>
  )
}
```

--------------------------------

### Stack Component for Vertical Spacing

Source: https://context7.com/sanity-io/ui/llms.txt

Places children in a vertical stack with consistent gap spacing. Extends Box.

```tsx
import {Stack, Text} from '@sanity/ui'

function FormGroup() {
  return (
    <Stack gap={3}>
      <Text weight="semibold">Label</Text>
      <Text muted size={1}>Helper text below the label</Text>
    </Stack>
  )
}
```

--------------------------------

### Dialog Component

Source: https://context7.com/sanity-io/ui/llms.txt

A modal dialog with focus trapping and escape-to-close functionality. It includes header and footer slots and is rendered in a portal. Use `useState` to control its visibility.

```tsx
import {Dialog, Button, Stack, Text, Flex} from '@sanity/ui'
import {useState} from 'react'

function ConfirmDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button text="Delete document" tone="critical" onClick={() => setOpen(true)} />

      {open && (
        <Dialog
          id="confirm-delete"
          header="Confirm deletion"
          onClose={() => setOpen(false)}
          onClickOutside={() => setOpen(false)}
          width={1}
          footer={
            <Flex padding={3} gap={2} justify="flex-end">
              <Button text="Cancel" mode="bleed" onClick={() => setOpen(false)} />
              <Button text="Delete" tone="critical" onClick={() => {
                // perform delete
                setOpen(false)
              }} />
            </Flex>
          }
        >
          <Stack padding={4} gap={3}>
            <Text>Are you sure you want to delete this document?</Text>
            <Text muted size={1}>This action cannot be undone.</Text>
          </Stack>
        </Dialog>
      )}
    </>
  )
}
```

--------------------------------

### Autocomplete with Filtered Options

Source: https://context7.com/sanity-io/ui/llms.txt

Implements a typeahead/combobox component backed by a filtered options list rendered in a Popover. Requires state management for the selected value and a filter function to narrow down options.

```tsx
import {Autocomplete, Card, Text, Stack} from '@sanity/ui'
import {useState} from 'react'

const COUNTRIES = [
  {value: 'us', label: 'United States'},
  {value: 'gb', label: 'United Kingdom'},
  {value: 'ca', label: 'Canada'},
  {value: 'au', label: 'Australia'},
]

function CountryPicker() {
  const [value, setValue] = useState('')

  return (
    <Stack gap={2}>
      <Autocomplete
        id="country-picker"
        placeholder="Search country…"
        options={COUNTRIES}
        value={value}
        onChange={setValue}
        filterOption={(query, option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        }
        renderOption={(option) => (
          <Card as="button" padding={3}>
            <Text>{option.label}</Text>
          </Card>
        )}
        onQueryChange={(q) => console.log('query:', q)}
      />
      {value && <Text size={1} muted>Selected: {value}</Text>}
    </Stack>
  )
}
```

--------------------------------

### Card Component for Themed Surfaces

Source: https://context7.com/sanity-io/ui/llms.txt

A themed surface component that establishes a color context. Supports tone, scheme, border, radius, shadow, and interactive states.

```tsx
import {Card, Stack, Text, Heading} from '@sanity/ui'

function InfoCard() {
  return (
    <Card
      padding={4}
      radius={3}
      shadow={2}
      tone="primary"
      border
    >
      <Stack gap={2}>
        <Heading size={1}>Heads up</Heading>
        <Text muted size={1}>
          This card uses the primary tone, which cascades its colors to children.
        </Text>
      </Stack>
    </Card>
  )
}
```

```tsx
import {Card, Text} from '@sanity/ui'
import React from 'react'

// Interactive card rendered as a button
function SelectableCard() {
  const [selected, setSelected] = React.useState(false)

  return (
    <Card
      as="button"
      padding={3}
      radius={2}
      selected={selected}
      onClick={() => setSelected(s => !s)}
      tone="default"
    >
      <Text>{selected ? 'Selected' : 'Click to select'}</Text>
    </Card>
  )
}
```

--------------------------------

### Handle Click Outside Events with useClickOutsideEvent

Source: https://context7.com/sanity-io/ui/llms.txt

This hook fires a callback when a mousedown event occurs outside a specified set of elements. It's a preferred alternative to the deprecated `useClickOutside`. Ensure the element to monitor is passed as an array to the second argument.

```tsx
import {useClickOutsideEvent} from '@sanity/ui'
import {useRef, useState} from 'react'

function Dropdown() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutsideEvent(
    open ? () => setOpen(false) : false,
    () => [containerRef.current],
  )

  return (
    <div ref={containerRef}>
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
      {open && <div>Dropdown content</div>}
    </div>
  )
}
```