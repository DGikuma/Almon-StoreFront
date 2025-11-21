import { Route, Routes } from "react-router-dom";

import StorefrontPage from "@/storefront/page";
import TrackOrderAnimated from "@/order-tracking/page";

function App() {
  return (
    <Routes>
      <Route element={<StorefrontPage />} path="/" />
      <Route path="/order-tracking" element={<TrackOrderAnimated />} />
    </Routes>
  );
}

export default App;
