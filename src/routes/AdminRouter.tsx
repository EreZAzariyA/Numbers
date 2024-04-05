import { BrowserRouter, Routes, Route } from "react-router-dom";

const AdminRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<p>Admin Home</p>} />
    </Routes>
  </BrowserRouter>
);

export default AdminRouter;