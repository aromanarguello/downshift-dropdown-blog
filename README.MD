
We first need to create our dropdown component. With typescript when we import react, we need need to import everything from the React library (`import * as React from 'react'). I know there are ways around this but there are no downsides to doing it this way. 

Downshift is exported as default component from the librar and it uses the Render props method to provide us with many features such as internal state management, incredible a11y methods, auto-complete methods, keyboard-navigation, and some other pretty cool stuff we will explore :)!

```jsx
import * as React from 'react'
import Downshift from 'downshift'

const Dropdown: React.FC = () => {
  return (
    <Downshift></Downshift>
  )
}
```

I always like to add styles right after and I love the `styled-components` library it is hands down my favorite css-in-js library. And with V5 Beast mode being released it is going to freaking sweeeter!

I've developed the convention to call my 


```jsx
import * as React from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'

const Input = styled.ul``

const Dropdown: React.FC = () => {
  return (
    <Downshift></Downshift>
  )
}
```
