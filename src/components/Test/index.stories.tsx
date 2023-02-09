import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Test from "./index";

export default {
  title: "components/Test",
  component: Test,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Test>;

const Template: ComponentStory<typeof Test> = (args) => <Test {...args} />;

export const Primary = Template.bind({});
