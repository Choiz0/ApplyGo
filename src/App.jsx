import "./App.css";
import { Route, Routes } from "react-router-dom";
import "./assets/bootstrap.min.css";
import {
  StatusPage,
  AddApplicationPage,
  ListPage,
  ManageProfilePage,
  ResumePage,
  PortfolioPage,
  AppDetailPage,
  InfoPage,
  LoginPage,
  JobBoard,
} from "./pages";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<StatusPage />} />
          <Route path="/add-application" element={<AddApplicationPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/list/:id" element={<AppDetailPage />} />
          <Route path="/manage-profile" element={<ManageProfilePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/scrapingJobs" element={<JobBoard />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
