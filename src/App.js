/* UPLOAD TO GRAPHQL DEMO with Apollo DEBUGGING PURPOSE  */
import React, {useState, useRef} from 'react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import gql from 'graphql-tag';
import {ApolloProvider, useMutation} from '@apollo/react-hooks';
import logo from './logo.svg';
import './App.css';

const ENDPOINT = 'http://localhost:8000/graphql';

let uploadLink = createUploadLink({
  uri: ENDPOINT,
  credentials: 'same-origin',
});

const UPLOAD = gql`
  mutation UploadPhoto($file: Upload!) {
    uploadPhoto(file: $file, uploadType: NPWP) {
      url
    }
  }
`;

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

function App() {
  let [file, setFile] = useState(null);
  let [uploadPhoto, result] = useMutation(UPLOAD);
  let uploadEl = useRef(null);

  if (result.called) {
    console.log('mutation result >>>\n', result);
  }

  function submitFile(e) {
    e.preventDefault();
    if (file) {
      console.log('file >>>\n', file);
      uploadPhoto({
        variables: {
          file,
        },
      });
    }
  }

  function clearFile(e) {
    e.preventDefault();
    if (file) {
      uploadEl.current && (uploadEl.current.value = '');
      setFile(null);
    }
  }

  function onFileInput({target}) {
    if (target.files[0]) {
      setFile(target.files[0]);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1> UPLOAD YOUR FILE </h1>
        <input ref={uploadEl} type="file" onChange={onFileInput} />
        <button type="submit" onClick={submitFile}>
          upload
        </button>
        <button type="submit" onClick={clearFile}>
          clear
        </button>
      </header>
    </div>
  );
}

export default function Root() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
