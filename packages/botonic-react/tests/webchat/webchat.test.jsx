import React from 'react'
import { Webchat } from '../../src/webchat/webchat'
import TestRenderer, { act, create } from 'react-test-renderer'
import { renderUseWebchatHook } from '../helpers/test-utils'
import ShallowRenderer from 'react-test-renderer/shallow'
import Textarea from 'react-textarea-autosize'

describe.skip('TEST: webchat component', () => {
  it.skip('StyledTriggerButton', () => {
    const root = TestRenderer.create(<Webchat />).root
    expect(
      root.findByProps({ className: 'StyledTriggerButton' })
    ).not.toBeNull()
    expect(root.findByProps({ className: 'TriggerButton' })).not.toBeNull()
  })

  it('TestRenderer webchat open', () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    const root = TestRenderer.create(<Webchat webchatHooks={result.current} />)
      .root
    expect(root.findByProps({ className: 'StyledWebchat' })).not.toBeNull()
  })
})
