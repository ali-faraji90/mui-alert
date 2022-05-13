import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Alert from './Alert'

export default {
    title: "My Alert Dialog",
    component: Alert,
} as ComponentMeta<typeof Alert>

const MainTemplate: ComponentStory<typeof Alert> = (args) => <Alert {...args} />

export const Main = MainTemplate.bind({})

Main.args = {
    open: true,
    title: "Test",
    message: <em>This is a test message.</em>
}


