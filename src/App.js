
import { withAuthenticator } from '@aws-amplify/ui-react';
//import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { Authenticator } from '@aws-amplify/ui-react';
import CreatePost from './components/CreatePost';
import DisplayPosts from './components/DisplayPosts';

function App() {
  return (
    <div className="App">
      <Authenticator socialProviders={['amazon', 'apple', 'facebook', 'google']}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>

      < CreatePost />
      < DisplayPosts />
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings:true })
