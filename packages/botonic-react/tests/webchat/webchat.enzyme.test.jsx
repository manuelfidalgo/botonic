import React from 'react'
import { Webchat } from '../../src/webchat/webchat'
import TestRenderer, { act, create } from 'react-test-renderer'
import { renderUseWebchatHook } from '../helpers/test-utils'
import { shallow, configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { render, screen } from '@testing-library/react'

configure({ adapter: new Adapter() })

describe.skip('TEST: enzyme webchat component', () => {
  const theme = {
    style: {
      width: 400,
      height: 500,
    },
    persistentMenu: [
      { label: 'Help', payload: 'help' },
      {
        label: 'See docs',
        url: 'https://docs.botonic.io',
      },
      { closeLabel: 'Close' },
    ],
    enableEmojiPicker: true,
    enableAttachments: true,
  }

  it('StyledTriggerButton', () => {
    const wrapper = shallow(<Webchat />)
    expect(wrapper.find('.StyledTriggerButton')).toHaveLength(1)
    expect(wrapper.find('.TriggerButton')).toHaveLength(1)
    expect(wrapper.find('.StyledWebchat')).toHaveLength(0)
  })

  it('open webchat has by default', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.StyledWebchat')).toHaveLength(1)
    expect(wrapper.find('.WebchatMessageList')).toHaveLength(1)
    expect(
      wrapper.find('.WebchatMessageList').dive().find('.StyledScrollbar')
    ).toHaveLength(1)
    expect(
      wrapper.find('.WebchatMessageList').dive().find('.StyledMessages')
    ).toHaveLength(0)
    expect(wrapper.find('.UserInputContainer')).toHaveLength(1)
    expect(wrapper.find('.StyledWebchatHeader')).toHaveLength(1)
    expect(wrapper.find('.TextAreaContainer')).toHaveLength(1)
    //expect(wrapper.find('.Textarea')).toHaveLength(1)
    expect(wrapper.find('.SendButton')).toHaveLength(1)
  })

  it('open webchat does not have by default', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.StyledTriggerButton')).toHaveLength(0)
    expect(wrapper.find('.Text')).toHaveLength(0)
    //expect(wrapper.find('.WebchatMessageList')).toHaveLength(0) //1
    expect(wrapper.find('.TypingIndicator')).toHaveLength(0)
    expect(wrapper.find('.EmojiPicker')).toHaveLength(0)
    expect(wrapper.find('.PersistentMenu')).toHaveLength(0)
    expect(wrapper.find('.Attachment')).toHaveLength(0)
    expect(wrapper.find('.WebviewContainer')).toHaveLength(0)
    expect(wrapper.find('.OpenedEmojiPicker')).toHaveLength(0)
    expect(wrapper.find('.OpenedPersistentMenu')).toHaveLength(0)
  })

  it('updateTyping', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTyping(true)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.TypingIndicator')).toHaveLength(1)
  })

  it('Enable emojiPicker, attachments and define persistent menu', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.PersistentMenu')).toHaveLength(1)
    expect(wrapper.find('.EmojiPicker')).toHaveLength(1)
    expect(wrapper.find('.Attachment')).toHaveLength(1)
    expect(wrapper.find('.SendButton')).toHaveLength(1)
    expect(wrapper.find('.OpenedEmojiPicker')).toHaveLength(0)
    expect(wrapper.find('.OpenedPersistentMenu')).toHaveLength(0)
  })

  it('Open EmojiPicker', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
      result.current.toggleEmojiPicker(true)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.PersistentMenu')).toHaveLength(1)
    expect(wrapper.find('.EmojiPicker')).toHaveLength(1)
    expect(wrapper.find('.Attachment')).toHaveLength(1)
    expect(wrapper.find('.SendButton')).toHaveLength(1)
    expect(wrapper.find('.UserInputContainer')).toHaveLength(1)
    expect(wrapper.find('.OpenedEmojiPicker')).toHaveLength(1)
    expect(
      wrapper.find('.EmojiPicker').dive().find('.IconContainerEmojiPicker')
    ).toHaveLength(1)
    expect(wrapper.find('.OpenedPersistentMenu')).toHaveLength(0)
  })

  it('Open PersistentMenu', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
      result.current.togglePersistentMenu(true)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.PersistentMenu')).toHaveLength(1)
    expect(wrapper.find('.EmojiPicker')).toHaveLength(1)
    expect(wrapper.find('.Attachment')).toHaveLength(1)
    expect(wrapper.find('.SendButton')).toHaveLength(1)
    expect(wrapper.find('.UserInputContainer')).toHaveLength(1)
    expect(wrapper.find('.OpenedEmojiPicker')).toHaveLength(0)
    expect(wrapper.find('.OpenedPersistentMenu')).toHaveLength(0) // ------
  })

  it('Disable sendButton', () => {
    const { result } = renderUseWebchatHook()
    theme.enableSendButton = false
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.PersistentMenu')).toHaveLength(1)
    expect(wrapper.find('.EmojiPicker')).toHaveLength(1)
    expect(wrapper.find('.Attachment')).toHaveLength(1)
    expect(wrapper.find('.SendButton')).toHaveLength(0)
    expect(wrapper.find('.UserInputContainer')).toHaveLength(1)
  })

  it('Disable UserInput', () => {
    const { result } = renderUseWebchatHook()
    theme.enableSendButton = true
    theme.enableUserInput = false
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    const wrapper = shallow(<Webchat webchatHooks={result.current} />)
    expect(wrapper.find('.PersistentMenu')).toHaveLength(0)
    expect(wrapper.find('.EmojiPicker')).toHaveLength(0)
    expect(wrapper.find('.Attachment')).toHaveLength(0)
    expect(wrapper.find('.SendButton')).toHaveLength(0)
    expect(wrapper.find('.UserInputContainer')).toHaveLength(0)
  })
})
