import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import Drawer, { Props } from ".";

export default {
  title: "Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Drawer>;

const DrawerStoryTemplate: ComponentStory<typeof Drawer> = (args: Props) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "800px",
        margin: "50px",
        border: "1px solid black",
        position: "relative",
      }}
    >
      <Drawer {...args}>
        <div style={{ width: "100%", height: "100%", backgroundColor: "red" }}>
          아임 칠드런
        </div>
      </Drawer>
    </div>
  );
};

export const Primary = DrawerStoryTemplate.bind({});
