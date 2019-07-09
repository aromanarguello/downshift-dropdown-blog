Since the moment I laid my hands on Downshift I knew the amazing potential this library has. Nowadays many of us, don't think about the importance of accessibility. Downshift amazingly solves this in many ways. I ran into this article: https://baymard.com/blog/custom-dropdowns-cause-issues once and it states that 31% of custom dropdowns have issues, and I can see why. 

I've had to build a few dropdowns with just JSX and they are tough, and they are tough with so many edge cases to cover. Accessibility things such as keyboard navigation and ARIA standards. And not to mention the bugs I've introduced lol! It can become complicated to build them out yourself. 

This is one of those scenarios where you have 2 options, build it from scratch or leverage a library like Downshift, the tradeoff is not even fair. This library handles everything if you need to build a dropdown. It comes equipped with full blown out of the box keyboard navigation, all the correct aria props, and manages its internal state. But, you also have the override many many parts of it.

I added a dropdown to a storybook which had an `a11y` addon (if you don't know what it is, it tells you a11y stats about your components), and it passed 15 different aria-standards with flying colors, oh and 0 violations.

Using Downshift will undoubtedly save you and your teammates time when building out many components. It once took me a week to implement an autocomplete dropdown. Now I can make one in 45 minutes :)! This library is amazing, I hope you give it a try and enjoy it!

Any feedback is much-appreciated :D!

You can reach me at www.alejandroroman.io!



We first need to create our dropdown component. With typescript when we import react, we need need to import everything from the React library (`import * as React from 'react'`). I know there are ways around this but there are no downsides to doing it this way. 

Downshift is exported as default component from the library and it uses the Render props method to provide us with many features such as internal state management, incredible a11y methods, auto-complete methods, keyboard-navigation, and some other pretty cool stuff we will explore :)!

Note: if you try to run it at this step, Downshift will throw an error. This is because Downshift needs to render a DOM element.

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

const Dropdown: React.FC = () => { 
   // we declare our dropdown as Functional
   // Component type. Still no props to declare
  return (
    <Downshift></Downshift>
  )
}

export default Dropdown
```

I always like to add styles right after and I love the `styled-components` library it is hands down my favorite css-in-js library. And with V5 Beast mode being released it is going to freaking sweeeter!

I've developed the convention to call my autocomplete section of the dropdown just Input. This is a personal preference.


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

Now, about the Render props method. We will destructure from Downshift a few methods first, some of them return an object which inserts all those nice aria props into our component to make it accessible. They might also contain event handlers that will all either give you control or operate behind the scenes. Downshifts prefers that we provide hem this spread these objects as props

- `{...getInputProps()}` will provide the input tag with an object that contains all the needed props for it be fully accessible such as `aria-autocomplete`, `aria-controls`, `aria-label`, etc.

- Note, if I would have wrapped my component (everything between `<Downshift>`)

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

By default, the menu will add an `aria-labelledby` that refers to the `<label>`. But, you can provide aria-label to give a more specific label that describes the options available.

```jsx
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100px;
  margin: 0;
  padding: 0;
`;

const Input = styled.input`
  width: 80px;
  margin-left: 37px;
  border: 1px solid black;
`;

const Menu = styled.ul`
  width: 80px;
  padding: 0;
  margin: 0;
  border: 1px solid;
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
with another method that Downshift provides us with: `getInputProps`, however, this time we are dealing with an impure function (only call it when you apply props to an item). Same as the previous methods, we will spread into `<Item>`. However, this time the method takes in an object as an argument. It takes different properties, of which only one is required: `item` and it is the value that will be selected when the user selects clicks or selects (with keyboard) on an item. Another property, which is not required, is index. We provide an index to `getItemProps()` because this is how Downshift keeps track of which item is selected and something we will explore later, `highlightedIndex`.

The most efficient way to achieve our dropdown options is to iterate over an array. I usually choose an array of objects since an object can fit more key/value pairs.

At this point, we can start setting up the first prop for the component. I usually create my interface and assign it to `React.FC`, this way we tell what kind of shape the prop can expect. For dropdowns, I like to call the array: `options`.

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
  onChange?: (selectedItem: string) => void; // this is for later
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
                item,
                index,
                key: item.value
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

About that internal state management, we were speaking of earlier... Downshift manages its own internal state for toggling the dropdown menu between open and closed. We will destructure `isOpen` from Downshift, which is defaulted to `false`, and it is handled its state is handled completely internally. By now, we can click into the input and type something and that will also toggle the `isOpen` to true and open the menu. By default, Downshift has the feature to close the menu when you click outside of its range.

In order to have a visual queue of what Item we are on we will destructure `highlightedIndex` from Downshift. We will add a new key as an argument in the `{...getItemProps()}` method, `style`. The style will allow us to inject CSS properties to the current item. So, we basically tell it hey if the current index of the item you are on is equal to the `highlightedIndex` (handled by Downshift), make the selection light gray.

Just like that, now we can click into the input, type a letter, the dropdown should open, and you can have keyboard navigation. WOOT WOOT! Yup another benefit of Downshift, full on out of the box keyboard navigation! How sweet is that?!

```jsx
const Dropdown: React.FC<IDropdownProps> = ({ options }) => {
  return (
    <Downshift>
      {({
        getInputProps,
        getMenuProps,
        getRootProps,
        getItemProps,
        isOpen,
        highlightedIndex
      }) => (
        <Form {...getRootProps()}>
          <Input {...getInputProps()} />
          <Menu {...getMenuProps()}>
            {isOpen &&
              options.map((item, index) => (
                <Item
                  {...getItemProps({
                    style: {
                      backgroundColor:
                        index === highlightedIndex ? "lightgray" : null
                    },
                    key: item.value,
                    item,
                    index
                  })}
                >
                  {item.value}
                </Item>
              ))}
          </Menu>
        </Form>
      )}
    </Downshift>
  );
};
```

How about we add a button so we can open and close it with a click from our mouse?
For simplicity sake, I will add a simple button and provide it with the event listener methods that the library gives us. I will just add a button because the take away here is how Downshift handles these types of events, all of which are overridable with things like `stateReducer`

We will destructure `getToggleButtonProps` method from Downshift and spread it `{...getToggleButtonProps()}` in the `<Button>` as a prop. This method will do a couple of things for us. It will give the button all its appropriate roles and aria props, but its main function is to toggle that internal state of the `isOpen` we destructured earlier, so in essence, it will allow us to open and close the menu with a click!


```jsx
// Button
const Button = styled.button`
  width: 20px;
  text-align: center;
  padding: 0;
`;
// Added this to align input and button :)
const InputContainer = styled.div`
  display: flex;
`;

const Dropdown: React.FC<IDropdownProps> = ({ options }) => {
  return (
    <Downshift>
      {({
        getInputProps,
        getMenuProps,
        getRootProps,
        getItemProps,
        getToggleButtonProps, // this is what we destructure
        isOpen,
        highlightedIndex
      }) => (
        <Form {...getRootProps()}>
          <InputContainer>
            <Input {...getInputProps()} />
            <Button {...getToggleButtonProps()}>{isOpen ? "-" : "+"} . 
            </Button> 
             // here is where we speread it 
          </InputContainer>
          <Menu {...getMenuProps()}>
            {isOpen &&
              options
              .map((item, index) => (
                <Item
                  {...getItemProps({
                    style: {
                      backgroundColor:
                        index === highlightedIndex ? "lightgray" : null
                    },
                    key: item.value,
                    item,
                    index
                  })}
                >
                  {item.value}
                </Item>
              ))}
          </Menu>
        </Form>
      )}
    </Downshift>
  );
};
```

Sweet! So now we have a dropdown that opens and closes, it has some options, and we can navigate up and down through those options with the keyboard. Now we need to add the filtering functionality. So that we can type into our `<Input>` and narrow down our search!

We need to destructure `inputValue` from Downshift. This holds the initial value when the component is initialized.

Now, we've added the functionality to narrow down our searches based on the letter entered

Additionally, we need to add a prop called `itemToString` to `<Downshift>`. Downshift uses this to handle the value for the selected item. Without this, when we select an item either by click or enter, the `<Input`> component would be populated by the string `[object Object]` and of course we wouldn't want that. In essence, it is what ultimately leads to the string value of the input field. Either an item selected or an empty string, or a place holder of choice

I personally prefer to make it as close as possible as the `<select><option>` API. So, next, I like to add the `event listener` for event changes.

```jsx
const Dropdown: React.FC<IDropdownProps> = ({ options, onChange }) => {
  return (
    <Downshift 
      onChange={selectedItem => onChange(selectedItem ? selectedItem.value : "")} 
      itemToString={item => (item ? item.value : "")}
    >
      {({
        getInputProps,
        getMenuProps,
        getRootProps,
        getItemProps,
        getToggleButtonProps,
        isOpen,
        highlightedIndex,
        inputValue,          // we destructure this from Downshift
        clearSelection       // add this to clear the currently selected item
      }) => (
        <Form {...getRootProps()}>
          <InputContainer>
            <Input {...getInputProps()} />
            <Button {...getToggleButtonProps()}>
              {isOpen ? "-" : "+"}
            </Button>
             // add this to clear the currently selected item
            <Button onClick={clearSelection}>x</Button> 
          </InputContainer>
          <Menu {...getMenuProps()}>
            {isOpen &&
              options
                .filter(item => !inputValue || item.value.includes(inputValue))     // added to narrow down ooptions                .map((item, index) => (
                  <Item
                    {...getItemProps({
                      style: {
                        backgroundColor:
                          index === highlightedIndex ? "lightgray" : null
                      },
                      key: item.value,
                      item,
                      index
                    })}
                  >
                    {item.value}
                  </Item>
                ))}
          </Menu>
        </Form>
      )}
    </Downshift>
  );
};
```

Thanks for reading!