import React, { Component } from 'react'
import { listPosts } from '../graphql/queries'
import { onCreatePost, onDeletePost, onUpdatePost } from '../graphql/subscriptions'
import { API, graphqlOperation } from 'aws-amplify'
import DeletePost from './DeletePosts'
import EditPost from './EditPost'

class DisplayPosts extends Component {

    state = {
        posts: []
    }

    componentDidMount = async () => {
        this.getPosts()

        this.createPostListener = API.graphql(graphqlOperation(onCreatePost)) //listens for new posts
            .subscribe({
                next: postData => {
                    const newPost = postData.value.data.onCreatePost //gets the newest post
                    const prevPosts = this.state.posts.filter( post => post.id !== newPost.id) //gets the old posts

                    const updatedPosts = [newPost, ...prevPosts] //concats new and old posts together
                
                    this.setState({ posts: updatedPosts}) //sets the state of the 'posts' to show new post
                }
            })
        this.deletePostListener = API.graphql(graphqlOperation(onDeletePost))
            .subscribe({
                next: postData => {
                    const deletedPost = postData.value.data.onDeletePost
                    const updatedPosts = this.state.posts.filter(post => post.id !== deletedPost.id)
                    this.setState({posts: updatedPosts})
                }
            })
        this.updatePostListener = API.graphql(graphqlOperation(onUpdatePost))
                .subscribe({
                     next: postData => {
                          const { posts } = this.state
                          const updatePost = postData.value.data.onUpdatePost
                          const index = posts.findIndex(post => post.id === updatePost.id) //had forgotten to say updatePost.id!
                          const updatePosts = [
                              ...posts.slice(0, index),
                             updatePost,
                             ...posts.slice(index + 1)
                            ]

                            this.setState({ posts: updatePosts})
                }
            })
    }

    componentWillUnmount() {
        this.createPostListener.unsubscribe()
        this.deletePostListener.unsubscribe()
        this.updatePostListener.unsubscribe()
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))
        this.setState({ posts: result.data.listPosts.items })
        //console.log("All Posts: ", JSON.stringify(result.data.listPosts.items))
    }

    render(){
        const { posts } = this.state

        return posts.map(( post ) => {
            return (
                <div className="posts" style={rowStyle} key={ post.id }>
                    <h1> { post.postTitle }</h1>
                    <span style={{fontStyle:'italic', color: '#0ca5e297'}}>
                        { "Wrote by: " } { post.postOwnerUsername}
                        {" on "}
                        <time style={{fontStyle:'italic'}}>
                            {" "}
                            {new Date(post.createdAt).toDateString()}
                        </time>    
                    </span>
                    <p> { post.postBody} </p>

                    <br/>
                    <span>
                        <DeletePost data={post} />
                        <EditPost {...post}/>
                    </span>

                </div>
            )
        })
    }
}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}

export default DisplayPosts