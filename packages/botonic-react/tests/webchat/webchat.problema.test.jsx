import React, { createRef } from 'react'
import { Webchat } from '../../src/webchat/webchat'
import TestRenderer, { act } from 'react-test-renderer'
import { renderUseWebchatHook } from '../helpers/test-utils'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Textarea from 'react-textarea-autosize'

configure({ adapter: new Adapter() })

describe('TEST: webchat component', () => {
  it('TestRenderer webchat close', () => {
    const root = TestRenderer.create(<Webchat />).root
    expect(
      root.findByProps({ className: 'StyledTriggerButton' })
    ).not.toBeNull()
    expect(root.findByProps({ className: 'TriggerButton' })).not.toBeNull()
  })

  it('TestRenderer webchat open', () => {
    const ref = createRef()
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    const root = TestRenderer.create(
      <Webchat ref={ref} webchatHooks={result.current} />
    ).root
    expect(root.findByProps({ className: 'StyledWebchat' })).not.toBeNull()
  })

  it('enzyme webchat close', () => {
    const wrapper = shallow(<Webchat />)
    expect(wrapper.find('.StyledTriggerButton')).toHaveLength(1)
    expect(wrapper.find('.TriggerButton')).toHaveLength(1)
    expect(wrapper.find('.StyledWebchat')).toHaveLength(0)
  })

  it('enzyme webchat open', () => {
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
    expect(wrapper.find('.Textarea')).toHaveLength(1)
    expect(wrapper.find('.SendButton')).toHaveLength(1)
  })
})
