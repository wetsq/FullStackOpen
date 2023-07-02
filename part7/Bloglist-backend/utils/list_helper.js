const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    for(const blog of blogs){
        likes += blog.likes
    }
    return likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    const mostLikes = Math.max(...blogs.map((blog) => blog.likes))
    const favorite = blogs.find((blog) => blog.likes === mostLikes)
    return(
        {
            title: favorite.title,
            author: favorite.author,
            likes: favorite.likes
        }
    )
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const authors = []
    for (i in blogs) {
        if (authors.find(author => author.author === blogs[i].author)) {
            const author = authors.find(author => author.author === blogs[i].author).author
            authors[authors.map(a => a.author).indexOf(author)].blogs += 1
        }
        else {
            authors.push(
                {
                    author: blogs[i].author,
                    blogs: 1
                }
            )
        }
    }
    const mostBlogs = Math.max(...authors.map((author) => author.blogs))
    return authors.find((author) => author.blogs === mostBlogs)
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const authors = []
    for (i in blogs) {
        if (authors.find(author => author.author === blogs[i].author)) {
            const author = authors.find(author => author.author === blogs[i].author).author
            authors[authors.map(a => a.author).indexOf(author)].likes += Number(blogs[i].likes)
        }
        else {
            authors.push(
                {
                    author: blogs[i].author,
                    likes: blogs[i].likes
                }
            )
        }
    }
    const mostLikes = Math.max(...authors.map((author) => author.likes))
    return authors.find((author) => author.likes === mostLikes)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}