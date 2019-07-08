
We first need to create our dropdown component. With typescript when we import react, we need need to import everything from the React library (`import * as React from 'react'). I know there are ways around this but there are no downsides to doing it this way. 

Downshift is exported as default component from the librar and it uses the Render props method to provide us with many features such as internal state management, incredible a11y methods, auto-complete methods, keyboard-navigation, and some other pretty cool stuff we will explore :)!

```jsx
import * as React from 'react'
import Downshift from 'downshift'

// mock object that we will use to represent actual dropdown options
const data = [
  { item: "One" },
  { item: "Two" },
  { item: "Three" },
  { item: "Four" },
  { item: "Five" }
]

const Dropdown: React.FC = () => {  // we declare our dropdown as Functional                                           // Component type. Still no props to declare
  return (
    <Downshift></Downshift>
  )
}

export default Dropdown
```

I always like to add styles right after and I love the `styled-components` library it is hands down my favorite css-in-js library. And with V5 Beast mode being released it is going to freaking sweeeter!

I've developed the convention to call my autocomplete section of the dropdown just Input. This is personal preference.


```jsx
import * as React from 'react'
import Downshift from 'downshift'
import styled from 'styled-components'

const Input = styled.input`
  width: 100px;
  border: 1px solid black;
`;

const Dropdown: React.FC = () => {
  return (
    <Downshift></Downshift>
  )
}

export default Dropdown
```

Now, about the Render props method. We will destructure from downshift a few methods first, some of them return an object which inserts all those nice aria props into our component to make it accessible. They might also contain event handlers that will all either give you control or operate behind the scenes. Downshifts prefers that we provide hem this spread this objects as props

- `{...getInputProps()}` will provide the input tag with an object that contains all the needed props for it be fully accessible such as `aria-autocomplete`, `aria-controls`, `aria-label`, etc.

- Note, if I would have wrapped my component (everything between `<Downshift>)

- Because we are wrapping our dropdown in a `<Form>` composed styled component, we need to destructure and spread `{...getRootProps()}` inside the `<Form>`

```jsx
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid black;
`;


const Dropdown: React.FC = () => {
  return (
    <Downshift>
      {({ getInputProps, getRootProps }) => (
        <Form {...getRootProps()}>
          <Input {...getInputProps()} />
        </Form>
      )}
    </Downshift>
  );
};

export default Dropdown;
```

Right after the input, I create the actual dropdown options section of the dropdown. I call the `<ul>` = `<Menu>` and `<li>` = `<Item>`

We will later map over the `<Item>` to produce a nice menu full of cool items.

Similarly, we will destructure `getMenuProps` from `Downshift` and then spread it as a prop inside of `Menu`. This method will handle adding all the correct aria roles and props.

By default the menu will add an aria-labelledby that refers to the `<label>`. But, you can provide aria-label to give a more specific label that describes the options available.

```jsx
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid black;
`;

const Menu = styled.ul`
  width: 100%;
  border: 1px solid black;
`;
const Item = styled.li`
  list-style: none;
`;

const Dropdown: React.FC = () => {
  return (
    <Downshift>
      {({ getInputProps, getMenuProps, getRootProps }) => (
        <Form {...getRootProps()}>
          <Input {...getInputProps()} />
          <Menu {...getMenuProps()}>
            <Item>First Item</Item>
          </Menu>
        </Form>
      )}
    </Downshift>
  );
};

export default Dropdown;
```

Now, we need to give `<Item>` all its awesome features. We can achieve this with
with another method that Downshift provides us with: `getInputProps`, however, this time we are dealing with an impure function (only call it when you apply props to an item). Same as the previous methods, we will spread into `<Item>`. However, this time the method takes in an object as an argument. It takes different properties, of which only one is required: `item` and it is the value that will be selected when the user selects clicks or selects on an item. Another property, which is not required, is index. We provide index to `getItemProps()` because this is how Downshift keeps track of which item is selected and something we will explore later, `highlightedIndex`.

The most efficient way to achieve our dropdown options is to iterate over an array. I usually choose and array of objects since an object can fit more key/value pairs.

At this point we can start setting up the first prop for the component. I usually create my interface and assign it to `React.FC`. For dropdowns, I like to call the array: `options`.

```jsx
import * as React from "react";
import Downshift from "downshift";
import styled from "styled-components";

type OptionType = {
  value?: string;
};

// it is considered best practice to append the 'I' Prefix to interfaces
interface IDropdownProps { 
  options: OptionType[];
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid black;
`;

const Menu = styled.ul`
  width: 100%;
  padding: 0;
`;
const Item = styled.li`
  list-style: none;
  width: 100%;
`;

const Dropdown: React.FC<IDropdownProps> = ({ options }) => { // add IDropdownProps
  return (
    <Downshift>
      {({ getInputProps, getMenuProps, getRootProps, getItemProps }) => (
        <Form {...getRootProps()}>
          <Input {...getInputProps()} />
          <Menu {...getMenuProps()}>
            {options.map((item, index) => ( // we map over the options array
              <Item {...getItemProps({
                item: item,
                index: index
              })}>{item.value}</Item>
            ))}
          </Menu>
        </Form>
      )}
    </Downshift>
  );
};

export default Dropdown;

```