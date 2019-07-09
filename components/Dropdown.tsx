import * as React from "react";
import Downshift from "downshift";
import styled from "styled-components";

type OptionType = {
  value?: string;
};

interface IDropdownProps {
  options: OptionType[];
  onChange?: (selectedItem: string) => void;
}

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
  width: 100%;
`;

const Button = styled.button`
  width: 20px;
  text-align: center;
  padding: 0;
`;

const InputContainer = styled.div`
  display: flex;
`;

const Dropdown: React.FC<IDropdownProps> = ({ options, onChange }) => {
  return (
    <Downshift
      onChange={selectedItem =>
        onChange(selectedItem ? selectedItem.value : "")
      }
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
        inputValue,
        clearSelection
      }) => (
        <Form {...getRootProps()}>
          <InputContainer>
            <Input {...getInputProps()} />
            <Button {...getToggleButtonProps()}>{isOpen ? "-" : "+"}</Button>
            <Button onClick={clearSelection}>x</Button>
          </InputContainer>
          <Menu {...getMenuProps()}>
            {isOpen &&
              options
                .filter(item => !inputValue || item.value.includes(inputValue))
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

export default Dropdown;
