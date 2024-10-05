import './App.css';

import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, MyStock, Navbar, Generator, Explore } from './components';
import {
  login,
  logout,
  fileToGenerativePart,
  httpClient,
  pinImageToPinata,
} from './utils/';

const genAi = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(window.auth.isAuthenticated);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState();
  const [inlineData, setInlineData] = useState();

  const [aiResponse, setAiResponse] = useState();

  const [showPreview, setShowPreview] = useState(false);

  const [delLoading, setDelLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [userContexts, setUserContexts] = useState([]);
  const [otherContexts, setOtherContexts] = useState([]);

  useEffect(() => {
    async function run() {
      const { err, data } = await httpClient.getUserContexts({
        userId: window.auth.principalText,
      });

      if (err) {
        console.error(err);
        return;
      }

      console.log(data);
      setUserContexts(data);
    }

    run();
  }, [isLoggedIn]);

  useEffect(() => {
    async function run() {
      const { err, data } = await httpClient.getOthersContexts({
        userId: window.auth.principalText,
      });

      if (err) {
        console.error(err);
        return;
      }

      console.log(data);
      setOtherContexts(data);
    }

    run();
  }, [isLoggedIn]);

  function handleAuth() {
    if (isLoggedIn) {
      logout();
      setIsLoggedIn(!window.auth.isAuthenticated);
    } else {
      login();
      setIsLoggedIn(!window.auth.isAuthenticated);
    }
  }

  async function handleImage(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    const inlineData = await fileToGenerativePart(file);

    setFile(file);
    setImage(url);
    setInlineData(inlineData);
  }

  async function handleGenerateClick() {
    setGenLoading(true);
    if (!inlineData) {
      alert('Please select an Image!!');
      setGenLoading(false);
      return;
    }

    if (aiResponse) {
      setAiResponse('');
    }

    if (saveLoading) {
      alert('saving a generated content, please hold on...');
      setGenLoading(false);
      return;
    }

    const result = await model.generateContent([
      'give me context about this image in exactly 4 lines.',
      inlineData,
    ]);

    const text = result.response.text;
    setAiResponse(text);
    setGenLoading(false);
  }

  async function handleSaveClick() {
    setSaveLoading(true);

    if (!isLoggedIn) {
      alert('cannot save: user not logged in');
      setSaveLoading(false);
      return;
    }

    if (!file) {
      alert('cannot save: an image must be selected!');
      setSaveLoading(false);
      return;
    }

    if (!(inlineData && aiResponse)) {
      alert('cannot save: no AI response have been generated');
      setSaveLoading(false);
      return;
    }

    const imageUrl = await pinImageToPinata(file);

    if (!imageUrl) {
      alert('cannot save: an error occurred while creating image url');
      setSaveLoading(false);
      return;
    }

    const { err, data } = await httpClient.createContext({
      userId: window.auth.principalText,
      imageUrl,
      text: aiResponse,
    });

    if (err) {
      alert(err);
      setSaveLoading(false);
      return;
    }

    const newContexts = [...userContexts, data.context];
    setUserContexts(newContexts);
    setFile(null);
    setSaveLoading(false);

    console.log({ data });
    window.location.reload();
  }

  function handlePreviewClick() {
    if (inlineData) {
      setShowPreview(!showPreview);
    }
  }

  async function handleDeleteClick({ id, userId }) {
    setDelLoading(true);
    if (userId !== window.auth.principalText) {
      alert(
        'cannot delete: mismatch in ownership. it seems you did not create this context'
      );
      setDelLoading(false);
      return;
    }

    const { err, data } = await httpClient.deleteContext({
      userId,
      id,
    });

    if (err) {
      alert(err);
      setDelLoading(false);
      return;
    }

    setUserContexts(data.contexts);
    alert(data.msg);
    setDelLoading(false);
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} handleAuth={handleAuth} />
                <Home />
              </>
            }
          />

          <Route
            path="/mystock"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} handleAuth={handleAuth} />
                <MyStock
                  isLoggedIn={isLoggedIn}
                  contexts={userContexts}
                  loading={delLoading}
                  currentUser={window.auth.principalText}
                  deleteFunc={handleDeleteClick}
                />
              </>
            }
          />

          <Route
            path="/generator"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} handleAuth={handleAuth} />
                <Generator
                  isLoggedIn={isLoggedIn}
                  image={image}
                  file={file}
                  showPreview={showPreview}
                  genLoading={genLoading}
                  saveLoading={saveLoading}
                  aiResponse={aiResponse}
                  handleImage={handleImage}
                  handleSaveClick={handleSaveClick}
                  handlePreviewClick={handlePreviewClick}
                  handleGenerateClick={handleGenerateClick}
                />
              </>
            }
          />

          <Route
            path="/explore"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} handleAuth={handleAuth} />
                <Explore
                  isLoggedIn={isLoggedIn}
                  contexts={otherContexts}
                  currentUser={window.auth.principalText}
                  loading={delLoading}
                  deleteFunc={handleDeleteClick}
                />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
