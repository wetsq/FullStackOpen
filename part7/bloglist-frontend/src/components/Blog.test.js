import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const mockBlogHandler = jest.fn()
  const mockLikeHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'otsikko',
      author: 'tekijä',
      url: 'www.www',
      likes: 3,
      user: {
        name: 'käyttäjä',
        username: 'käyttäjätunnus',
      },
    }
    const user = {
      username: 'käyttäjätunnus',
    }
    render(
      <Blog
        blog={blog}
        user={user}
        handleBlogSubmit={mockBlogHandler}
        handleLike={mockLikeHandler}
      />
    )
  })

  test('renders content with title', async () => {
    const element = screen.getByText('otsikko tekijä')
    expect(element).toBeDefined
  })

  test('when view-button pressed, displays data', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('www.www', { exact: false })
    expect(url).toBeDefined

    const likes = screen.getByText('3', { exact: false })
    expect(likes).toBeDefined

    const käyttäjä = screen.getByText('käyttäjä', { exact: false })
    expect(käyttäjä).toBeDefined
  })

  test('like-button calls handleLike', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
