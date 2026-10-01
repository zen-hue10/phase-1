import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import Overview from "./pages/app/Overview";
import Planner from "./pages/app/Planner";
import SessionRunner from "./pages/app/SessionRunner";
import History from "./pages/app/History";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/app" element={<Overview />} />
        <Route path="/app/plan" element={<Planner />} />
        <Route path="/app/session/:id" element={<SessionRunner />} />
        <Route path="/app/history" element={<History />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
