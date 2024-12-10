//npm start
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageWrapper from "./components/PageWrapper"; // Wrapper global
import Home from "./pages/Home";
import ChainInfo from "./pages/ChainInfo";
import ErrorPage from "./pages/ErrorPage";
import NotFound from "./pages/NotFound";
import FakeBayc from "./pages/FakeBayc";
import FakeBaycToken from "./pages/FakeBaycToken";
import FakeNefturians from "./pages/FakeNefturians";
import FakeNefturiansUser from "./pages/FakeNefturiansUser";
import FakeMeebits from "./pages/FakeMeebits";
import './App.css';

function App() {
  return (
    <Router>
      <PageWrapper> {/* PageWrapper appliqué globalement */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chain-info" element={<ChainInfo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/fakeBayc" element={<FakeBayc />} />
          <Route path="/fakeBayc/:tokenId" element={<FakeBaycToken />} />
          <Route path="/fakeNefturians" element={<FakeNefturians />} />
          <Route path="/fakeNefturians/:userAddress" element={<FakeNefturiansUser />} />
          <Route path="/fakeMeebits" element={<FakeMeebits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
