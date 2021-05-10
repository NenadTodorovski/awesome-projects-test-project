import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import MainPage from './pages/MainPage';
import ProjectPage from './pages/ProjectPage';

const cache = new InMemoryCache();
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
}

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  defaultOptions: defaultOptions,
})

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <header style={{ backgroundColor: 'rgb(175, 175, 175)', borderBottom: '1px solid rgb(155, 155, 155)' }}>
          <h1 style={{ padding: "15px 0px", textAlign: 'center' }}>Awesome Projects Tracker</h1>
        </header>
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/project/:projectId' component={ProjectPage} />
          <Route path="/*" render={() => <div style={{ position: 'fixed', top: "40vh", left: "30%", fontSize: "28pt" }}>Something went wrong... Please go <Link to="/">back</Link>!</div>} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
