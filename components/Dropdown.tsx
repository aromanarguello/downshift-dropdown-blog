import * as React from "react";
import Downshift from "downshift";
import styled from "styled-components";

type OptionType = {
  value?: string;
};

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

const Dropdown: React.FC<IDropdownProps> = ({ options }) => {
  return (
    <Downshift>
      {({ getInputProps, getMenuProps, getRootProps, getItemProps }) => (
        <Form {...getRootProps()}>
          <Input {...getInputProps()} />
          <Menu {...getMenuProps()}>
            {options.map((item, index) => (
              <Item
                {...getItemProps({
                  item: item,
                  index: index
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
