import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Select from ".";
import styled from "styled-components";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Select",
  component: Select,
} as ComponentMeta<typeof Select>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Select> = (args) => {
  return (
    <TestWrapper>
      <Select {...args} />
    </TestWrapper>
  );
};
const TestWrapper = styled.div`
  width: 200px;
  height: 40px;
`;
export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  datas: [
    { value: "hi", label: "하이" },
    { value: "heel", label: "헬로" },
  ],

  value: "hi",
};
