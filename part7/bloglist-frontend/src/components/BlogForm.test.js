import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('create new blog', async () => {
  const mockBlogHandler = jest.fn((e) => e.preventDefault())
  const mockTitle = jest.fn()
  const mockAuthor = jest.fn()
  const mockUrl = jest.fn()

  render(
    <BlogForm
      handleBlogSubmit={mockBlogHandler}
      title=""
      setTitle={mockTitle}
      author=""
      setAuthor={mockAuthor}
      url=""
      setUrl={mockUrl}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('send')
  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')

  await user.type(title, 'otsikko')
  await user.type(author, 'tekijä')
  await user.type(url, 'www')
  await user.click(button)

  expect(mockBlogHandler.mock.calls).toHaveLength(1)
})
