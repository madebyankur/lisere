![Liseré - Liseré is a lightweight and composable React component for text highlighting.](/apps/docs/public/assets/og.png)

# Liseré

**Liseré** is a lightweight and composable React component for text highlighting. It gives you precise control over how users select, annotate, and interact with text. Perfect for code documentation, tutorials, and interactive text highlighting and selection.

## Install

To get started with the library, install it using:

```sh
# npm
npm install lisere
```

```sh
# yarn
yarn add lisere
```

```sh
# pnpm
pnpm add lisere
```

## Usage

```tsx
import { TextHighlighter } from 'lisere';

<TextHighlighter
  onTextHighlighted={selection => {
    console.log(selection.text)
  }}
  highlightStyle={{
    className: 'my-highlight',
    style: { backgroundColor: '#ffeb3b' },
  }}
>
  <p>Highlight this paragraph by selecting text.</p>
</TextHighlighter>
```

## Props

### `<TextHighlighter />`

| Prop                           | Type                                                     | Default  | Description                             |
| ------------------------------ | -------------------------------------------------------- | -------- | --------------------------------------- |
| `children`                     | `ReactNode`                                              | —        | Content to make highlightable           |
| `enabled`                      | `boolean`                                                | `true`   | Whether highlighting is active          |
| `containerElement`             | `keyof JSX.IntrinsicElements`                            | `'div'`  | Wrapper element for content             |
| `selectionBoundary`            | `'word' \| 'cursor'`                                     | `'word'` | Selection granularity                   |
| `highlightElement`             | `string`                                                 | `'span'` | Tag used to wrap highlighted content    |
| `highlightStyle`               | `{ className?: string; style?: CSSProperties }`          | —        | Styles applied to highlights            |
| `allowCrossElementSelection`   | `boolean`                                                | `false`  | Enable multi-node text selection        |
| `clearSelectionAfterHighlight` | `boolean`                                                | `true`   | Clears native selection after highlight |
| `removeHighlightOnClick`       | `boolean`                                                | `false`  | Click to remove highlights              |
| `selectedContent`              | `TextSelection[]`                                        | `[]`     | Preloaded highlights                    |
| `onTextSelected`               | `(selection: TextSelection) => void`                     | —        | Fires when text is selected             |
| `onTextHighlighted`            | `(selection: TextSelection) => void`                     | —        | Fires when highlight is confirmed       |
| `onHighlightRemoved`           | `(selection: TextSelection) => void`                     | —        | Fires when a highlight is removed       |
| `renderSelectionUI`            | `({ selection, modifyHighlight, onClose }) => ReactNode` | —        | Custom floating UI on selection         |

## Examples

### Basic Usage

```tsx
import { TextHighlighter } from 'lisere';

<TextHighlighter
  onTextHighlighted={selection => {
    console.log('Highlighted:', selection.text);
  }}
>
  <p>Select any text in this paragraph to highlight it.</p>
</TextHighlighter>
```

### Advanced Configuration

```tsx
<TextHighlighter
  allowCrossElementSelection={true}
  selectionBoundary="cursor"
  removeHighlightOnClick={true}
  highlightStyle={{
    className: 'custom-highlight',
    style: { backgroundColor: '#ffeb3b', padding: '2px' },
  }}
>
  <div>
    <p>Cross-element</p>
    <p>selection</p>
  </div>
</TextHighlighter>
```

### Custom Styling

```tsx
<TextHighlighter
  highlightStyle={{
    className: 'custom-class',
    style: { backgroundColor: '#4caf50', padding: '2px' },
  }}
>
  <p>Custom highlight appearance.</p>
</TextHighlighter>
```

### Custom Element Type

```tsx
<TextHighlighter highlightElement="mark">
  <p>Rendered as <mark> elements.</p>
</TextHighlighter>
```

### Floating Selection UI

```tsx
<TextHighlighter
  renderSelectionUI={({ selection, modifyHighlight, onClose }) => (
    <div className="selection-popup">
      <span>Highlight "{selection.text}"?</span>
      <button onClick={() => modifyHighlight(selection, false)}>Confirm</button>
      <button onClick={() => modifyHighlight(selection, true)}>Cancel</button>
      <button onClick={onClose}>Close</button>
    </div>
  )}
>
  <p>Select to trigger overlay UI.</p>
</TextHighlighter>
```

### Preloaded Content

```tsx
<TextHighlighter
  selectedContent={[
    { text: 'Liseré', startOffset: 0, endOffset: 6 },
    { text: 'highlighting', startOffset: 10, endOffset: 21 },
  ]}
/>
```

### Utility Functions

```tsx
import {
  getCurrentTextSelection,
  highlightRange,
  removeHighlight,
  findTextInElement,
} from 'lisere';

const container = document.getElementById('content');
const ranges = findTextInElement(container, 'search term');
ranges.forEach(range => {
  const highlight = highlightRange(range, 'span', {
    className: 'manual-highlight',
    style: { backgroundColor: 'yellow' },
  })
});

const selection = getCurrentTextSelection();
if (selection) {
  console.log('Selected text:', selection.text);
}

const highlightElement = document.querySelector('.highlight');
if (highlightElement) {
  removeHighlight(highlightElement);
}
```

### Error Handling

```tsx
const handleHighlightError = (error: Error) => {
  console.error('Highlight failed:', error);
  showNotification('Failed to highlight text', 'error');
}

<TextHighlighter
  onTextHighlighted={selection => {
    try {
      saveHighlight(selection);
    } catch (error) {
      handleHighlightError(error);
    }
  }}
>
  <p>Content with error handling.</p>
</TextHighlighter>
```

### Performance Optimization

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const { highlights, highlightText, clearHighlights } = useTextHighlighter({
  containerRef,
  highlightStyle: { className: 'optimized-highlight' },
})

const handleSearch = (searchTerm: string) => {
  highlightText(searchTerm);
}

const handleClear = () => {
  clearHighlights();
}
```

## Hook Usage

```tsx
import { useTextHighlighter } from 'lisere';

const {
  selection,
  highlights,
  highlightText,
  removeHighlight,
  clearHighlights,
} = useTextHighlighter({ containerRef });
```

## TypeScript

The following types are exposed from the package:

```ts
import {
  TextHighlighter,
  useTextHighlighter,
  TextSelection,
  HighlightStyle,
} from 'lisere';
```
